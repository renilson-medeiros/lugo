"use client";

import TenantForm from "@/modules/dashboard/TenantForm";
import { Suspense } from 'react';

export default function PropertyTenantRegistrationPage() {
    return (
        <Suspense fallback={<div>Carregando formulário...</div>}>
            <TenantForm />
        </Suspense>
    );
}
