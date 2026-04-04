import { Project } from "@/interfaces/project";
import Button from "@/components/ui/Button";
import litelink from "@/assets/LiteLink.png";
import BizAi from "@/assets/BizzAi.png";
import loopstudios from "@/assets/loopstudios.png";
import boredtap from "@/assets/boredtap.png";

const projects: Project[] = [
    {
        title: "LiteLink",
        description:
            "Shorten long URLs into sleek, memorable (customizable) links that are easy to share and track.",
        image: litelink.src,
    },
    {
        title: "BizAi",
        description:
            "A conversational assistant focused on business information and registration trends in Nigeria.",
        image: BizAi.src,
    },
    {
        title: "loopstudios",
        description: "Landing page for loopstudios. Immersive experiences that deliver. The leader in interactive VR",
        image: loopstudios.src,
    },
    {
        title: "BoredTap",
        description:
            "A Telegram mini app where users engage in various activities to earn coins: tapping, completing tasks, participating in challenges, tasks and other interactive features. The app integrates gamification elements to drive user engagement.",
        image: boredtap.src,
    },
];

export default function Projects() {
    return (
        <section className="py-24">
            <div className="container mx-auto max-w-5xl" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem', alignItems: 'start' }}>
                <h2 className="text-sm font-semibold uppercase text-(--foreground)" style={{ paddingTop: '0.25rem' }}>
                    Systems
                </h2>
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((p) => (
                            <div
                                key={p.title}
                                className="flex flex-col gap-4 cursor-pointer group"
                            >
                                <div className="bg-(--muted) rounded overflow-hidden border border-(--border) aspect-4/3">
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-(--foreground)">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-(--muted-foreground)">
                                        {p.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-start">
                        <Button variant="outline">View full systems gallery</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
