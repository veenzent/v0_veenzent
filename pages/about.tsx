import { Geist, Geist_Mono } from "next/font/google";
import centedited from "@/assets/cent-edited.png";
import Layout from "@/components/layout/Layout";
import ComplimentRotator from "@/components/pageSections/ComplimentRotator";
import { unpaidCompliments } from "@/data/unpaidCompliments";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function About() {
    return (
        <div
            className={`${geistSans.className} ${geistMono.className} font-sans`}
        >
            <Layout>
                {/* Intro Section (matches mobile spacing on small screens) */}
                <section className="py-10 md:py-24">
                    <div className="container mx-auto px-5 max-w-5xl">
                        <div style={{ maxWidth: 800 }}>
                            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-8 text-(--foreground)">
                                Writing quiet, resilient code for complex
                                problems.
                            </h1>
                            <p className="text-lg text-(--muted-foreground) max-w-2xl">
                                Hi, I'm Vincent Odume. I'm a software engineer
                                who values clarity over cleverness. I spend most
                                of my time designing backend systems, thinking
                                about data models, and trying to remove
                                unnecessary moving parts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Background / Bio Section */}
                <section className="py-12 md:py-24 border-t border-(--border)">
                    <div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
                        <h2
                            className="text-sm font-semibold uppercase text-(--foreground)"
                            style={{ paddingTop: "0.25rem" }}
                        >
                            Background
                        </h2>
                        <div className="flex flex-col gap-6">
                            <img
                                src={centedited.src}
                                alt="Vincent Odume Portrait"
                                className="w-full max-h-125 object-cover rounded bg-(--border) grayscale contrast-110"
                            />

                            <div className="text-(--muted-foreground) space-y-4 max-w-170">
                                <p>
                                    My approach to engineering is heavily
                                    influenced by a desire for operational
                                    tranquility. I prefer predictable
                                    deployments, comprehensive logs, and
                                    architectures that don't wake people up at 3
                                    AM.
                                </p>
                                <p>
                                    Over the past few years, I've worked across
                                    various domains—from fintech startups to
                                    healthcare platforms—building the
                                    infrastructure that connects users to their
                                    data securely and efficiently.
                                </p>
                                <p>
                                    When I'm not writing code or debugging
                                    strange database deadlocks, I enjoy reading
                                    about systems design, experimenting with new
                                    CLI tools, and exploring ways to make
                                    developer workflows smoother.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section className="py-12 md:py-24 border-t border-(--border)">
                    <div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
                        <h2
                            className="text-sm font-semibold uppercase text-(--foreground)"
                            style={{ paddingTop: "0.25rem" }}
                        >
                            Experience
                        </h2>
                        <div className="flex flex-col">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 pb-6 border-b border-dashed border-(--border)">
                                    <div className="text-sm text-(--muted-foreground) pt-1">
                                        2022 — Present
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-(--foreground)">
                                            Senior Backend Engineer
                                        </h3>
                                        <div className="text-sm text-(--primary) mb-2">
                                            FinCore Systems
                                        </div>
                                        <p className="text-sm text-(--muted-foreground)">
                                            Leading the backend architecture for
                                            a high-volume payment gateway.
                                            Redesigned the transaction
                                            processing pipeline, moving from a
                                            monolithic architecture to a
                                            decoupled service model using
                                            FastAPI and Celery. Improved system
                                            throughput by 40% and reduced
                                            latency during peak hours.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 pb-6 border-b border-dashed border-(--border)">
                                    <div className="text-sm text-(--muted-foreground) pt-1">
                                        2019 — 2022
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-(--foreground)">
                                            Software Engineer
                                        </h3>
                                        <div className="text-sm text-(--primary) mb-2">
                                            Ciba Healthcare
                                        </div>
                                        <p className="text-sm text-(--muted-foreground)">
                                            Developed and maintained secure APIs
                                            for patient data management across 4
                                            U.S. states. Implemented rigorous
                                            data validation and encryption
                                            protocols compliant with HIPAA
                                            standards. Built internal tooling
                                            that reduced manual reporting time
                                            by 60%.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6">
                                    <div className="text-sm text-(--muted-foreground) pt-1">
                                        2017 — 2019
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-(--foreground)">
                                            Backend Developer
                                        </h3>
                                        <div className="text-sm text-(--primary) mb-2">
                                            LinkOrg Networks
                                        </div>
                                        <p className="text-sm text-(--muted-foreground)">
                                            Contributed to the development of a
                                            corporate data portal. Worked
                                            extensively with Django and
                                            PostgreSQL to build robust RESTful
                                            APIs. Managed daily database
                                            migrations and optimized complex SQL
                                            queries for reporting dashboards.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capabilities / Skills */}
                <section className="py-12 md:py-24 border-t border-(--border)">
                    <div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
                        <h2
                            className="text-sm font-semibold uppercase text-(--foreground)"
                            style={{ paddingTop: "0.25rem" }}
                        >
                            Capabilities
                        </h2>
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="text-xs font-semibold uppercase text-(--muted-foreground) mb-2">
                                    Languages
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Python
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        TypeScript
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Go
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        SQL
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Bash
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold uppercase text-(--muted-foreground) mb-2">
                                    Frameworks & Tools
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        FastAPI
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Django
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Celery
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Node.js
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        SQLAlchemy
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Pytest
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold uppercase text-(--muted-foreground) mb-2">
                                    Infrastructure & Data
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        PostgreSQL
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Redis
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        MongoDB
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Docker
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        AWS
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Linux
                                    </span>
                                    <span className="px-3 py-1 border rounded text-sm bg-(--secondary) border-(--border)">
                                        Nginx
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA (matches desktop-about.html) */}
                <section className="py-12 md:py-24 bg-(--secondary) border-t border-(--border)">
                    <div className="container mx-auto px-5 max-w-5xl">
                        <div style={{ maxWidth: 600 }}>
                            <h2 className="text-3xl font-medium leading-tight mb-6 text-(--foreground)">
                                Let's build something exceptional.
                            </h2>
                            <p className="text-lg text-(--muted-foreground) mb-8">
                                Got a wild idea, a startup brief, or simply want
                                to say hi? I'm all ears — just maybe not the
                                caffeine kind.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium"
                                >
                                    Get in Touch
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium"
                                >
                                    Access Project Portal
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Unpaid compliments (kept at bottom similar to original) */}
                <section className="py-12">
                    <div className="container mx-auto px-5 max-w-5xl">
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
                    </div>
                </section>
            </Layout>
        </div>
    );
}
