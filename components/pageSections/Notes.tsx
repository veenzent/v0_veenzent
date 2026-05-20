import { Note } from "../../interfaces/note";

const notes: Note[] = [
    {
        title: "Git Bash & GitHub for Beginners.",
        date: "Dec 1, 2025",
        link: "https://veenzent.hashnode.dev/git-bash-and-github-for-beginners",
    },
    {
        title: "Don't Make Me a Hypocrite: The Danger of Performative Prayer.",
        date: "Apr 26, 2023",
        link: "https://veenzent.hashnode.dev/dont-make-me-a-hypocrite-the-danger-of-performative-prayer",
    },
    {
        title: "What is Web 3.0?",
        date: "Mar 16, 2023",
        link: "https://veenzent.hashnode.dev/what-is-web-3",
    },
];

export default function Notes() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background illustrations */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
                {/* Top left notepad & doodles */}
                <div className="absolute top-[8%] left-[4%] w-55 h-35">
                    <img
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/0634c4c5-5d3e-4a7f-a81c-6765ec376f03.jpg"
                        alt="Notepad illustration"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Right side stacked books */}
                <div className="absolute top-[18%] right-[6%] w-45 h-35">
                    <img
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/b299cca8-b6a5-4479-9154-c1949c5be773.jpg"
                        alt="Books illustration"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Bottom left coffee cup */}
                <div className="absolute bottom-[10%] left-[10%] w-40 h-30">
                    <img
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/f681e781-7ff1-4d9b-a9bc-384dbd7eb191.jpg"
                        alt="Coffee and notebook illustration"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Bottom right doodle lines */}
                <div className="absolute bottom-[16%] right-[18%] w-50 h-32.5">
                    <img
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/f507bce2-44ac-43e4-b293-c4aee217f0ce.jpg"
                        alt="Doodles illustration"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 md:gap-16 md:items-start">
                <h2 className="text-sm font-semibold uppercase text-(--foreground)">
                    Notes & Writing
                </h2>
                <div className="flex flex-col">
                    {notes.map((n) => (
                        <a
                            key={n.title}
                            href={n.link || "#"}
                            target={n.link ? "_blank" : "_self"}
                            rel={n.link ? "noopener noreferrer" : undefined}
                            className="flex justify-between items-baseline py-4 border-b border-(--border) hover:bg-(--muted) transition-colors"
                        >
                            <span className="text-base font-medium text-(--foreground)">
                                {n.title}
                            </span>
                            <span className="text-sm text-(--muted-foreground)">
                                {n.date}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
