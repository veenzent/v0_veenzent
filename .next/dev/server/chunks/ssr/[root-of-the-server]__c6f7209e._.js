module.exports = [
"[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Badge({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-xs font-semibold uppercase px-3 py-1 tracking-[0.02em]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx",
                lineNumber: 6,
                columnNumber: 13
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Button({ variant = "primary", children, className = "", ...rest }) {
    const base = "inline-flex items-center justify-center px-6 py-3 rounded text-sm font-medium transition-colors";
    const variants = {
        primary: "bg-[var(--foreground)] text-[var(--primary-foreground)] border border-[var(--foreground)] hover:opacity-90",
        outline: "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        className: `${base} ${variants[variant]} ${className}`,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx",
        lineNumber: 25,
        columnNumber: 9
    }, this);
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CodeSnippetsBackground
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function CodeSnippetsBackground() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "absolute top-0 left-0 w-full h-full pointer-events-none opacity-15 z-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[6%] right-[6%] max-w-[360px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                    children: `from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI(title="orders")

class Order(BaseModel):
    id: int
    total: float

@app.get("/health")
async def health_check():
    return {"status": "ok"}`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 6,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 5,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-0 right-[18%] max-w-[320px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                    children: `# celery_app.py
from celery import Celery
celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

@celery_app.task
def send_email(user_id: int) -> None:
    ...`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[2%] left-[28%] max-w-[280px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]",
                    children: `$ psql postgresql://localhost/app
> \\dt
> SELECT COUNT(*) FROM orders;
> EXPLAIN ANALYZE SELECT * FROM orders
  WHERE status = 'open';`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[25%] left-[45%] max-w-[260px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-3 rounded border border-[var(--border)] bg-[var(--background)]",
                    children: `$ uvicorn app:app --reload
INFO Loaded config from .env
INFO Started server process [8421]
INFO Waiting for application startup.
INFO Application startup complete.`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[14%] left-[6%] max-w-[320px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]",
                    children: `$ git clone git@github.com:veenzent/orders-service.git
$ cd orders-service
$ uvicorn app.main:app --reload`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 62,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[20%] left-[2%] max-w-[340px] leading-[1.6]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                    children: `# db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://app:***@localhost:5432/orders"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)`
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 71,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 70,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
        lineNumber: 3,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$CodeSnippetsBackground$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx [ssr] (ecmascript)");
;
;
;
;
;
function Hero() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "py-28 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$CodeSnippetsBackground$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto max-w-3xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "relative z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            children: "Available for new opportunities"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                            lineNumber: 13,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                            className: "mt-6 text-4xl font-medium leading-tight text-(--foreground)",
                            children: [
                                "Systems that stay up.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                    lineNumber: 16,
                                    columnNumber: 25
                                }, this),
                                "Quietly powering products."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                            lineNumber: 14,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "mt-6 max-w-lg text-lg text-(--muted-foreground)",
                            children: "I'm Vincent Odume, a backend-leaning software engineer focused on reliable APIs, pragmatic architecture, and turning complex systems into calm, maintainable code."
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                            lineNumber: 19,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "primary",
                                    className: "cursor-pointer",
                                    onClick: ()=>router.push("/projects"),
                                    children: "View Projects"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                    lineNumber: 25,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "outline",
                                    className: "cursor-pointer",
                                    onClick: ()=>router.push("/blogs"),
                                    children: "View Blog Posts"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                    lineNumber: 32,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                            lineNumber: 24,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 12,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/router.js [ssr] (ecmascript)");
;
;
function ProjectCard({ project, onClick }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleNavigation = ()=>{
        if (onClick) return onClick();
        if (!project.link) return;
        try {
            const url = project.link;
            const isExternal = /^(https?:)?\/\//.test(url);
            if (isExternal) {
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                router.push(url);
            }
        } catch (e) {
            // fallback: attempt to open via location
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigation();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 cursor-pointer group",
        onClick: handleNavigation,
        role: "button",
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-(--muted) rounded overflow-hidden border border-(--border) aspect-4/3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: project.image,
                    alt: project.title,
                    className: "w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-base font-medium text-(--foreground)",
                        children: project.title
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-sm text-(--muted-foreground)",
                        children: project.description
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/LiteLink.df9d20a3.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1440,
    height: 704,
    blurWidth: 8,
    blurHeight: 4,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAAVklEQVR42lWNQQ6AIAwE+f/n9AEelLtGAggU6NomEsMke9lMu4aZkXJGIYIPEUFCtaL3DsXg4/QB626xHBZ3jKP+hSYXpTZcKWFzDvp5ErTQkIiPTAxeMe99S0T7zXQAAAAASUVORK5CYII="
};
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/BizzAi.6fb3ce1d.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1162,
    height: 627,
    blurWidth: 8,
    blurHeight: 4,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAIAAAA8r+mnAAAAb0lEQVR42gFkAJv/AHep0YKw2GqdyGCUv1+SvVyQvFiMt2GVuQA6bZhCdaA+c55GeaFAc5w1a5crYY1EcpoAKUxnOVp1OV1zN2NxOlx1NVl1LVBtPVt1AEpZZE9bZEpYYUZYX0hZZEZXY0lZZFlmceJNKJ+DcNqPAAAAAElFTkSuQmCC"
};
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/loopstudios.53ee3b55.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1227,
    height: 677,
    blurWidth: 8,
    blurHeight: 4,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAIAAAA8r+mnAAAAb0lEQVR42gFkAJv/AE0xSz4xPjQoO1IqSkAvWZVCwNxM6btI7wBNMUtAN0FLNUhZMldUMXHPRtjnSufIRd4ATTJHRT1SbUFrlkSPxlaT4k624z6onjBxAE8nPzMqRZswe9I4h8w8Y8M4YKMqU3AoRVL1JvEBUD11AAAAAElFTkSuQmCC"
};
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/boredtap.fbd5e085.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 2372,
    height: 1585,
    blurWidth: 8,
    blurHeight: 5,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAn0lEQVR42j2OMQuCQACF7w+15FC0NAVJQVPWVYIQBWnaFLVF2Xj+n5xzFnQQQr279fwTL7yg4eO96b2PZFn2qaqq4Zxr2i6l1JnneUGiiKn1iuLoeTgFAehygWcYwrY3SJK3ItfLWQ16BibmCLOpib7RwX7rYDzsIo5fijDGFKUUrnuA7/uwrDke9xt2Dv0tpGlatH91XWvKsmyEEH+HLw47bVG785uAAAAAAElFTkSuQmCC"
};
}),
"[project]/veenzent/portfolio/v0_veenzent/data/projects.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "projects",
    ()=>projects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
;
;
;
;
const projects = [
    {
        title: "LiteLink",
        description: "Shorten long URLs into sleek, memorable (customizable) links that are easy to share and track.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
        link: "https://litelink.vercel.app/"
    },
    {
        title: "BizAi",
        description: "A conversational assistant focused on business information and registration trends in Nigeria.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
        link: "https://bizai.vercel.app/"
    },
    {
        title: "loopstudios",
        description: "Landing page for loopstudios. Immersive experiences that deliver. The leader in interactive VR",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
        link: "https://loopstudios.netlify.app/"
    },
    {
        title: "BoredTap",
        description: "A Telegram mini app where users engage in various activities to earn coins: tapping, completing tasks, participating in challenges, tasks and other interactive features. The app integrates gamification elements to drive user engagement.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src
    }
];
const __TURBOPACK__default__export__ = projects;
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Projects
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ProjectCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ProjectCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$projects$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/data/projects.ts [ssr] (ecmascript)");
;
;
;
;
;
function Projects() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "py-24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container mx-auto max-w-5xl flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 md:gap-16 md:items-start",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-sm font-semibold uppercase text-(--foreground)",
                    children: "Systems"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                    lineNumber: 12,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-12",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$projects$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ProjectCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    project: p
                                }, p.title, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                                    lineNumber: 18,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                            lineNumber: 16,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex justify-start",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "outline",
                                onClick: ()=>router.push("/projects"),
                                className: "hover:cursor-pointer",
                                children: "View full systems gallery"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                                lineNumber: 22,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                            lineNumber: 21,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                    lineNumber: 15,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
            lineNumber: 11,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
        lineNumber: 10,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/data/blogs.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const blogs = [
    {
        title: "Git Bash & GitHub for Beginners.",
        date: "Dec 1, 2025",
        link: "https://veenzent.hashnode.dev/git-bash-and-github-for-beginners"
    },
    {
        title: "Don't Make Me a Hypocrite: The Danger of Performative Prayer.",
        date: "Apr 26, 2023",
        link: "https://veenzent.hashnode.dev/dont-make-me-a-hypocrite-the-danger-of-performative-prayer"
    },
    {
        title: "What is Web 3.0?",
        date: "Mar 16, 2023",
        link: "https://veenzent.hashnode.dev/what-is-web-3"
    }
];
const __TURBOPACK__default__export__ = blogs;
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Notes
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$blogs$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/data/blogs.ts [ssr] (ecmascript)");
;
;
function Notes() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "py-24 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none opacity-[0.18]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute top-[8%] left-[4%] w-55 h-35",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "https://storage.googleapis.com/banani-generated-images/generated-images/0634c4c5-5d3e-4a7f-a81c-6765ec376f03.jpg",
                            alt: "Notepad illustration",
                            className: "w-full h-full object-contain"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                            lineNumber: 10,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 9,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute top-[18%] right-[6%] w-45 h-35",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "https://storage.googleapis.com/banani-generated-images/generated-images/b299cca8-b6a5-4479-9154-c1949c5be773.jpg",
                            alt: "Books illustration",
                            className: "w-full h-full object-contain"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                            lineNumber: 19,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 18,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[10%] left-[10%] w-40 h-30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "https://storage.googleapis.com/banani-generated-images/generated-images/f681e781-7ff1-4d9b-a9bc-384dbd7eb191.jpg",
                            alt: "Coffee and notebook illustration",
                            className: "w-full h-full object-contain"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                            lineNumber: 28,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[16%] right-[18%] w-50 h-32.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "https://storage.googleapis.com/banani-generated-images/generated-images/f507bce2-44ac-43e4-b293-c4aee217f0ce.jpg",
                            alt: "Doodles illustration",
                            className: "w-full h-full object-contain"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                            lineNumber: 37,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                lineNumber: 7,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto max-w-5xl relative z-10 flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 md:gap-16 md:items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-semibold uppercase text-(--foreground)",
                        children: "Notes & Writing"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$blogs$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].slice(0, 3).map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                href: n.link || "#",
                                target: n.link ? "_blank" : "_self",
                                rel: n.link ? "noopener noreferrer" : undefined,
                                className: "flex justify-between items-baseline py-4 border-b border-(--border) hover:bg-(--muted) transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-base font-medium text-(--foreground)",
                                        children: n.title
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                                        lineNumber: 58,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-(--muted-foreground)",
                                        children: n.date
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                                        lineNumber: 61,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, n.title, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                                lineNumber: 51,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 49,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComplimentRotator
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ComplimentRotator({ compliments, intervalMs = 4200 }) {
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const count = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>compliments.length, [
        compliments
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (count <= 1) return;
        const timer = setInterval(()=>{
            setCurrentIndex((prev)=>(prev + 1) % count);
        }, intervalMs);
        return ()=>clearInterval(timer);
    }, [
        count,
        intervalMs
    ]);
    if (count === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-4xl min-h-35 overflow-hidden rounded border border-dashed border-(--border) p-5 bg-(--muted)",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex w-full",
                style: {
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: "transform 0.6s ease"
                },
                "aria-live": "polite",
                children: compliments.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "min-w-full px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "italic text-lg leading-relaxed mb-2 text-(--foreground) break-word",
                                children: [
                                    '"',
                                    item.text,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                                lineNumber: 47,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-(--muted-foreground)",
                                children: [
                                    "— ",
                                    item.author
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                                lineNumber: 50,
                                columnNumber: 25
                            }, this)
                        ]
                    }, `${item.author}-${idx}`, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                        lineNumber: 43,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            count > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-4 flex items-center justify-center gap-2",
                children: compliments.map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: `h-2 w-2 rounded-full transition-colors ${idx === currentIndex ? "bg-(--foreground)" : "bg-(--muted-foreground)"}`
                    }, `dot-${idx}`, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                        lineNumber: 60,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                lineNumber: 58,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/cent-edited.d66a095a.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 810,
    height: 1080,
    blurWidth: 6,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAICAIAAABVpBlvAAAAo0lEQVR42gGYAGf/ANzPs5qNgF5UWKWaluDUv+XZxADLvqlfT1JVQk2OhJHVzL/k2sQAxbemVUZNSzhCb2JuysG349rEAMG1pFRES2JKU3NhbcS6ruLZwQDYzrhtYWNoT1uEdYHQx7Ph2MIA1dDGbmt2NS9BbWl9yczL1tHEAKy00GtxkjQvQ1VZeLPE5bvJ4wCosNSWnsZ2fKOdqM+ywOatveAtr1Ym97sI1wAAAABJRU5ErkJggg=="
};
}),
"[project]/veenzent/portfolio/v0_veenzent/data/unpaidCompliments.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unpaidCompliments",
    ()=>unpaidCompliments
]);
const unpaidCompliments = [
    {
        text: "Vincent was incredibly effective at quickly understanding the problem space and delivering high-quality backend architecture.",
        author: "Anonymous Nicole, Product Lead"
    },
    {
        text: "His focus on reliability and maintainability saved us weeks of technical debt down the road.",
        author: "Anonymous Ahmed, Engineering Manager"
    }
];
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutSection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ComplimentRotator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$unpaidCompliments$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/data/unpaidCompliments.ts [ssr] (ecmascript)");
;
;
;
;
function AboutSection() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "py-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto max-w-5xl flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 md:gap-16 md:items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-semibold uppercase text-(--foreground)",
                        children: "About"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                        lineNumber: 11,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-16 items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                // src={VeenzentPng.src}
                                src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
                                alt: "Portrait",
                                className: "w-full h-auto rounded shadow-sm object-cover grayscale contrast-110 bg-(--muted)"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                lineNumber: 15,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-4 text-sm text-(--muted-foreground)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Hello! I'm Vincent — a backend-leaning software developer with a strong focus on building fast, secure, and reliable web systems. I enjoy turning complex ideas into scalable solutions that behave predictably under real-world demands."
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                            lineNumber: 23,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "From architecting MVPs for startups to refining legacy systems and designing robust internal APIs, I bring products to life using modern, industry-standard tools. My core stack includes FastAPI, React, and databases like PostgreSQL and MongoDB."
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                            lineNumber: 31,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "I approach problem-solving with a research-driven and iterative mindset by digging deep to design solid foundations, so what we build today remains stable, maintainable, and ready to scale tomorrow."
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                            lineNumber: 39,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                lineNumber: 21,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                        lineNumber: 14,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-8 pt-6 border-t border-dashed border-(--border) flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-4xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "text-xs font-semibold uppercase tracking-wider mb-4 text-(--foreground) text-center",
                            children: "Client Notes"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ComplimentRotator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            compliments: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$data$2f$unpaidCompliments$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["unpaidCompliments"]
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                            lineNumber: 55,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavLink
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/link.js [ssr] (ecmascript)");
;
;
function NavLink({ href, children, active = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        legacyBehavior: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
            className: `text-sm font-medium transition-colors ${active ? "text-(--foreground)" : "text-(--muted-foreground) hover:text-(--foreground)"}`,
            children: children
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx",
            lineNumber: 15,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx [ssr] (ecmascript)");
;
;
;
function Header() {
    const { pathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        className: "py-6 md:py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-5 md:px-8 max-w-5xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "md:hidden flex justify-between items-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "/",
                            onClick: (e)=>{
                                e.preventDefault();
                                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                                ;
                            },
                            className: "font-mono text-(--foreground) text-lg font-semibold tracking-tight cursor-pointer",
                            "aria-label": "Home",
                            children: "<veenzent/>"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 12,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "https://github.com/veenzent",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "flex items-center justify-center w-5 h-5 text-(--foreground)",
                                    "aria-label": "GitHub",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577   0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73   1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93   0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23   a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23   .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921   .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12   c0-6.627-5.373-12-12-12z"
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                            lineNumber: 38,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                        lineNumber: 31,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 24,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "https://veenzent.cv",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "flex items-center justify-center w-5 h-5 text-(--foreground)",
                                    "aria-label": "Resume",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                            lineNumber: 67,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                        lineNumber: 60,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 53,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 23,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 11,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "md:hidden overflow-x-auto hide-scrollbar",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "flex gap-4 justify-center px-5 pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                active: pathname === "/",
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 81,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/about",
                                active: pathname === "/about",
                                children: "About"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 84,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/projects",
                                active: pathname === "/projects",
                                children: "Projects"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 87,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/blogs",
                                active: pathname === "/blogs",
                                children: "Blogs"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/contacts",
                                active: pathname === "/contacts",
                                children: "Contacts"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 96,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                        lineNumber: 80,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "hidden md:flex justify-between items-center gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "/",
                            onClick: (e)=>{
                                e.preventDefault();
                                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                                ;
                            },
                            className: "font-mono text-(--foreground) text-lg font-semibold tracking-tight cursor-pointer",
                            "aria-label": "Home",
                            children: "<veenzent/>"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 107,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                            className: "flex gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    active: pathname === "/",
                                    children: "Home"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 119,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/about",
                                    active: pathname === "/about",
                                    children: "About"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 122,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/projects",
                                    active: pathname === "/projects",
                                    children: "Projects"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 125,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/blogs",
                                    active: pathname === "/blogs",
                                    children: "Blogs"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 131,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/contacts",
                                    active: pathname === "/contacts",
                                    children: "Contacts"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 134,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 118,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "https://github.com/veenzent",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "flex items-center gap-2 text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-4 w-4",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577   0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73   1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93   0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23   a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23   .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921   .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12   c0-6.627-5.373-12-12-12z"
                                            }, void 0, false, {
                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                                lineNumber: 155,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                            lineNumber: 148,
                                            columnNumber: 29
                                        }, this),
                                        "GitHub"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    href: "https://veenzent.cv",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)",
                                    children: "Resume"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 171,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 141,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 106,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 9,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FooterSocials
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function FooterSocials() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mt-16 pt-8 border-t border-(--border) flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-6 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: "https://github.com/veenzent",
                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                        "aria-label": "GitHub",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                d: "M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921.43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                                lineNumber: 19,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                            lineNumber: 13,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                        lineNumber: 8,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: "https://www.linkedin.com/in/vincent-odume-74a28a243/",
                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                        "aria-label": "LinkedIn",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                d: "M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.047-8.842 0-9.769h3.554v1.383c.43-.664 1.199-1.608 2.925-1.608 2.136 0 3.738 1.394 3.738 4.389v5.605zM5.337 9.433c-1.144 0-1.915-.761-1.915-1.712 0-.951.77-1.71 1.951-1.71 1.18 0 1.914.759 1.914 1.71 0 .951-.771 1.712-1.95 1.712zm1.581 11.019H3.756V9.684h3.162v10.768zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                                lineNumber: 34,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                            lineNumber: 28,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                        lineNumber: 23,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: "https://x.com/Veen_zent",
                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                        "aria-label": "Twitter",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.997 6.802H2.421l7.727-8.835L1.497 2.25h6.886l4.713 6.231 5.422-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                                lineNumber: 49,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                            lineNumber: 43,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: "mailto:odumevincent19@gmail.com",
                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                        "aria-label": "Email",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                                lineNumber: 65,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                            lineNumber: 58,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                lineNumber: 6,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-sm text-(--muted-foreground)",
                children: "© 2026 veenzent. All rights reserved."
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
                lineNumber: 74,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactFooter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$FooterSocials$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/FooterSocials.tsx [ssr] (ecmascript)");
;
;
function ContactFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "py-32 bg-(--secondary) border-t border-(--border)",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container mx-auto max-w-3xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-3xl font-medium leading-tight mb-6 text-(--foreground)",
                    children: "Let's build something remarkable."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 7,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-lg text-(--muted-foreground) mb-8",
                    children: "Have an ambitious idea, a project outline, or just want to say hello? I'm interested in hearing from you."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 10,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            className: "inline-flex items-center justify-center px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium hover:opacity-90 transition-opacity",
                            href: "/contacts",
                            children: "Get in Touch"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                            lineNumber: 15,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            className: "inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium hover:bg-(--muted) transition-colors",
                            href: "/projects",
                            children: "Access Project Portal"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                            lineNumber: 21,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 14,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$FooterSocials$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 6,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
}),
"[next]/internal/font/google/geist_a72d2665.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_a72d2665-module__zkat9W__className",
  "variable": "geist_a72d2665-module__zkat9W__variable",
});
}),
"[next]/internal/font/google/geist_a72d2665.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a72d2665.module.css [ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', 'Geist Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_642b3e4a.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_642b3e4a-module__xaiwEa__className",
  "variable": "geist_mono_642b3e4a-module__xaiwEa__variable",
});
}),
"[next]/internal/font/google/geist_mono_642b3e4a.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_642b3e4a.module.css [ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', 'Geist Mono Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$ContactFooter$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/script.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a72d2665.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_642b3e4a.js [ssr] (ecmascript)");
;
;
;
;
;
;
function Layout({ children, showFooter = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a72d2665$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].className} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_642b3e4a$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].className} font-sans`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: "https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js",
                    strategy: "afterInteractive"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
                    lineNumber: 14,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
                    lineNumber: 15,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                    className: "flex-1",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
                    lineNumber: 16,
                    columnNumber: 17
                }, this),
                showFooter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$ContactFooter$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
                    lineNumber: 17,
                    columnNumber: 32
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
            lineNumber: 13,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Projects$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Notes$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Projects$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Notes$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                lineNumber: 12,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                lineNumber: 13,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c6f7209e._.js.map