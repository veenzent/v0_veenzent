import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import ContactFooter from "@/components/layout/ContactFooter";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className={`${geistSans.className} ${geistMono.className} font-sans`}>
            <div className="flex flex-col min-h-screen">
                <Script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js" strategy="afterInteractive" />
                <Header />
                <main className="flex-1">{children}</main>
                <ContactFooter />
            </div>
        </div>
    );
}
