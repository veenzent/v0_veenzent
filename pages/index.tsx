import { Geist, Geist_Mono } from "next/font/google";
import Hero from "@/components/pageSections/Hero";
import Projects from "@/components/pageSections/Projects";
import Notes from "@/components/pageSections/Notes";
import AboutSection from "@/components/pageSections/AboutSection";
import Layout from "@/components/layout/Layout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    return (
        <div
            className={`${geistSans.className} ${geistMono.className} font-sans`}
        >
            <Layout>
                <Hero />
                <Projects />
                <Notes />
                <AboutSection />
            </Layout>
        </div>
    );
}
