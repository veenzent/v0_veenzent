import Badge from "../ui/Badge";
import Button from "../ui/Button";
import CodeSnippetsBackground from "../ui/CodeSnippetsBackground";

export default function Hero() {
    return (
        <section className="py-32 relative overflow-hidden">
            <CodeSnippetsBackground />
            <div className="container mx-auto max-w-3xl">
                <div className="relative z-10">
                    <Badge>Available for new opportunities</Badge>
                    <h1 className="mt-6 text-4xl font-medium leading-tight text-(--foreground)">
                        Systems that stay up.
                        <br />
                        Quietly powering products.
                    </h1>
                    <p className="mt-6 max-w-lg text-lg text-(--muted-foreground)">
                        I'm Vincent Odume, a backend-leaning software engineer
                        focused on reliable APIs, pragmatic architecture, and
                        turning complex systems into calm, maintainable code.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Button variant="primary" className="cursor-pointer">View Projects</Button>
                        <Button variant="outline" className="cursor-pointer">View Blog Posts</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
