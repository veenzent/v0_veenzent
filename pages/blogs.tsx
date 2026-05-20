import Layout from "@/components/layout/Layout";
import BlogsSection from "@/components/pageSections/Blogs";
import React from "react";

export default function Blogs() {
    return (
            <Layout>
                {/* Intro Section */}
                <section className="py-10 md:py-24">
                    <div className="container mx-auto px-5 max-w-5xl">
                        <div style={{ maxWidth: 800 }}>
                            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-8 text-(--foreground)">
                                Notes &amp; Writing
                            </h1>
                            <p className="text-lg text-(--muted-foreground) max-w-2xl">
                                Thoughts, tutorials, and deep dives into backend
                                engineering, system architecture, and software
                                development practices. A log of things I've
                                learned and built.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Blogs Section (reusable) */}
                <BlogsSection />
            </Layout>
    );
}
