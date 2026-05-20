import Hero from "@/components/pageSections/Hero";
import Projects from "@/components/pageSections/Projects";
import Notes from "@/components/pageSections/Notes";
import AboutSection from "@/components/pageSections/AboutSection";
import Layout from "@/components/layout/Layout";

export default function Home() {
    return (
        <Layout>
            <Hero />
            <Projects />
            <Notes />
            <AboutSection />
        </Layout>
    );
}
