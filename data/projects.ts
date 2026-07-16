import { Project } from "@/interfaces/project";
import litelink from "@/assets/LiteLink.png";
import BizAi from "@/assets/BizzAi.png";
import loopstudios from "@/assets/loopstudios.png";
import boredtap from "@/assets/boredtap.png";
import jennysWorld from "@/assets/jennys-world.png";


export const projects: Project[] = [
    {
        title: "LiteLink",
        description:
            "a mobile-first luxury beauty e-commerce storefront built for browsing and buying premium personal care products like Perfumes, Skincare, Cosmetics, Deodorants, and Hair Care. Styled in blush pink, gold, and charcoal.",
        image: jennysWorld.src,
        link: "https://jennys-world.vercel.app/",
    },
    {
        title: "LiteLink",
        description:
            "Shorten long URLs into sleek, memorable (customizable) links that are easy to share and track.",
        image: litelink.src,
        link: "https://litelink.vercel.app/",
    },
    {
        title: "BizAi",
        description:
            "A conversational assistant focused on business information and registration trends in Nigeria.",
        image: BizAi.src,
        link: "https://bizai.vercel.app/",
    },
    {
        title: "loopstudios",
        description:
            "Landing page for loopstudios. Immersive experiences that deliver. The leader in interactive VR",
        image: loopstudios.src,
        link: "https://loopstudios.netlify.app/",
    },
    {
        title: "BoredTap",
        description:
            "A Telegram mini app where users engage in various activities to earn coins: tapping, completing tasks, participating in challenges, tasks and other interactive features. The app integrates gamification elements to drive user engagement.",
        image: boredtap.src,
    },
];

export default projects;
