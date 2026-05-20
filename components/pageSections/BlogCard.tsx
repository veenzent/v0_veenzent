import React from "react";
import { Blog } from "@/interfaces/blog";

export default function BlogCard({ blog }: { blog: Blog }) {
    const href = blog.link || "#";
    const isExternal = href.startsWith("http");

    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="block"
        >
            <article className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 pb-6 border-b border-dashed border-(--border)">
                <div className="blog-meta text-sm text-(--muted-foreground) pt-1">
                    {blog.date}{" "}
                    <span className="blog-meta-label">{blog.readTime}</span>
                </div>
                <div>
                    <h3 className="blog-title text-xl font-medium text-(--foreground) inline-flex items-center gap-3">
                        {blog.title}{" "}
                        <span aria-hidden>
                            <iconify-icon
                                icon="lucide:arrow-up-right"
                                style={{ fontSize: 16 }}
                            />
                        </span>
                    </h3>
                    <p className="blog-desc text-sm text-(--muted-foreground) mt-2">
                        {blog.description}
                    </p>
                    {blog.tags && (
                        <div className="blog-tags flex flex-wrap gap-2 mt-4">
                            {blog.tags.map((t) => (
                                <span className="blog-tag" key={t}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </a>
    );
}
