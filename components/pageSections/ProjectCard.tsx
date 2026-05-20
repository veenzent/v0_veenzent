import React from "react";
import { Project } from "@/interfaces/project";

type Props = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: Props) {
  return (
    <div className="flex flex-col gap-4 cursor-pointer group" onClick={onClick}>
      <div className="bg-(--muted) rounded overflow-hidden border border-(--border) aspect-4/3">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        />
      </div>

      <div>
        <h3 className="text-base font-medium text-(--foreground)">{project.title}</h3>
        <p className="text-sm text-(--muted-foreground)">{project.description}</p>
      </div>
    </div>
  );
}
