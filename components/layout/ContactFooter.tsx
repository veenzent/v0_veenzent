import FooterSocials from "@/components/layout/FooterSocials";

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
                        href="/contacts"
                    >
                        Get in Touch
                    </a>
                    <a
                        className="inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium hover:bg-(--muted) transition-colors"
                        href="/projects"
                    >
                        Access Project Portal
                    </a>
                </div>
                <FooterSocials />
            </div>
        </section>
    );
}
