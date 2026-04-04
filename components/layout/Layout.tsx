import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import ContactFooter from "@/components/layout/ContactFooter";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <ContactFooter />
        </div>
    );
}
