import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-xs font-semibold uppercase px-3 py-1 tracking-[0.02em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
            {children}
        </span>
    );
}
