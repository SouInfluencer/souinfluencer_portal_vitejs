import React from 'react';
import {cn} from "./cn.ts";

// Interfaces para tipagem dos props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

// Componente Card principal
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("bg-white rounded-xl shadow-md overflow-hidden", className)}
            {...props}
        >
            {children}
        </div>
    )
);
Card.displayName = "Card";

// Componente CardHeader
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("p-6 flex flex-col space-y-1.5", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardHeader.displayName = "CardHeader";

// Componente CardTitle
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("font-semibold text-xl text-gray-900 leading-none tracking-tight", className)}
            {...props}
        >
            {children}
        </h3>
    )
);
CardTitle.displayName = "CardTitle";

// Componente CardDescription
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-gray-500", className)}
            {...props}
        >
            {children}
        </p>
    )
);
CardDescription.displayName = "CardDescription";

// Componente CardContent
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("p-6 pt-0", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = "CardContent";

// Componente CardFooter
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("p-6 pt-0 flex items-center", className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardFooter.displayName = "CardFooter";

// Utilitário para concatenação condicional de classes
// Este código deve estar em um arquivo separado '../utils/cn.ts'
// export function cn(...inputs: (string | undefined)[]) {
//   return inputs.filter(Boolean).join(" ");
// }