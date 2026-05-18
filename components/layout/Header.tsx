import { useRouter } from "next/router";
import NavLink from "@/components/ui/NavLink";

export default function Header() {
    const { pathname } = useRouter();

    return (
        <header className="py-6 md:py-10">
            <div className="container mx-auto px-5 md:px-8 max-w-5xl">
                {/* Mobile: Logo and icons */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <div className="font-mono text-(--foreground) text-lg font-semibold tracking-tight">
                        &lt;veenzent/&gt;
                    </div>
                    <div className="flex gap-5">
                        <a
                            href="https://github.com/veenzent"
                            className="flex items-center justify-center w-5 h-5 text-(--foreground)"
                            aria-label="GitHub"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577
                    0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73
                    1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93
                    0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23
                    a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23
                    .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921
                    .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12
                    c0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://veenzent.cv"
                            className="flex items-center justify-center w-5 h-5 text-(--foreground)"
                            aria-label="Resume"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Mobile: Horizontal scroll nav */}
                <div className="md:hidden overflow-x-auto hide-scrollbar">
                    <nav className="flex gap-4 justify-center px-5 pb-2">
                        <NavLink href="/" active={pathname === "/"}>
                            Home
                        </NavLink>
                        <NavLink href="/about" active={pathname === "/about"}>
                            About
                        </NavLink>
                        <NavLink href="/projects" active={pathname === "/projects"}>
                            Projects
                        </NavLink>
                        <NavLink href="/blog" active={pathname === "/blog"}>
                            Blogs
                        </NavLink>
                        <NavLink href="/contact" active={pathname === "/contact"}>
                            Contacts
                        </NavLink>
                    </nav>
                </div>

                {/* Desktop: Centered layout */}
                <div className="hidden md:flex justify-between items-center gap-8">
                    <div className="font-mono text-(--foreground) text-lg font-semibold tracking-tight">
                        &lt;veenzent/&gt;
                    </div>
                    <nav className="flex gap-8">
                        <NavLink href="/" active={pathname === "/"}>
                            Home
                        </NavLink>
                        <NavLink href="/about" active={pathname === "/about"}>
                            About
                        </NavLink>
                        <NavLink href="/projects" active={pathname === "/projects"}>
                            Projects
                        </NavLink>
                        <NavLink href="/blog" active={pathname === "/blog"}>
                            Blogs
                        </NavLink>
                        <NavLink href="/contact" active={pathname === "/contact"}>
                            Contacts
                        </NavLink>
                    </nav>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/veenzent"
                            className="flex items-center gap-2 text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577
                    0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73
                    1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93
                    0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23
                    a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23
                    .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921
                    .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12
                    c0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href="https://veenzent.cv"
                            className="text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)"
                        >
                            Resume
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
