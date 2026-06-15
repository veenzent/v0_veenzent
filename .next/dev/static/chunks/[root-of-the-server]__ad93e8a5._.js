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
"[next]/internal/font/google/geist_59dbb69b.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_59dbb69b-module__dmyMEG__className",
  "variable": "geist_59dbb69b-module__dmyMEG__variable",
});
}),
"[next]/internal/font/google/geist_59dbb69b.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_59dbb69b.module.css [client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', 'Geist Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_4d1d9e3e.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_4d1d9e3e-module__mOt3xG__className",
  "variable": "geist_mono_4d1d9e3e-module__mOt3xG__variable",
});
}),
"[next]/internal/font/google/geist_mono_4d1d9e3e.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_4d1d9e3e.module.css [client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', 'Geist Mono Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
;
;
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "9c4d82efdd11979d62c6e3a6f1f00703a3ec62d36f5b20bbf338365a51209e17") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9c4d82efdd11979d62c6e3a6f1f00703a3ec62d36f5b20bbf338365a51209e17";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx",
            lineNumber: 16,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-xs font-semibold uppercase px-3 py-1 tracking-[0.02em]",
            children: [
                t1,
                children
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx",
            lineNumber: 23,
            columnNumber: 10
        }, this);
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
;
;
function Button(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "c1dc19dff4a9abb9551eb0b775bac03dddc37d9fd6f62e679eeb6d10bbc814e8") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c1dc19dff4a9abb9551eb0b775bac03dddc37d9fd6f62e679eeb6d10bbc814e8";
    }
    let children;
    let rest;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ variant: t1, children, className: t2, ...rest } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = rest;
        $[4] = t1;
        $[5] = t2;
    } else {
        children = $[2];
        rest = $[3];
        t1 = $[4];
        t2 = $[5];
    }
    const variant = t1 === undefined ? "primary" : t1;
    const className = t2 === undefined ? "" : t2;
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            primary: "bg-[var(--foreground)] text-[var(--primary-foreground)] border border-[var(--foreground)] hover:opacity-90",
            outline: "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]"
        };
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const variants = t3;
    const t4 = `${"inline-flex items-center justify-center px-6 py-3 rounded text-sm font-medium transition-colors"} ${variants[variant]} ${className}`;
    let t5;
    if ($[7] !== children || $[8] !== rest || $[9] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: t4,
            ...rest,
            children: children
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx",
            lineNumber: 54,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = rest;
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t5;
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CodeSnippetsBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
;
;
function CodeSnippetsBackground() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "9d1286a0214555ec9424a07e99d81dcdae42a191a5009fa59840eec0d72b8f4f") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9d1286a0214555ec9424a07e99d81dcdae42a191a5009fa59840eec0d72b8f4f";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[6%] right-[6%] max-w-[360px] leading-[1.6]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                children: "from fastapi import FastAPI\nfrom pydantic import BaseModel\napp = FastAPI(title=\"orders\")\n\nclass Order(BaseModel):\n    id: int\n    total: float\n\n@app.get(\"/health\")\nasync def health_check():\n    return {\"status\": \"ok\"}"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 12,
                columnNumber: 148
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 12,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-0 right-[18%] max-w-[320px] leading-[1.6]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                children: "# celery_app.py\nfrom celery import Celery\ncelery_app = Celery(\n    \"worker\",\n    broker=\"redis://localhost:6379/0\",\n    backend=\"redis://localhost:6379/1\"\n)\n\n@celery_app.task\ndef send_email(user_id: int) -> None:\n    ..."
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 19,
                columnNumber: 149
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 19,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[2%] left-[28%] max-w-[280px] leading-[1.6]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]",
                children: "$ psql postgresql://localhost/app\n> \\dt\n> SELECT COUNT(*) FROM orders;\n> EXPLAIN ANALYZE SELECT * FROM orders\n  WHERE status = 'open';"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 26,
                columnNumber: 151
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[25%] left-[45%] max-w-[260px] leading-[1.6]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded border border-[var(--border)] bg-[var(--background)]",
                children: "$ uvicorn app:app --reload\nINFO Loaded config from .env\nINFO Started server process [8421]\nINFO Waiting for application startup.\nINFO Application startup complete."
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 33,
                columnNumber: 149
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 33,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[14%] left-[6%] max-w-[320px] leading-[1.6]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]",
                children: "$ git clone git@github.com:veenzent/orders-service.git\n$ cd orders-service\n$ uvicorn app.main:app --reload"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                lineNumber: 40,
                columnNumber: 148
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-0 left-0 w-full h-full pointer-events-none opacity-15 z-0",
            children: [
                t0,
                t1,
                t2,
                t3,
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[20%] left-[2%] max-w-[340px] leading-[1.6]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 rounded border border-[var(--border)] bg-[var(--input)]",
                        children: "# db.py\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker\n\nDATABASE_URL = \"postgresql+psycopg2://app:***@localhost:5432/orders\"\nengine = create_engine(DATABASE_URL, pool_pre_ping=True)\nSessionLocal = sessionmaker(\n    autocommit=False, autoflush=False, bind=engine\n)"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                        lineNumber: 47,
                        columnNumber: 259
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
                    lineNumber: 47,
                    columnNumber: 118
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx",
            lineNumber: 47,
            columnNumber: 10
        }, this);
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    return t5;
}
_c = CodeSnippetsBackground;
var _c;
__turbopack_context__.k.register(_c, "CodeSnippetsBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Badge.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$CodeSnippetsBackground$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/CodeSnippetsBackground.tsx [client] (ecmascript)");
;
;
;
;
;
function Hero() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "6f155765c3efd1dbea0aa8635b2519294960e55b3ce45aa51551f69ddf28c903") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6f155765c3efd1dbea0aa8635b2519294960e55b3ce45aa51551f69ddf28c903";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$CodeSnippetsBackground$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 15,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            children: "Available for new opportunities"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "mt-6 text-4xl font-medium leading-tight text-(--foreground)",
            children: [
                "Systems that stay up.",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 30,
                    columnNumber: 107
                }, this),
                "Quietly powering products."
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-6 max-w-lg text-lg text-(--muted-foreground)",
            children: "I'm Vincent Odume, a backend-leaning software engineer focused on reliable APIs, pragmatic architecture, and turning complex systems into calm, maintainable code."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 31,
            columnNumber: 10
        }, this);
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-32 relative overflow-hidden",
            children: [
                t0,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto max-w-3xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10",
                        children: [
                            t1,
                            t2,
                            t3,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "primary",
                                        className: "cursor-pointer",
                                        children: "View Projects"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                        lineNumber: 40,
                                        columnNumber: 187
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "outline",
                                        className: "cursor-pointer",
                                        children: "View Blog Posts"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                        lineNumber: 40,
                                        columnNumber: 262
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                lineNumber: 40,
                                columnNumber: 154
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                        lineNumber: 40,
                        columnNumber: 111
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 40,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComplimentRotator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function ComplimentRotator(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "139de87143e55ed0f45e19aeb52ddd3cc613f7197a7b559efefa38ac92bbc240") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "139de87143e55ed0f45e19aeb52ddd3cc613f7197a7b559efefa38ac92bbc240";
    }
    const { compliments, intervalMs: t1 } = t0;
    const intervalMs = t1 === undefined ? 4200 : t1;
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const count = compliments.length;
    let t2;
    let t3;
    if ($[1] !== count || $[2] !== intervalMs) {
        t2 = ({
            "ComplimentRotator[useEffect()]": ()=>{
                if (count <= 1) {
                    return;
                }
                const timer = setInterval({
                    "ComplimentRotator[useEffect() > setInterval()]": ()=>{
                        setCurrentIndex({
                            "ComplimentRotator[useEffect() > setInterval() > setCurrentIndex()]": (prev)=>(prev + 1) % count
                        }["ComplimentRotator[useEffect() > setInterval() > setCurrentIndex()]"]);
                    }
                }["ComplimentRotator[useEffect() > setInterval()]"], intervalMs);
                return ()=>clearInterval(timer);
            }
        })["ComplimentRotator[useEffect()]"];
        t3 = [
            count,
            intervalMs
        ];
        $[1] = count;
        $[2] = intervalMs;
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    if (count === 0) {
        return null;
    }
    const t4 = `translateX(-${currentIndex * 100}%)`;
    let t5;
    if ($[5] !== t4) {
        t5 = {
            transform: t4,
            transition: "transform 0.6s ease"
        };
        $[5] = t4;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== compliments) {
        t6 = compliments.map(_ComplimentRotatorComplimentsMap);
        $[7] = compliments;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] !== t5 || $[10] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full",
            style: t5,
            "aria-live": "polite",
            children: t6
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
            lineNumber: 79,
            columnNumber: 10
        }, this);
        $[9] = t5;
        $[10] = t6;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== compliments || $[13] !== count || $[14] !== currentIndex) {
        t8 = count > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-4 flex items-center justify-center gap-2",
            children: compliments.map({
                "ComplimentRotator[compliments.map()]": (_, idx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `h-2 w-2 rounded-full transition-colors ${idx_0 === currentIndex ? "bg-(--foreground)" : "bg-(--muted-foreground)"}`
                    }, `dot-${idx_0}`, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                        lineNumber: 89,
                        columnNumber: 63
                    }, this)
            }["ComplimentRotator[compliments.map()]"])
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
            lineNumber: 88,
            columnNumber: 23
        }, this);
        $[12] = compliments;
        $[13] = count;
        $[14] = currentIndex;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t7 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-4xl min-h-35 overflow-hidden rounded border border-dashed border-(--border) p-5 bg-(--muted)",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
            lineNumber: 100,
            columnNumber: 10
        }, this);
        $[16] = t7;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    return t9;
}
_s(ComplimentRotator, "tPjzCc9H5UuFdWNuAHYoD0K4UOk=");
_c = ComplimentRotator;
function _ComplimentRotatorComplimentsMap(item, idx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-full px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "italic text-lg leading-relaxed mb-2 text-(--foreground) break-word",
                children: [
                    '"',
                    item.text,
                    '"'
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                lineNumber: 110,
                columnNumber: 73
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-(--muted-foreground)",
                children: [
                    "— ",
                    item.author
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
                lineNumber: 110,
                columnNumber: 172
            }, this)
        ]
    }, `${item.author}-${idx}`, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx",
        lineNumber: 110,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "ComplimentRotator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/cent-edited.d66a095a.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ComplimentRotator$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/ComplimentRotator.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/cent-edited.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
;
;
;
;
function AboutSection() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "ef1ee5dca3b8e1018e1ef7492ebad63035d6c2718030e2798c2131dc35bd1ae4") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ef1ee5dca3b8e1018e1ef7492ebad63035d6c2718030e2798c2131dc35bd1ae4";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [
            {
                text: "Vincent was incredibly effective at quickly understanding the problem space and delivering high-quality backend architecture.",
                author: "Anonymous Nicole, Product Lead"
            },
            {
                text: "His focus on reliability and maintainability saved us weeks of technical debt down the road.",
                author: "Anonymous Ahmed, Engineering Manager"
            }
        ];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const unpaidCompliments = t0;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "4rem",
            alignItems: "start"
        };
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-sm font-semibold uppercase text-(--foreground)",
            style: {
                paddingTop: "0.25rem"
            },
            children: "About"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 41,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
            alt: "Portrait",
            className: "w-full h-auto rounded shadow-sm object-cover grayscale contrast-110 bg-(--muted)"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 50,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto max-w-5xl",
            style: t1,
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-2 gap-16 items-start",
                    children: [
                        t3,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 text-sm text-(--muted-foreground)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Hello! I'm Vincent — a backend-leaning software developer with a strong focus on building fast, secure, and reliable web systems. I enjoy turning complex ideas into scalable solutions that behave predictably under real-world demands."
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                        lineNumber: 57,
                                        columnNumber: 228
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "From architecting MVPs for startups to refining legacy systems and designing robust internal APIs, I bring products to life using modern, industry-standard tools. My core stack includes FastAPI, React, and databases like PostgreSQL and MongoDB."
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                        lineNumber: 57,
                                        columnNumber: 468
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "I approach problem-solving with a research-driven and iterative mindset by digging deep to design solid foundations, so what we build today remains stable, maintainable, and ready to scale tomorrow."
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                        lineNumber: 57,
                                        columnNumber: 719
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                lineNumber: 57,
                                columnNumber: 167
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                            lineNumber: 57,
                            columnNumber: 130
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 57,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-24",
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 pt-6 border-t border-dashed border-(--border) flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-4xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold uppercase tracking-wider mb-4 text-(--foreground) text-center",
                                children: "Unpaid Compliments"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                lineNumber: 64,
                                columnNumber: 163
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ComplimentRotator$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                compliments: unpaidCompliments
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                lineNumber: 64,
                                columnNumber: 286
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                        lineNumber: 64,
                        columnNumber: 129
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 64,
                    columnNumber: 41
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    return t5;
}
_c = AboutSection;
var _c;
__turbopack_context__.k.register(_c, "AboutSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/link.js [client] (ecmascript)");
;
;
;
function NavLink(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "dc7a33d73af8dac898a5f56f47599efd2eb095550a9079ef27706c290c665fbc") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "dc7a33d73af8dac898a5f56f47599efd2eb095550a9079ef27706c290c665fbc";
    }
    const { href, children, active: t1 } = t0;
    const active = t1 === undefined ? false : t1;
    const t2 = `text-sm font-medium transition-colors ${active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`;
    let t3;
    if ($[1] !== children || $[2] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            className: t2,
            children: children
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx",
            lineNumber: 21,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== href || $[5] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            legacyBehavior: true,
            children: t3
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        $[4] = href;
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    return t4;
}
_c = NavLink;
var _c;
__turbopack_context__.k.register(_c, "NavLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/NavLink.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Header() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(43);
    if ($[0] !== "398d242f07c1453e4ca753be58b2df1b24047375a8faadbfb35265d8e15e829c") {
        for(let $i = 0; $i < 43; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "398d242f07c1453e4ca753be58b2df1b24047375a8faadbfb35265d8e15e829c";
    }
    const { pathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "font-mono text-(--foreground) text-lg font-semibold tracking-tight",
            children: "<veenzent/>"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 17,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://github.com/veenzent",
            className: "flex items-center justify-center w-5 h-5 text-(--foreground)",
            "aria-label": "GitHub",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-5 w-5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577\r\n                    0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73\r\n                    1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93\r\n                    0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23\r\n                    a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23\r\n                    .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921\r\n                    .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12\r\n                    c0-6.627-5.373-12-12-12z"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 24,
                    columnNumber: 255
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                lineNumber: 24,
                columnNumber: 141
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 24,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "md:hidden flex justify-between items-center mb-6",
            children: [
                t0,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-5",
                    children: [
                        t1,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://veenzent.cv",
                            className: "flex items-center justify-center w-5 h-5 text-(--foreground)",
                            "aria-label": "Resume",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "h-5 w-5",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                    lineNumber: 31,
                                    columnNumber: 349
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 31,
                                columnNumber: 235
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 31,
                            columnNumber: 112
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 31,
                    columnNumber: 80
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 31,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const t3 = pathname === "/";
    let t4;
    if ($[4] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/",
            active: t3,
            children: "Home"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const t5 = pathname === "/about";
    let t6;
    if ($[6] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/about",
            active: t5,
            children: "About"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, this);
        $[6] = t5;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    const t7 = pathname === "/projects";
    let t8;
    if ($[8] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/projects",
            active: t7,
            children: "Projects"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[8] = t7;
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    const t9 = pathname === "/blog";
    let t10;
    if ($[10] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/blog",
            active: t9,
            children: "Blogs"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 66,
            columnNumber: 11
        }, this);
        $[10] = t9;
        $[11] = t10;
    } else {
        t10 = $[11];
    }
    const t11 = pathname === "/contact";
    let t12;
    if ($[12] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/contact",
            active: t11,
            children: "Contacts"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 75,
            columnNumber: 11
        }, this);
        $[12] = t11;
        $[13] = t12;
    } else {
        t12 = $[13];
    }
    let t13;
    if ($[14] !== t10 || $[15] !== t12 || $[16] !== t4 || $[17] !== t6 || $[18] !== t8) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "md:hidden overflow-x-auto hide-scrollbar",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex gap-4 justify-center px-5 pb-2",
                children: [
                    t4,
                    t6,
                    t8,
                    t10,
                    t12
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                lineNumber: 83,
                columnNumber: 69
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 83,
            columnNumber: 11
        }, this);
        $[14] = t10;
        $[15] = t12;
        $[16] = t4;
        $[17] = t6;
        $[18] = t8;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "font-mono text-(--foreground) text-lg font-semibold tracking-tight",
            children: "<veenzent/>"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 95,
            columnNumber: 11
        }, this);
        $[20] = t14;
    } else {
        t14 = $[20];
    }
    const t15 = pathname === "/";
    let t16;
    if ($[21] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/",
            active: t15,
            children: "Home"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 103,
            columnNumber: 11
        }, this);
        $[21] = t15;
        $[22] = t16;
    } else {
        t16 = $[22];
    }
    const t17 = pathname === "/about";
    let t18;
    if ($[23] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/about",
            active: t17,
            children: "About"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 112,
            columnNumber: 11
        }, this);
        $[23] = t17;
        $[24] = t18;
    } else {
        t18 = $[24];
    }
    const t19 = pathname === "/projects";
    let t20;
    if ($[25] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/projects",
            active: t19,
            children: "Projects"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 121,
            columnNumber: 11
        }, this);
        $[25] = t19;
        $[26] = t20;
    } else {
        t20 = $[26];
    }
    const t21 = pathname === "/blog";
    let t22;
    if ($[27] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/blog",
            active: t21,
            children: "Blogs"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 130,
            columnNumber: 11
        }, this);
        $[27] = t21;
        $[28] = t22;
    } else {
        t22 = $[28];
    }
    const t23 = pathname === "/contact";
    let t24;
    if ($[29] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/contact",
            active: t23,
            children: "Contacts"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 139,
            columnNumber: 11
        }, this);
        $[29] = t23;
        $[30] = t24;
    } else {
        t24 = $[30];
    }
    let t25;
    if ($[31] !== t16 || $[32] !== t18 || $[33] !== t20 || $[34] !== t22 || $[35] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex gap-8",
            children: [
                t16,
                t18,
                t20,
                t22,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[31] = t16;
        $[32] = t18;
        $[33] = t20;
        $[34] = t22;
        $[35] = t24;
        $[36] = t25;
    } else {
        t25 = $[36];
    }
    let t26;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "https://github.com/veenzent",
                    className: "flex items-center gap-2 text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577\r\n                    0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.089-.745.083-.73.083-.73\r\n                    1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93\r\n                    0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23\r\n                    a11.52 11.52 0 013.003-.404c1.018.005 2.043.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23\r\n                    .653 1.649.242 2.873.118 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.625-5.478 5.921\r\n                    .43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 21.796 24 17.299 24 12\r\n                    c0-6.627-5.373-12-12-12z"
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                                lineNumber: 159,
                                columnNumber: 318
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 159,
                            columnNumber: 204
                        }, this),
                        "GitHub"
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 159,
                    columnNumber: 52
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "https://veenzent.cv",
                    className: "text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)",
                    children: "Resume"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 159,
                    columnNumber: 1303
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 159,
            columnNumber: 11
        }, this);
        $[37] = t26;
    } else {
        t26 = $[37];
    }
    let t27;
    if ($[38] !== t25) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden md:flex justify-between items-center gap-8",
            children: [
                t14,
                t25,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 166,
            columnNumber: 11
        }, this);
        $[38] = t25;
        $[39] = t27;
    } else {
        t27 = $[39];
    }
    let t28;
    if ($[40] !== t13 || $[41] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "py-6 md:py-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-5 md:px-8",
                children: [
                    t2,
                    t13,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                lineNumber: 174,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 174,
            columnNumber: 11
        }, this);
        $[40] = t13;
        $[41] = t27;
        $[42] = t28;
    } else {
        t28 = $[42];
    }
    return t28;
}
_s(Header, "6xaW9Jgu1F6Px3xMzMnI48KIteM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
;
;
function ContactFooter() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "bd181c748f91ab8af61e5669533ab35cf3c61b4b14f8af376093c7be9391c726") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bd181c748f91ab8af61e5669533ab35cf3c61b4b14f8af376093c7be9391c726";
    }
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-medium leading-tight mb-6 text-(--foreground)",
            children: "Let's build something remarkable."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 13,
            columnNumber: 10
        }, this);
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-lg text-(--muted-foreground) mb-8",
            children: "Have an ambitious idea, a project outline, or just want to say hello? I'm interested in hearing from you."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 14,
            columnNumber: 10
        }, this);
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    className: "inline-flex items-center justify-center px-6 py-3 rounded bg-(--foreground) text-(--primary-foreground) border border-(--foreground) text-sm font-medium hover:opacity-90 transition-opacity",
                    href: "#",
                    children: "Get in Touch"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 23,
                    columnNumber: 38
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    className: "inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-(--foreground) border border-(--border) text-sm font-medium hover:bg-(--muted) transition-colors",
                    href: "#",
                    children: "Access Project Portal"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 23,
                    columnNumber: 267
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 23,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-(--muted-foreground)",
            children: "© 2026 veenzent. All rights reserved."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-32 bg-(--secondary) border-t border-(--border)",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto max-w-3xl",
                children: [
                    t0,
                    t1,
                    t2,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-32 pt-8 border-t border-(--border) flex justify-between items-center",
                        children: [
                            t3,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                                        children: "GitHub"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                        lineNumber: 37,
                                        columnNumber: 259
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                                        children: "LinkedIn"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                        lineNumber: 37,
                                        columnNumber: 363
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                                        children: "Twitter"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                        lineNumber: 37,
                                        columnNumber: 469
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        className: "text-(--muted-foreground) hover:text-(--foreground) transition-colors",
                                        children: "Mail"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                        lineNumber: 37,
                                        columnNumber: 574
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                lineNumber: 37,
                                columnNumber: 231
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                        lineNumber: 37,
                        columnNumber: 138
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                lineNumber: 37,
                columnNumber: 81
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
_c = ContactFooter;
var _c;
__turbopack_context__.k.register(_c, "ContactFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$ContactFooter$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx [client] (ecmascript)");
;
;
;
;
function Layout(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "43d40ab1c07cf42cbec3fe81fb574970f5d54a3ac96aa8ecfce46789607f2081") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "43d40ab1c07cf42cbec3fe81fb574970f5d54a3ac96aa8ecfce46789607f2081";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
            lineNumber: 18,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1",
            children: children
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
            lineNumber: 25,
            columnNumber: 10
        }, this);
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$ContactFooter$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
            lineNumber: 33,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen",
            children: [
                t1,
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[5] = t2;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    return t4;
}
_c = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_59dbb69b.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_4d1d9e3e.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx [client] (ecmascript)");
;
;
;
;
;
;
;
function Home() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "4a471469c5b3dcc36f0cf3ec82dae7309229541d22b9c7cda5f517de6d76898a") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4a471469c5b3dcc36f0cf3ec82dae7309229541d22b9c7cda5f517de6d76898a";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_59dbb69b$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].className} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_4d1d9e3e$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].className} font-sans`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                        lineNumber: 26,
                        columnNumber: 93
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                        lineNumber: 26,
                        columnNumber: 101
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                lineNumber: 26,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/veenzent/portfolio/v0_veenzent/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ad93e8a5._.js.map