import { Project } from "@/interfaces/project";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/pageSections/ProjectCard";
import projects from "@/data/projects";

export default function Projects() {
    return (
        <section className="py-24">
            <div className="container mx-auto max-w-5xl flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 md:gap-16 md:items-start">
                <h2 className="text-sm font-semibold uppercase text-(--foreground)">
                    Systems
                </h2>
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((p) => (
                            <ProjectCard key={p.title} project={p} />
                        ))}
                    </div>
                    <div className="flex justify-start">
                        <Button variant="outline">
                            View full systems gallery
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
