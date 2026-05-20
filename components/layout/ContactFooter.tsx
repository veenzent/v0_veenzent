export default function ContactFooter() {
    return (
        <section className="py-32 bg-(--secondary) border-t border-(--border)">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-3xl font-medium leading-tight mb-6 text-(--foreground)">
                    Let's build something remarkable.
                </h2>
                <p className="text-lg text-(--muted-foreground) mb-8">
                    Have an ambitious idea, a project outline, or just want to
                    say hello? I'm interested in hearing from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        className="inline-flex items-center justify-center px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium hover:opacity-90 transition-opacity"
                        href="#"
                    >
                        Get in Touch
                    </a>
                    <a
                        className="inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium hover:bg-(--muted) transition-colors"
                        href="#"
                    >
                        Access Project Portal
                    </a>
                </div>
                <div className="mt-32 pt-8 border-t border-(--border) flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <div className="flex items-center gap-6 px-4">
                        {/* GitHub */}
                        <a
                            href="https://github.com/veenzent"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                            aria-label="GitHub"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921.43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a
                            href="https://linkedin.com/in/veenzent"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                            aria-label="LinkedIn"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.047-8.842 0-9.769h3.554v1.383c.43-.664 1.199-1.608 2.925-1.608 2.136 0 3.738 1.394 3.738 4.389v5.605zM5.337 9.433c-1.144 0-1.915-.761-1.915-1.712 0-.951.77-1.71 1.951-1.71 1.18 0 1.914.759 1.914 1.71 0 .951-.771 1.712-1.95 1.712zm1.581 11.019H3.756V9.684h3.162v10.768zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                        </a>
                        {/* Twitter/X */}
                        <a
                            href="https://twitter.com/veenzent"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                            aria-label="Twitter"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.997 6.802H2.421l7.727-8.835L1.497 2.25h6.886l4.713 6.231 5.422-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
                            </svg>
                        </a>
                        {/* Mail */}
                        <a
                            href="mailto:hello@veenzent.dev"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                            aria-label="Email"
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </a>
                    </div>
                    <p className="text-sm text-(--muted-foreground)">
                        © 2026 veenzent. All rights reserved.
                    </p>
                </div>
            </div>
        </section>
    );
}
