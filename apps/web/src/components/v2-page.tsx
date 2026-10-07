"use client";
import dynamic from "next/dynamic";
// The approved V2 SPA is browser-only; Next keeps all server APIs, Prisma and auth.
const DesignApp = dynamic(() => import("@v2/App"), { ssr: false });
export default function V2Page() { return <DesignApp />; }
