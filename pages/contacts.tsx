import Layout from "@/components/layout/Layout";
import Script from "next/script";
import React from "react";
import FooterSocials from "@/components/layout/FooterSocials";

export default function Contacts() {
    return (
        <Layout showFooter={false}>
            {/* Intro */}
            <section className="py-10 md:py-24">
                <div className="container mx-auto px-5 max-w-5xl">
                    <div style={{ maxWidth: 800 }}>
                        <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-8 text-(--foreground)">
                            Get in touch
                        </h1>
                        <p className="text-lg text-(--muted-foreground) max-w-2xl">
                            Whether you have a specific project in mind, need advice on backend architecture, or just want to connect, I'm always open to discussing new opportunities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Methods */}
            <section className="py-12 border-t border-(--border)">
                <div className="container mx-auto px-5 max-w-5xl grid md:grid-cols-[200px_1fr] gap-16 items-start">
                    <h2 className="section-label self-start">Contact</h2>

                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
                            {/* Left: form (static) */}
                            <div>
                                <label className="form-label">Name</label>
                                <input className="form-input mb-4 w-full" placeholder="John Doe" defaultValue="" />

                                <label className="form-label">Email</label>
                                <input className="form-input mb-4 w-full" placeholder="john@example.com" defaultValue="" />

                                <label className="form-label">Message</label>
                                <textarea className="form-textarea mb-4 w-full" placeholder="Your message here..." defaultValue={""} />

                                <div className="mt-6">
                                    {/* ToDo: Set up an action for submit button */}
                                    <button className="w-full md:w-60 mx-auto block px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium">Send Message</button>
                                </div>
                            </div>

                            {/* Right: contact methods */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-base font-medium text-(--foreground)">Direct Connections</h3>
                                <a href="mailto:odumevincent19@gmail.com" className="contact-method">
                                    <div className="contact-method-icon">
                                        <iconify-icon icon="lucide:mail" style={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <div className="contact-method-title">Email</div>
                                        <div className="contact-method-desc">hello@veenzent.dev</div>
                                    </div>
                                </a>

                                <a href="https://linkedin.com/in/veenzent" className="contact-method" target="_blank" rel="noopener noreferrer">
                                    <div className="contact-method-icon">
                                        <iconify-icon icon="lucide:linkedin" style={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <div className="contact-method-title">LinkedIn</div>
                                        <div className="contact-method-desc">Professional network</div>
                                    </div>
                                </a>

                                <a href="https://twitter.com/veenzent" className="contact-method" target="_blank" rel="noopener noreferrer">
                                    <div className="contact-method-icon">
                                        <iconify-icon icon="lucide:twitter" style={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <div className="contact-method-title">X (Twitter)</div>
                                        <div className="contact-method-desc">Thoughts & updates</div>
                                    </div>
                                </a>

                                <a href="#" className="contact-method">
                                    <div className="contact-method-icon">
                                        <iconify-icon icon="lucide:calendar" style={{ fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <div className="contact-method-title">Book a Call</div>
                                        <div className="contact-method-desc">Schedule via Calendly</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Availability */}
            <section className="py-12 border-t border-(--border)">
                <div className="container mx-auto px-5 max-w-5xl">
                    <h2 className="section-label">Availability</h2>
                    <div className="mt-6 flex flex-col gap-6">
                        <div>
                            <h3 className="text-base font-medium text-(--foreground) mb-2">Current Status</h3>
                            <p className="text-(--muted-foreground) flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Open to new opportunities and freelance projects.</p>
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-(--foreground) mb-2">Timezone</h3>
                            <p className="text-(--muted-foreground)">Based in Lagos, Nigeria (WAT / GMT+1). Available for remote roles globally with flexible overlapping hours.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Footer icons (reused from ContactFooter) */}
            <div className="container mx-auto px-5 max-w-5xl">
                <FooterSocials />
            </div>
        </Layout>
    );
}
