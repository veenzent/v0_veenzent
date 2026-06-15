(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/styled-jsx@5.1.6_@babel+core@7.29.0_react@19.2.3/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/script.js [client] (ecmascript)");
;
;
;
;
;
const ProjectsPage = ()=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(57);
    if ($[0] !== "83db1d180e5e5b54ea39c7d7726c7ae7f01950ea8c8c43bdae924089f47a284e") {
        for(let $i = 0; $i < 57; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "83db1d180e5e5b54ea39c7d7726c7ae7f01950ea8c8c43bdae924089f47a284e";
    }
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Projects - Minimal Developer Portfolio"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 16,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 16,
                    columnNumber: 69
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 16,
                    columnNumber: 141
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossOrigin: "anonymous"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 16,
                    columnNumber: 202
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
                    rel: "stylesheet"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 16,
                    columnNumber: 284
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 16,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            src: "https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js",
            strategy: "afterInteractive"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 17,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            padding: "2.5rem 0"
        };
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    let t4;
    let t5;
    let t6;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem"
        };
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--foreground)",
                letterSpacing: "-0.05em",
                whiteSpace: "nowrap"
            },
            children: "<veenzent/>"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 44,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2.5rem"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-link",
                    "data-media-type": "banani-button",
                    children: "Home"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 58,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-link",
                    "data-media-type": "banani-button",
                    children: "About"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 58,
                    columnNumber: 78
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-link active",
                    "data-media-type": "banani-button",
                    children: "Projects"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 58,
                    columnNumber: 149
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-link",
                    "data-media-type": "banani-button",
                    children: "Blogs"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 58,
                    columnNumber: 230
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-link",
                    "data-media-type": "banani-button",
                    children: "Contacts"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 58,
                    columnNumber: 301
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 52,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        t6 = {
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            whiteSpace: "nowrap"
        };
        $[4] = t3;
        $[5] = t4;
        $[6] = t5;
        $[7] = t6;
    } else {
        t3 = $[4];
        t4 = $[5];
        t5 = $[6];
        t6 = $[7];
    }
    let t7;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
        };
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    let t8;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    let t10;
    let t9;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            style: t2,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                style: t3,
                children: [
                    t4,
                    t5,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: t6,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-link",
                                style: t7,
                                "data-media-type": "banani-button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: t8,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                            icon: "lucide:github",
                                            style: {
                                                fontSize: 16,
                                                color: "var(--foreground)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                            lineNumber: 102,
                                            columnNumber: 177
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                        lineNumber: 102,
                                        columnNumber: 161
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "GitHub"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 102,
                                columnNumber: 91
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-link",
                                "data-media-type": "banani-button",
                                children: "Resume"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 105,
                                columnNumber: 39
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 102,
                        columnNumber: 75
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 102,
                columnNumber: 29
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 102,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        t10 = {
            padding: "6rem 0 4rem 0"
        };
        $[10] = t10;
        $[11] = t9;
    } else {
        t10 = $[10];
        t9 = $[11];
    }
    let t11;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            style: t10,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: 800
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: {
                                fontSize: "3.5rem",
                                fontWeight: 500,
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                                color: "var(--foreground)",
                                marginBottom: "2rem"
                            },
                            children: "Systems & Architecture"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 119,
                            columnNumber: 12
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "1.25rem",
                                color: "var(--muted-foreground)",
                                lineHeight: 1.6,
                                marginBottom: "2rem"
                            },
                            children: "A collection of backend systems, open-source tools, and architectural explorations. I focus on building resilient infrastructure that solves actual engineering problems with minimal operational overhead."
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 126,
                            columnNumber: 45
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 117,
                    columnNumber: 59
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 117,
                columnNumber: 32
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 117,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = t11;
    } else {
        t11 = $[12];
    }
    let t12;
    let t13;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "section-label",
            children: "Selected Works"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 139,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t13 = {
            display: "flex",
            flexDirection: "column"
        };
        $[13] = t12;
        $[14] = t13;
    } else {
        t12 = $[13];
        t13 = $[14];
    }
    let t14;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-meta",
            children: [
                "2024",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "project-meta-label",
                    children: "Open Source"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 152,
                    columnNumber: 45
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 152,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[15] = t14;
    } else {
        t14 = $[15];
    }
    let t15;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted-foreground)",
            cursor: "pointer"
        };
        $[16] = t15;
    } else {
        t15 = $[16];
    }
    let t16;
    let t17;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-title",
            children: [
                "KiteMQ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-media-type": "banani-button",
                    style: t15,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                        icon: "lucide:external-link",
                        style: {
                            fontSize: 16
                        }
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 175,
                        columnNumber: 97
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 175,
                    columnNumber: 48
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 175,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "project-desc",
            children: "A lightweight, high-throughput message queue built specifically for edge computing environments. Designed to operate with minimal memory footprint while ensuring reliable message delivery under poor network conditions. Adopted by over 40+ independent developers for IoT setups."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 178,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = t16;
        $[18] = t17;
    } else {
        t16 = $[17];
        t17 = $[18];
    }
    let t18;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tech-stack",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Go"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 187,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "gRPC"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 187,
                    columnNumber: 75
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Raft Consensus"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 187,
                    columnNumber: 113
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Docker"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 187,
                    columnNumber: 161
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 187,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[19] = t18;
    } else {
        t18 = $[19];
    }
    let t19;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[20] = t19;
    } else {
        t19 = $[20];
    }
    let t20;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "project-link",
            "data-media-type": "banani-button",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t19,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                        icon: "lucide:github",
                        style: {
                            fontSize: 16,
                            color: "var(--foreground)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 207,
                        columnNumber: 91
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 207,
                    columnNumber: 74
                }, ("TURBOPACK compile-time value", void 0)),
                "View Source"
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 207,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[21] = t20;
    } else {
        t20 = $[21];
    }
    let t21;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[22] = t21;
    } else {
        t21 = $[22];
    }
    let t22;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-item",
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        t16,
                        t17,
                        t18,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "project-links",
                            children: [
                                t20,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "project-link",
                                    "data-media-type": "banani-button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: t21,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                                icon: "lucide:book-open",
                                                style: {
                                                    fontSize: 16,
                                                    color: "var(--foreground)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                lineNumber: 230,
                                                columnNumber: 182
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                            lineNumber: 230,
                                            columnNumber: 165
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Read Documentation"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                    lineNumber: 230,
                                    columnNumber: 102
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 230,
                            columnNumber: 66
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 230,
                    columnNumber: 46
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 230,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[23] = t22;
    } else {
        t22 = $[23];
    }
    let t23;
    let t24;
    let t25;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-meta",
            children: [
                "2023",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "project-meta-label",
                    children: "Architecture"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 242,
                    columnNumber: 45
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 242,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-title",
            children: "OmniPay API Gateway"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 243,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "project-desc",
            children: "A highly available payment routing gateway that aggregates 5 different payment processors into a single, unified GraphQL API. Features include automatic failover, smart routing based on transaction fees, and a robust webhook delivery system with exponential backoff."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 244,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[24] = t23;
        $[25] = t24;
        $[26] = t25;
    } else {
        t23 = $[24];
        t24 = $[25];
        t25 = $[26];
    }
    let t26;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tech-stack",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "FastAPI"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 255,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "GraphQL"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 255,
                    columnNumber: 80
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "PostgreSQL"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 255,
                    columnNumber: 121
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Redis"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 255,
                    columnNumber: 165
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Celery"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 255,
                    columnNumber: 204
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 255,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[27] = t26;
    } else {
        t26 = $[27];
    }
    let t27;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[28] = t27;
    } else {
        t27 = $[28];
    }
    let t28;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-item",
            children: [
                t23,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        t24,
                        t25,
                        t26,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "project-links",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "project-link",
                                "data-media-type": "banani-button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: t27,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                            icon: "lucide:file-text",
                                            style: {
                                                fontSize: 16,
                                                color: "var(--foreground)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                            lineNumber: 275,
                                            columnNumber: 177
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                        lineNumber: 275,
                                        columnNumber: 160
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Case Study"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 275,
                                columnNumber: 97
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 275,
                            columnNumber: 66
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 275,
                    columnNumber: 46
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 275,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[29] = t28;
    } else {
        t28 = $[29];
    }
    let t29;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-meta",
            children: [
                "2022",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "project-meta-label",
                    children: "Tooling"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 285,
                    columnNumber: 45
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 285,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[30] = t29;
    } else {
        t29 = $[30];
    }
    let t30;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted-foreground)",
            cursor: "pointer"
        };
        $[31] = t30;
    } else {
        t30 = $[31];
    }
    let t31;
    let t32;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-title",
            children: [
                "SchemaSync CLI",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-media-type": "banani-button",
                    style: t30,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                        icon: "lucide:external-link",
                        style: {
                            fontSize: 16
                        }
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 308,
                        columnNumber: 105
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 308,
                    columnNumber: 56
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 308,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "project-desc",
            children: "A command-line utility for safely managing and previewing database schema changes across multiple staging environments. It analyzes raw SQL files, generates dry-run execution plans, and flags potential destructive operations before they hit production databases."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 311,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = t31;
        $[33] = t32;
    } else {
        t31 = $[32];
        t32 = $[33];
    }
    let t33;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tech-stack",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Python"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 320,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Typer"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 320,
                    columnNumber: 79
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "SQLAlchemy"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 320,
                    columnNumber: 118
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 320,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[34] = t33;
    } else {
        t33 = $[34];
    }
    let t34;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[35] = t34;
    } else {
        t34 = $[35];
    }
    let t35;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-item",
            children: [
                t29,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        t31,
                        t32,
                        t33,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "project-links",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "project-link",
                                "data-media-type": "banani-button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: t34,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                            icon: "lucide:github",
                                            style: {
                                                fontSize: 16,
                                                color: "var(--foreground)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                            lineNumber: 340,
                                            columnNumber: 177
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                        lineNumber: 340,
                                        columnNumber: 160
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "View Source"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 340,
                                columnNumber: 97
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 340,
                            columnNumber: 66
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 340,
                    columnNumber: 46
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 340,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[36] = t35;
    } else {
        t35 = $[36];
    }
    let t36;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-meta",
            children: [
                "2021",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "project-meta-label",
                    children: "Library"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 350,
                    columnNumber: 45
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 350,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[37] = t36;
    } else {
        t36 = $[37];
    }
    let t37;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted-foreground)",
            cursor: "pointer"
        };
        $[38] = t37;
    } else {
        t37 = $[38];
    }
    let t38;
    let t39;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "project-title",
            children: [
                "StructLog-JSON",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-media-type": "banani-button",
                    style: t37,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                        icon: "lucide:external-link",
                        style: {
                            fontSize: 16
                        }
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 373,
                        columnNumber: 105
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 373,
                    columnNumber: 56
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 373,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "project-desc",
            children: "A minimal Python package that wraps standard logging to enforce structured JSON output. Built to standardize log formats across microservices for easier ingestion into Datadog and ELK stacks without boilerplate configurations and massive dependencies."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 376,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[39] = t38;
        $[40] = t39;
    } else {
        t38 = $[39];
        t39 = $[40];
    }
    let t40;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tech-stack",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Python"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 385,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "tech-tag",
                    children: "Logging"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 385,
                    columnNumber: 79
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 385,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[41] = t40;
    } else {
        t40 = $[41];
    }
    let t41;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = {
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
        $[42] = t41;
    } else {
        t41 = $[42];
    }
    let t42;
    let t43;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "section",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container grid-layout",
                children: [
                    t12,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: t13,
                        children: [
                            t22,
                            t28,
                            t35,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "project-item",
                                children: [
                                    t36,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            t38,
                                            t39,
                                            t40,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "project-links",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "project-link",
                                                    "data-media-type": "banani-button",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: t41,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                                                icon: "lucide:github",
                                                                style: {
                                                                    fontSize: 16,
                                                                    color: "var(--foreground)"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 282
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 265
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "View Source"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 202
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                lineNumber: 406,
                                                columnNumber: 171
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                        lineNumber: 406,
                                        columnNumber: 151
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 406,
                                columnNumber: 116
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                        lineNumber: 406,
                        columnNumber: 84
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 406,
                columnNumber: 40
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 406,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t43 = {
            padding: "8rem 0",
            backgroundColor: "var(--secondary)",
            borderTop: "1px solid var(--border)"
        };
        $[43] = t42;
        $[44] = t43;
    } else {
        t42 = $[43];
        t43 = $[44];
    }
    let t44;
    let t45;
    let t46;
    let t47;
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 600
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        fontSize: "3rem",
                        fontWeight: 500,
                        letterSpacing: "-0.03em",
                        color: "var(--foreground)",
                        marginBottom: "1.5rem",
                        lineHeight: 1.1
                    },
                    children: "Let's build something exceptional."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 428,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: "1.125rem",
                        color: "var(--muted-foreground)",
                        marginBottom: "2.5rem"
                    },
                    children: "Got a wild idea, a startup brief, or simply want to say hi? I'm all ears — just maybe not the caffeine kind."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 435,
                    columnNumber: 49
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: "1rem"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "btn-primary",
                            "data-media-type": "banani-button",
                            children: "Get in Touch"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 442,
                            columnNumber: 10
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "btn-outline",
                            "data-media-type": "banani-button",
                            children: "Access Project Portal"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 442,
                            columnNumber: 91
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 439,
                    columnNumber: 122
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 426,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t45 = {
            marginTop: "8rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        };
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: {
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
                margin: 0
            },
            children: "© 2025 Vincent Odume. All rights reserved."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 451,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t47 = {
            display: "flex",
            gap: "1.5rem",
            alignItems: "center"
        };
        $[45] = t44;
        $[46] = t45;
        $[47] = t46;
        $[48] = t47;
    } else {
        t44 = $[45];
        t45 = $[46];
        t46 = $[47];
        t47 = $[48];
    }
    let t48;
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
        t48 = {
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
        };
        $[49] = t48;
    } else {
        t48 = $[49];
    }
    let t49;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-media-type": "banani-button",
            style: t48,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                icon: "lucide:github",
                style: {
                    fontSize: 20,
                    color: "var(--muted-foreground)"
                }
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 487,
                columnNumber: 60
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 487,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[50] = t49;
    } else {
        t49 = $[50];
    }
    let t50;
    if ($[51] === Symbol.for("react.memo_cache_sentinel")) {
        t50 = {
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
        };
        $[51] = t50;
    } else {
        t50 = $[51];
    }
    let t51;
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-media-type": "banani-button",
            style: t50,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                icon: "lucide:linkedin",
                style: {
                    fontSize: 20,
                    color: "var(--muted-foreground)"
                }
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 511,
                columnNumber: 60
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 511,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[52] = t51;
    } else {
        t51 = $[52];
    }
    let t52;
    if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
        t52 = {
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
        };
        $[53] = t52;
    } else {
        t52 = $[53];
    }
    let t53;
    if ($[54] === Symbol.for("react.memo_cache_sentinel")) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-media-type": "banani-button",
            style: t52,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                icon: "lucide:twitter",
                style: {
                    fontSize: 20,
                    color: "var(--muted-foreground)"
                }
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                lineNumber: 535,
                columnNumber: 60
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
            lineNumber: 535,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[54] = t53;
    } else {
        t53 = $[54];
    }
    let t54;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = {
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
        };
        $[55] = t54;
    } else {
        t54 = $[55];
    }
    let t55;
    if ($[56] === Symbol.for("react.memo_cache_sentinel")) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t0,
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9aad3392cf2a7854" + " " + "export-wrapper",
                    children: [
                        t9,
                        t11,
                        t42,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            style: t43,
                            className: "jsx-9aad3392cf2a7854",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9aad3392cf2a7854" + " " + "container",
                                children: [
                                    t44,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: t45,
                                        className: "jsx-9aad3392cf2a7854",
                                        children: [
                                            t46,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: t47,
                                                className: "jsx-9aad3392cf2a7854",
                                                children: [
                                                    t49,
                                                    t51,
                                                    t53,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        "data-media-type": "banani-button",
                                                        style: t54,
                                                        className: "jsx-9aad3392cf2a7854",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iconify-icon", {
                                                            icon: "lucide:mail",
                                                            style: {
                                                                fontSize: 20,
                                                                color: "var(--muted-foreground)"
                                                            },
                                                            className: "jsx-9aad3392cf2a7854"
                                                        }, void 0, false, {
                                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 223
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                        lineNumber: 559,
                                                        columnNumber: 174
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                                lineNumber: 559,
                                                columnNumber: 142
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                        lineNumber: 559,
                                        columnNumber: 120
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                                lineNumber: 559,
                                columnNumber: 88
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                            lineNumber: 559,
                            columnNumber: 67
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            id: "9aad3392cf2a7854",
                            children: ':root{--background:#fff;--foreground:#0f1115;--muted:#f4f4f5;--muted-foreground:#71717a;--border:#e4e4e7;--primary:#475569;--primary-foreground:#fff;--secondary:#fafafa;--secondary-foreground:#0f1115;--radius-sm:2px;--radius-md:4px;--radius-lg:8px;--font-family-body:"Inter",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}*{box-sizing:border-box;margin:0;padding:0}.export-wrapper{font-family:var(--font-family-body);background-color:var(--background);color:var(--foreground);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.6}.container{max-width:1024px;margin:0 auto;padding:0 2rem}.grid-layout{grid-template-columns:200px 1fr;align-items:start;gap:4rem;display:grid}.section{border-top:1px solid var(--border);padding:6rem 0}.section-label{color:var(--foreground);margin:0;padding-top:.25rem;font-size:.875rem;font-weight:500}.nav-link{color:var(--muted-foreground);cursor:pointer;font-size:.875rem;font-weight:500;text-decoration:none}.nav-link.active{color:var(--foreground)}.btn-primary{background-color:var(--foreground);color:var(--background);border-radius:var(--radius-sm);border:1px solid var(--foreground);cursor:pointer;justify-content:center;align-items:center;padding:.75rem 1.5rem;font-size:.875rem;font-weight:500;text-decoration:none;display:inline-flex}.btn-outline{color:var(--foreground);border-radius:var(--radius-sm);border:1px solid var(--border);cursor:pointer;background-color:#0000;justify-content:center;align-items:center;padding:.75rem 1.5rem;font-size:.875rem;font-weight:500;text-decoration:none;display:inline-flex}.project-item{border-bottom:1px dashed var(--border);grid-template-columns:140px 1fr;gap:2rem;padding:3rem 0;display:grid}.project-item:first-child{padding-top:0}.project-item:last-child{border-bottom:none;padding-bottom:0}.project-meta{color:var(--muted-foreground);padding-top:.25rem;font-size:.9375rem}.project-meta-label{text-transform:uppercase;letter-spacing:.05em;color:var(--primary);margin-top:.5rem;font-size:.75rem;font-weight:600;display:block}.project-title{color:var(--foreground);align-items:center;gap:.75rem;margin-bottom:.5rem;font-size:1.25rem;font-weight:500;display:flex}.project-desc{color:var(--muted-foreground);margin-bottom:1.5rem;font-size:1rem;line-height:1.6}.tech-stack{flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;display:flex}.tech-tag{background-color:var(--secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--foreground);padding:.375rem .75rem;font-size:.75rem;font-weight:500}.project-links{gap:1.5rem;display:flex}.project-link{color:var(--foreground);cursor:pointer;align-items:center;gap:.375rem;font-size:.875rem;font-weight:500;text-decoration:none;display:inline-flex}:root{--border:#00000014;--input:#f7f7f8;--primary:#6b7c8e;--secondary:#f2f4f6;--muted:#f3f4f6;--muted-foreground:#8c8c8c}'
                        }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx",
                    lineNumber: 559,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true);
        $[56] = t55;
    } else {
        t55 = $[56];
    }
    return t55;
};
_c = ProjectsPage;
const __TURBOPACK__default__export__ = ProjectsPage;
var _c;
__turbopack_context__.k.register(_c, "ProjectsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/projects";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/veenzent/portfolio/v0_veenzent/pages/projects\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/veenzent/portfolio/v0_veenzent/pages/projects.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1cc37e95._.js.map