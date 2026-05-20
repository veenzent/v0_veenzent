import Link from "next/link";
import { ReactNode } from "react";

export default function NavLink({
    href,
    children,
    active = false,
}: {
    href: string;
    children: ReactNode;
    active?: boolean;
}) {
    return (
        <Link href={href} legacyBehavior>
            <a
                className={`text-sm font-medium transition-colors ${
                    active
                        ? "text-(--foreground)"
                        : "text-(--muted-foreground) hover:text-(--foreground)"
                }`}
            >
                {children}
            </a>
        </Link>
    );
}
