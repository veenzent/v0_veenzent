import { useEffect, useMemo, useState } from "react";

type Compliment = {
    text: string;
    author: string;
};

type ComplimentRotatorProps = {
    compliments: Compliment[];
    intervalMs?: number;
};

export default function ComplimentRotator({
    compliments,
    intervalMs = 4200,
}: ComplimentRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const count = useMemo(() => compliments.length, [compliments]);

    useEffect(() => {
        if (count <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % count);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [count, intervalMs]);

    if (count === 0) {
        return null;
    }

    return (
        <div className="mx-auto w-full max-w-4xl min-h-35 overflow-hidden rounded border border-dashed border-(--border) p-5 bg-(--muted)">
            <div
                className="flex w-full"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: "transform 0.6s ease"
                }}
                aria-live="polite"
            >
                {compliments.map((item, idx) => (
                    <div
                        key={`${item.author}-${idx}`}
                        className="min-w-full px-6"
                    >
                        <p className="italic text-lg leading-relaxed mb-2 text-(--foreground) break-word">
                            &#34;{item.text}&#34;
                        </p>
                        <p className="text-sm text-(--muted-foreground)">
                            — {item.author}
                        </p>
                    </div>
                ))}
            </div>

            {count > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {compliments.map((_, idx) => (
                        <span
                            key={`dot-${idx}`}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                idx === currentIndex
                                    ? "bg-(--foreground)"
                                    : "bg-(--muted-foreground)"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
