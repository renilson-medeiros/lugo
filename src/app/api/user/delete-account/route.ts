import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const admin = createAdminClient();

        // Deleta o usuário do sistema de autenticação
        // Isso deve disparar o ON DELETE CASCADE para profiles e outras tabelas
        const { error } = await admin.auth.admin.deleteUser(user.id);

        if (error) throw error;

        // Desloga o usuário da sessão atual (embora o token vá invalidar logo)
        await supabase.auth.signOut();

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Erro ao excluir conta:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao excluir conta' },
            { status: 500 }
        );
    }
}
