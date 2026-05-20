import React from "react";
import blogs from "@/data/blogs";
import BlogCard from "./BlogCard";

export default function BlogsSection() {
    return (
        <section className="py-12 border-t border-(--border)">
            <div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
                <h2 className="section-label">All Posts</h2>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {blogs.map((b) => (
                        <BlogCard key={b.title} blog={b} />
                    ))}
                </div>
            </div>
        </section>
    );
}
