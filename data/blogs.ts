import { Blog } from "@/interfaces/blog";

const blogs: Blog[] = [
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
    {
        title: "Designing Resilient Message Queues for the Edge",
        date: "Oct 12, 2024",
        readTime: "8 min read",
        description:
            "An exploration into the architecture behind KiteMQ. We look at handling poor network conditions, minimizing memory footprints, and implementing Raft consensus on resource-constrained devices.",
        tags: ["Architecture", "Go", "Distributed Systems"],
        link: "#",
    },
    {
        title: "Why I Chose FastAPI over Django for OmniPay",
        date: "Aug 05, 2024",
        readTime: "12 min read",
        description:
            "A detailed retrospective on the decision to migrate a legacy payment routing system from Django to FastAPI. Discussing asynchronous workloads, GraphQL integrations, and performance benchmarks.",
        tags: ["FastAPI", "Python", "Performance"],
        link: "#",
    },
    {
        title: "Demystifying Database Migrations with Dry-Runs",
        date: "Mar 22, 2023",
        readTime: "6 min read",
        description:
            "How to safely manage and preview database schema changes across multiple staging environments without breaking production. A look into the core concepts behind SchemaSync CLI.",
        tags: ["Databases", "Tooling", "SQLAlchemy"],
        link: "#",
    },
    {
        title: "Structured Logging in Python: A Minimalist Approach",
        date: "Nov 14, 2022",
        readTime: "5 min read",
        description:
            "Standardizing log formats across microservices shouldn't require massive dependencies. Here is how you can enforce JSON output in standard Python logging for easier ingestion into ELK stacks.",
        tags: ["Python", "Observability", "Logging"],
        link: "#",
    },
];

export default blogs;
