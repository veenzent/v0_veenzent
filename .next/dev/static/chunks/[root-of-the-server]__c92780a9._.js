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
;
;
;
;
function Hero() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "7b8a22fcc0969f6b953c8f23010f1012b7826fbed85ff62e4895408de9ce3295") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7b8a22fcc0969f6b953c8f23010f1012b7826fbed85ff62e4895408de9ce3295";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-5 -right-20 max-w-70 text-[0.4rem] leading-6 text-[var(--muted-foreground)] font-mono whitespace-pre transform -rotate-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5 rounded-md bg-[var(--input)] border border-[var(--border)]",
                children: 'from fastapi import FastAPI from pydantic import BaseModel app = FastAPI(title="orders")'
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                lineNumber: 14,
                columnNumber: 161
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 14,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 pointer-events-none opacity-15",
            children: [
                t0,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-5 -left-10 max-w-70 text-[0.4rem] leading-6 text-[var(--muted-foreground)] font-mono whitespace-pre transform rotate-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 rounded-md bg-[var(--background)] border border-dashed border-[var(--border)]",
                        children: "$ psql postgresql://localhost/app > \\dt > SELECT COUNT(*) FROM orders;"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                        lineNumber: 21,
                        columnNumber: 231
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 21,
                    columnNumber: 79
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 21,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            children: "Available for new opportunities"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 28,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "mt-5 text-3xl md:text-4xl font-medium leading-tight text-[var(--foreground)]",
            children: [
                "Systems that stay up.",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 36,
                    columnNumber: 124
                }, this),
                "Quietly powering products."
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, this);
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-5 text-base md:text-lg text-[var(--muted-foreground)] leading-6",
            children: "I'm Vincent Odume, a backend-leaning software engineer focused on reliable APIs, pragmatic architecture, and turning complex systems into calm, maintainable code."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[4] = t3;
        $[5] = t4;
    } else {
        t3 = $[4];
        t4 = $[5];
    }
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-16 md:py-32 relative overflow-hidden",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10",
                        children: [
                            t2,
                            t3,
                            t4,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-10 flex flex-col gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "primary",
                                        className: "w-full",
                                        children: "View Projects"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                        lineNumber: 46,
                                        columnNumber: 201
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "outline",
                                        className: "w-full",
                                        children: "View Blog Posts"
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                        lineNumber: 46,
                                        columnNumber: 268
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                                lineNumber: 46,
                                columnNumber: 158
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                        lineNumber: 46,
                        columnNumber: 115
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
                    lineNumber: 46,
                    columnNumber: 75
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Hero.tsx",
            lineNumber: 46,
            columnNumber: 10
        }, this);
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    return t5;
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/LiteLink.df9d20a3.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/BizzAi.6fb3ce1d.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/loopstudios.53ee3b55.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/boredtap.fbd5e085.png");}),
"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png.mjs { IMAGE => \"[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Projects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/ui/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/LiteLink.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/BizzAi.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/loopstudios.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png.mjs { IMAGE => "[project]/veenzent/portfolio/v0_veenzent/assets/boredtap.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
;
;
;
;
;
;
;
const projects = [
    {
        title: "LiteLink",
        description: "Shorten long URLs into sleek, memorable (customizable) links that are easy to share and track.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$LiteLink$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src
    },
    {
        title: "BizAi",
        description: "A conversational assistant focused on business information and registration trends in Nigeria.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$BizzAi$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src
    },
    {
        title: "loopstudios",
        description: "Landing page for loopstudios. Immersive experiences that deliver. The leader in interactive VR",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$loopstudios$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src
    },
    {
        title: "BoredTap",
        description: "A Telegram mini app where users engage in various activities to earn coins: tapping, completing tasks, participating in challenges, tasks and other interactive features. The app integrates gamification elements to drive user engagement.",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$boredtap$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src
    }
];
function Projects() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "27e5540326fff1144c71575c3b18890855a94d0ada2439d09fa9eb3c8ee5a27a") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "27e5540326fff1144c71575c3b18890855a94d0ada2439d09fa9eb3c8ee5a27a";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-sm font-medium text-[var(--foreground)]",
            children: "Systems"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
            lineNumber: 35,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-12 border-t border-[var(--border)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-7.5",
                    children: [
                        t0,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-10",
                            children: [
                                projects.map(_ProjectsProjectsMap),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "outline",
                                    className: "w-full",
                                    children: "View full systems gallery"
                                }, void 0, false, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                                    lineNumber: 42,
                                    columnNumber: 226
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                            lineNumber: 42,
                            columnNumber: 152
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                    lineNumber: 42,
                    columnNumber: 109
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                lineNumber: 42,
                columnNumber: 69
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
            lineNumber: 42,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
}
_c = Projects;
function _ProjectsProjectsMap(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 cursor-pointer group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-4/3 bg-[var(--muted)] rounded-sm overflow-hidden border border-[var(--border)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: p.image,
                    alt: p.title,
                    className: "w-full h-full object-cover grayscale opacity-80 mix-blend-multiply group-hover:opacity-100 transition-opacity"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                    lineNumber: 50,
                    columnNumber: 185
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                lineNumber: 50,
                columnNumber: 82
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-medium text-[var(--foreground)]",
                        children: p.title
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                        lineNumber: 50,
                        columnNumber: 353
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-[var(--muted-foreground)]",
                        children: p.description
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                        lineNumber: 50,
                        columnNumber: 430
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
                lineNumber: 50,
                columnNumber: 348
            }, this)
        ]
    }, p.title, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx",
        lineNumber: 50,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "Projects");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Notes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/node_modules/.pnpm/react@19.2.3/node_modules/react/compiler-runtime.js [client] (ecmascript)");
;
;
const notes = [
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
function Notes() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "9500c9f4f7cfbd1098cb1daae08c5fdb7fd2219c2cb9af731ef7ffd248600756") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9500c9f4f7cfbd1098cb1daae08c5fdb7fd2219c2cb9af731ef7ffd248600756";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-10 -right-15 w-45 h-35",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "https://storage.googleapis.com/banani-generated-images/generated-images/0634c4c5-5d3e-4a7f-a81c-6765ec376f03.jpg",
                alt: "Notepad illustration",
                className: "w-full h-full object-contain"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                lineNumber: 26,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 pointer-events-none opacity-[0.18]",
            children: [
                t0,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-5 -left-5 w-35 h-30",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "https://storage.googleapis.com/banani-generated-images/generated-images/f681e781-7ff1-4d9b-a9bc-384dbd7eb191.jpg",
                        alt: "Coffee and notebook illustration",
                        className: "w-full h-full object-contain"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 33,
                        columnNumber: 136
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                    lineNumber: 33,
                    columnNumber: 83
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
            lineNumber: 33,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-sm font-medium text-[var(--foreground)]",
            children: "Notes & Writing"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-12 border-t border-[var(--border)] relative overflow-hidden",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-5 relative z-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-7.5",
                        children: [
                            t2,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: notes.map(_NotesNotesMap)
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                                lineNumber: 47,
                                columnNumber: 195
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                        lineNumber: 47,
                        columnNumber: 152
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                    lineNumber: 47,
                    columnNumber: 98
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
            lineNumber: 47,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    return t3;
}
_c = Notes;
function _NotesNotesMap(n) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: n.link || "#",
        target: n.link ? "_blank" : "_self",
        rel: n.link ? "noopener noreferrer" : undefined,
        className: "flex flex-col gap-1 py-5 border-b border-[var(--border)] bg-white/90 hover:bg-[var(--muted)] transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-base font-medium text-[var(--foreground)] leading-4",
                children: n.title
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                lineNumber: 55,
                columnNumber: 257
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-[var(--muted-foreground)]",
                children: n.date
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
                lineNumber: 55,
                columnNumber: 348
            }, this)
        ]
    }, n.title, true, {
        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx",
        lineNumber: 55,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "Notes");
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
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "97d867e88e0c6a4eb34f067d4cbedb99339e873beedb75f41c353aec3c598595") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "97d867e88e0c6a4eb34f067d4cbedb99339e873beedb75f41c353aec3c598595";
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
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-sm font-medium text-[var(--foreground)]",
            children: "About"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 29,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$assets$2f$cent$2d$edited$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
            alt: "Portrait",
            className: "w-full max-h-96 object-cover rounded-sm grayscale contrast-110 bg-[var(--border)]"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 text-sm text-[var(--muted-foreground)] leading-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Hello! I'm Vincent — a backend-leaning software developer with a strong focus on building fast, secure, and reliable web systems. I enjoy turning complex ideas into scalable solutions that behave predictably under real-world demands."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 39,
                    columnNumber: 96
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "From architecting MVPs for startups to refining legacy systems and designing robust internal APIs, I bring products to life using modern, industry-standard tools. My core stack includes FastAPI, React, and databases like PostgreSQL and MongoDB."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 39,
                    columnNumber: 336
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "I approach problem-solving with a research-driven and iterative mindset by digging deep to design solid foundations, so what we build today remains stable, maintainable, and ready to scale tomorrow."
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 39,
                    columnNumber: 587
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-12 border-t border-[var(--border)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-10",
                    children: [
                        t1,
                        t2,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-6",
                            children: [
                                t3,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-10 border-t border-dashed border-[var(--border)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xs font-semibold uppercase tracking-wider mb-4 text-[var(--foreground)]",
                                            children: "Unpaid Compliments"
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                            lineNumber: 46,
                                            columnNumber: 265
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$ComplimentRotator$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            compliments: unpaidCompliments
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                            lineNumber: 46,
                                            columnNumber: 381
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                                    lineNumber: 46,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                            lineNumber: 46,
                            columnNumber: 155
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                    lineNumber: 46,
                    columnNumber: 109
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
                lineNumber: 46,
                columnNumber: 69
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx",
            lineNumber: 46,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
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
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(21);
    if ($[0] !== "833e7a7ea5b0158488c3138c7a510d3ca40e9cbfd8b95c46deebfb9f9fc08671") {
        for(let $i = 0; $i < 21; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "833e7a7ea5b0158488c3138c7a510d3ca40e9cbfd8b95c46deebfb9f9fc08671";
    }
    const { pathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "font-mono text-(--foreground) text-lg font-semibold tracking-tight",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/",
                className: "cursor-default",
                children: "<veenzent/>"
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                lineNumber: 17,
                columnNumber: 94
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 17,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const t1 = pathname === "/";
    let t2;
    if ($[2] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/",
            active: t1,
            children: "Home"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 25,
            columnNumber: 10
        }, this);
        $[2] = t1;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const t3 = pathname === "/about";
    let t4;
    if ($[4] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/about",
            active: t3,
            children: "About"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 34,
            columnNumber: 10
        }, this);
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const t5 = pathname === "/projects";
    let t6;
    if ($[6] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/projects",
            active: t5,
            children: "Projects"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
        $[6] = t5;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    const t7 = pathname === "/blog";
    let t8;
    if ($[8] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/blog",
            active: t7,
            children: "Blogs"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 52,
            columnNumber: 10
        }, this);
        $[8] = t7;
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    const t9 = pathname === "/contact";
    let t10;
    if ($[10] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$ui$2f$NavLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/contact",
            active: t9,
            children: "Contacts"
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 61,
            columnNumber: 11
        }, this);
        $[10] = t9;
        $[11] = t10;
    } else {
        t10 = $[11];
    }
    let t11;
    if ($[12] !== t10 || $[13] !== t2 || $[14] !== t4 || $[15] !== t6 || $[16] !== t8) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex gap-10",
            children: [
                t2,
                t4,
                t6,
                t8,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 69,
            columnNumber: 11
        }, this);
        $[12] = t10;
        $[13] = t2;
        $[14] = t4;
        $[15] = t6;
        $[16] = t8;
        $[17] = t11;
    } else {
        t11 = $[17];
    }
    let t12;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "https://github.com/veenzent",
                    className: "flex items-center gap-2 text-(--muted-foreground)] text-sm transition-colors hover:text-[var(--foreground)",
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
                                lineNumber: 81,
                                columnNumber: 323
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                            lineNumber: 81,
                            columnNumber: 209
                        }, this),
                        "GitHub"
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 81,
                    columnNumber: 52
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "https://veenzent.cv",
                    className: "text-(--muted-foreground) text-sm transition-colors hover:text-(--foreground)",
                    children: "Resume"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                    lineNumber: 81,
                    columnNumber: 1308
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 81,
            columnNumber: 11
        }, this);
        $[18] = t12;
    } else {
        t12 = $[18];
    }
    let t13;
    if ($[19] !== t11) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "py-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto flex justify-between items-center px-8",
                children: [
                    t0,
                    t11,
                    t12
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
                lineNumber: 88,
                columnNumber: 36
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/Header.tsx",
            lineNumber: 88,
            columnNumber: 11
        }, this);
        $[19] = t11;
        $[20] = t13;
    } else {
        t13 = $[20];
    }
    return t13;
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
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "0b9ef1ceeb68bcad6d8a54f77d80c8155a64d9c50017b8b5408650d6c2c071d0") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0b9ef1ceeb68bcad6d8a54f77d80c8155a64d9c50017b8b5408650d6c2c071d0";
    }
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl md:text-3xl font-medium leading-tight text-[var(--foreground)] mb-4",
            children: "Let's build something exceptional."
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 13,
            columnNumber: 10
        }, this);
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-base text-[var(--muted-foreground)] mb-8",
            children: "Got a wild idea, a startup brief, or simply want to say hi? I'm all ears — just maybe not the caffeine kind."
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
            className: "mb-12",
            children: [
                t0,
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "inline-flex items-center justify-center px-6 py-3 rounded bg-[var(--foreground)] text-[var(--background)] border border-[var(--foreground)] text-sm font-medium hover:opacity-90 transition-opacity w-full",
                            href: "#",
                            children: "Get in Touch"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                            lineNumber: 23,
                            columnNumber: 78
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "inline-flex items-center justify-center px-6 py-3 rounded bg-transparent text-[var(--foreground)] border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors w-full",
                            href: "#",
                            children: "Access Project Portal"
                        }, void 0, false, {
                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                            lineNumber: 23,
                            columnNumber: 321
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 23,
                    columnNumber: 41
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
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://github.com/veenzent",
            className: "flex items-center justify-center w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
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
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 30,
                    columnNumber: 315
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                lineNumber: 30,
                columnNumber: 201
            }, this)
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
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://linkedin.com/in/veenzent",
            className: "flex items-center justify-center w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
            "aria-label": "LinkedIn",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-5 w-5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                        lineNumber: 37,
                        columnNumber: 322
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "4",
                        cy: "4",
                        r: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                        lineNumber: 37,
                        columnNumber: 480
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                lineNumber: 37,
                columnNumber: 208
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
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://twitter.com/veenzent",
            className: "flex items-center justify-center w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
            "aria-label": "Twitter",
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
                    d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                }, void 0, false, {
                    fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                    lineNumber: 44,
                    columnNumber: 317
                }, this)
            }, void 0, false, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                lineNumber: 44,
                columnNumber: 203
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 44,
            columnNumber: 10
        }, this);
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-12 bg-[var(--secondary)] border-t border-[var(--border)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-5",
                children: [
                    t2,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-8 border-t border-[var(--border)] flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-6",
                                children: [
                                    t3,
                                    t4,
                                    t5,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "mailto:hello@veenzent.dev",
                                        className: "flex items-center justify-center w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
                                        "aria-label": "Email",
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
                                                d: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            }, void 0, false, {
                                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                                lineNumber: 51,
                                                columnNumber: 551
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                            lineNumber: 51,
                                            columnNumber: 437
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                        lineNumber: 51,
                                        columnNumber: 249
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                lineNumber: 51,
                                columnNumber: 209
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[var(--muted-foreground)]",
                                children: "© 2026 veenzent. All rights reserved."
                            }, void 0, false, {
                                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                                lineNumber: 51,
                                columnNumber: 741
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                        lineNumber: 51,
                        columnNumber: 135
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
                lineNumber: 51,
                columnNumber: 91
            }, this)
        }, void 0, false, {
            fileName: "[project]/veenzent/portfolio/v0_veenzent/components/layout/ContactFooter.tsx",
            lineNumber: 51,
            columnNumber: 10
        }, this);
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    return t6;
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
    if ($[0] !== "da9ef8dd8b61c52b4d52a121d007872079ad22c1af0888a641c21eb5f6021605") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "da9ef8dd8b61c52b4d52a121d007872079ad22c1af0888a641c21eb5f6021605";
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
            className: "flex flex-col",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Projects$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Projects.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Notes$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/Notes.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/pageSections/AboutSection.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/veenzent/portfolio/v0_veenzent/components/layout/Layout.tsx [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function Home() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "acaed88d4861652086201bd03ff7022f9d6bbec6d4a243f819e176f4c97ee40b") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "acaed88d4861652086201bd03ff7022f9d6bbec6d4a243f819e176f4c97ee40b";
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Projects$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                        lineNumber: 26,
                        columnNumber: 101
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$Notes$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                        lineNumber: 26,
                        columnNumber: 113
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$node_modules$2f2e$pnpm$2f$react$40$19$2e$2$2e$3$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$veenzent$2f$portfolio$2f$v0_veenzent$2f$components$2f$pageSections$2f$AboutSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/veenzent/portfolio/v0_veenzent/pages/index.tsx",
                        lineNumber: 26,
                        columnNumber: 122
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c92780a9._.js.map