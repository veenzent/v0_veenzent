export default function ContactFooter() {
    return (
        <section className="py-32 bg-(--secondary) border-t border-(--border)">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-3xl font-medium leading-tight mb-6 text-(--foreground)">
                    Let's build something remarkable.
                </h2>
                <p className="text-lg text-(--muted-foreground) mb-8">
                    Have an ambitious idea, a project outline, or just want to say hello?
                    I'm interested in hearing from you.
                </p>
                <div className="flex gap-4">
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
                <div className="mt-32 pt-8 border-t border-(--border) flex justify-between items-center">
                    <p className="text-sm text-(--muted-foreground)">
                        © 2026 veenzent. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {/* use icons or placeholder */}
                        <a
                            href="#"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="#"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="#"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                        >
                            Mail
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
