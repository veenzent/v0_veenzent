import { ReactNode } from "react";

export type ButtonProps = {
    variant?: "primary" | "outline";
    children: ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    variant = "primary",
    children,
    className = "",
    ...rest
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center px-6 py-3 rounded text-sm font-medium transition-colors";
    const variants = {
        primary:
            "bg-[var(--foreground)] text-[var(--primary-foreground)] border border-[var(--foreground)] hover:opacity-90",
        outline:
            "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}
