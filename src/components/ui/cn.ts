import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes condicionalmente com suporte para classes do Tailwind
 *
 * Este utilitário combina a funcionalidade de clsx para concatenação condicional de classes
 * com twMerge para resolver conflitos específicos do Tailwind CSS
 *
 * @param inputs - Classes CSS, objetos condicionais ou arrays
 * @returns String com as classes combinadas e otimizadas
 *
 * Exemplo de uso:
 * ```tsx
 * <div className={cn(
 *   "base-class",
 *   condition && "conditional-class",
 *   { "object-based-class": anotherCondition },
 *   props.className
 * )}>
 *   Conteúdo
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Versão simplificada da função cn, sem dependências externas
 * Pode ser usada se não quiser adicionar as dependências clsx e tailwind-merge
 *
 * @param inputs - Strings de classes CSS ou undefined
 * @returns String com as classes combinadas
 */
export function cnSimple(...inputs: (string | undefined)[]) {
    return inputs.filter(Boolean).join(" ");
}