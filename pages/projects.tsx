import Layout from "@/components/layout/Layout";
import React from "react";
import projects from "@/data/projects";
import ProjectCard from "@/components/pageSections/ProjectCard";

export default function Projects() {
	return (
			<Layout>
				<section className="py-10 md:py-24">
					<div className="container mx-auto px-5 max-w-5xl">
						<div style={{ maxWidth: 800 }}>
							<h1 className="text-4xl md:text-5xl font-medium leading-tight mb-8 text-(--foreground)">
								Systems &amp; Architecture
							</h1>
							<p className="text-lg text-(--muted-foreground) max-w-2xl">
								A collection of backend systems, open-source tools, and architectural explorations. I focus on building resilient infrastructure that solves actual engineering problems with minimal operational overhead.
							</p>
						</div>
					</div>
				</section>

				<section className="py-12 border-t border-(--border)">
					<div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
						<h2 className="text-sm font-semibold uppercase text-(--foreground)" style={{ paddingTop: "0.25rem" }}>
							Selected Works
						</h2>

						<div className="flex flex-col gap-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
								{projects.map((p) => (
									<ProjectCard key={p.title} project={p} />
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="py-12 md:py-24 border-t border-(--border)">
					<div className="container mx-auto px-5 max-w-5xl">
						<div style={{ maxWidth: 600 }}>
							<h2 className="text-3xl font-medium leading-tight mb-6 text-(--foreground)">Let's build something exceptional.</h2>
							<p className="text-lg text-(--muted-foreground) mb-8">Got a wild idea, a startup brief, or simply want to say hi? I'm all ears — just maybe not the caffeine kind.</p>
							<div className="flex gap-4">
								<a href="#" className="inline-flex items-center justify-center px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium">Get in Touch</a>
								<a href="#" className="inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium">Access Project Portal</a>
							</div>
						</div>
					</div>
				</section>
			</Layout>
	);
}

