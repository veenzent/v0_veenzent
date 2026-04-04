import ComplimentRotator from "@/components/pageSections/ComplimentRotator";
import VeenzentPng from "@/assets/veenzent.png";
import Cent from "@/assets/cent-edited.png";

export default function AboutSection() {
    const unpaidCompliments = [
        {
            text: "Vincent was incredibly effective at quickly understanding the problem space and delivering high-quality backend architecture.",
            author: "Anonymous Nicole, Product Lead",
        },
        {
            text: "His focus on reliability and maintainability saved us weeks of technical debt down the road.",
            author: "Anonymous Ahmed, Engineering Manager",
        },
    ];

    return (
        <section className="py-24">
            <div
                className="container mx-auto max-w-5xl"
                style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: "4rem",
                    alignItems: "start",
                }}
            >
                <h2
                    className="text-sm font-semibold uppercase text-(--foreground)"
                    style={{ paddingTop: "0.25rem" }}
                >
                    About
                </h2>
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <img
                        // src={VeenzentPng.src}
                        src={Cent.src}
                        alt="Portrait"
                        className="w-full h-auto rounded shadow-sm object-cover grayscale contrast-110 bg-(--muted)"
                    />
                    <div className="flex flex-col gap-6">
                        <div className="space-y-4 text-sm text-(--muted-foreground)">
                            <p>
                                Hello! I&apos;m Vincent — a backend-leaning
                                software developer with a strong focus on
                                building fast, secure, and reliable web systems.
                                I enjoy turning complex ideas into scalable
                                solutions that behave predictably under
                                real-world demands.
                            </p>
                            <p>
                                From architecting MVPs for startups to refining
                                legacy systems and designing robust internal
                                APIs, I bring products to life using modern,
                                industry-standard tools. My core stack includes
                                FastAPI, React, and databases like PostgreSQL
                                and MongoDB.
                            </p>
                            <p>
                                I approach problem-solving with a
                                research-driven and iterative mindset by digging
                                deep to design solid foundations, so what we
                                build today remains stable, maintainable, and
                                ready to scale tomorrow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-dashed border-(--border) flex justify-center">
                <div className="w-full max-w-4xl">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--foreground) text-center">
                        Unpaid Compliments
                    </h3>
                    <ComplimentRotator
                        compliments={unpaidCompliments}
                    />
                </div>
            </div>
        </section>
    );
}
