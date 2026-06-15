import React from "react";
import { Project } from "@/interfaces/project";
import { useRouter } from "next/router";

type Props = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: Props) {
  const router = useRouter();

  const handleNavigation = () => {
    if (onClick) return onClick();
    if (!project.link) return;

    try {
      const url = project.link;
      const isExternal = /^(https?:)?\/\//.test(url);
      if (isExternal) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        router.push(url);
      }
    } catch (e) {
      // fallback: attempt to open via location
      if (typeof window !== "undefined") window.location.href = project.link as string;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation();
    }
  };

  return (
    <div
      className="flex flex-col gap-4 cursor-pointer group"
      onClick={handleNavigation}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
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
