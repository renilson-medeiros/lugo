# Planejamento: Otimização de Cadastros (Imóveis e Inquilinos)

Este documento detalha as melhorias necessárias nos formulários de cadastro para resolver gargalos de performance e falhas silenciosas durante o envio de dados e imagens.

## 1. Problema Identificado
Atualmente, as funções de `handleSubmit` nos arquivos `PropertyForm.tsx` e `TenantForm.tsx` processam o upload de imagens de forma **sequencial** dentro de um loop `for...of`.

**Impacto:**
- Se o usuário sobe 8 fotos, a segunda foto só começa a carregar após a primeira terminar.
- Em conexões lentas, isso multiplica o tempo de espera pelo número de arquivos.
- A probabilidade de timeout ou erro de rede aumenta linearmente com o número de fotos.
- O botão de "Salvando..." não indica o progresso real (fotos vs. dados).

---

## 2. Soluções Propostas

### 2.1 Envio em Paralelo (Parallel Uploads)
Substituir o loop sequencial por um `Promise.all`.

**Estrutura técnica sugerida:**
```typescript
// Em vez de:
// for (const photo of photos) { await upload(photo); }

// Usar:
const uploadPromises = photos.map(async (photo) => {
  const fileName = `${user.id}/${propertyId}/photos/${Date.now()}-${photo.name}`;
  const { error } = await supabase.storage.from('imoveis-fotos').upload(fileName, photo);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('imoveis-fotos').getPublicUrl(fileName);
  return publicUrl;
});

const uploadedPhotosUrls = await Promise.all(uploadPromises);
```

### 2.2 Melhoria no Feedback de Estado
Implementar sub-estados durante a submissão para evitar a percepção de "travamento".

- **Estado 1:** "Validando formulário..."
- **Estado 2:** "Enviando imagens (X de Y)..." (Opcional, mas recomendado) ou simplesmente "Enviando imagens em alta velocidade..."
- **Estado 3:** "Finalizando cadastro..."

---

## 3. Arquivos a serem Modificados

1. `src/modules/dashboard/PropertyForm.tsx`:
   - Refatorar a lógica de upload de fotos do imóvel.
2. `src/modules/dashboard/TenantForm.tsx`:
   - Refatorar a lógica de upload do contrato do inquilino.

---

## 4. Plano de Verificação (Após implementação)
1. **Teste de Carga:** Subir 8 imagens de 5MB cada e comparar o tempo total com a versão anterior.
2. **Teste de Resiliência:** Simular erro em 1 das 8 imagens e garantir que o sistema não salve um registro corrompido ou incompleto.

---
*Documento criado em: 2025-12-28*
