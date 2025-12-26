import { z } from 'zod';
import { validarCPF, validarTelefone, validarSenha } from './validators';

/**
 * Esquema de validação para Login
 */
export const loginSchema = z.object({
    email: z.string().email('Digite um e-mail válido'),
    password: z.string().min(1, 'Digite sua senha'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Esquema de validação para Cadastro
 */
export const registerSchema = z.object({
    name: z.string()
        .min(1, 'Nome é obrigatório')
        .refine(val => val.trim().split(' ').length >= 2, 'Digite seu nome completo'),

    email: z.string()
        .min(1, 'E-mail é obrigatório')
        .email('Digite um e-mail válido'),

    cpf: z.string()
        .min(1, 'CPF é obrigatório')
        .refine(val => validarCPF(val), 'CPF inválido'),

    phone: z.string()
        .min(1, 'Telefone é obrigatório')
        .refine(val => validarTelefone(val), 'Telefone inválido'),

    password: z.string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .refine(val => validarSenha(val).valida, {
            message: 'Senha fraca: combine letras maiúsculas, minúsculas e números',
        }),

    confirmPassword: z.string()
        .min(1, 'Confirmação de senha é obrigatória'),

    acceptTerms: z.boolean()
        .refine(val => val === true, 'Você deve aceitar os termos de uso'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
