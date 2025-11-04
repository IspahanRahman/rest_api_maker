"use client";

import { useState } from "react";
import UserNavbar from "@/components/core-panel/public-panel/layouts/PublicNavbar";

import { ReactNode } from "react";

export default function PublicPanelLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr] bg-surface text-foreground">
      <UserNavbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="h-full px-4">
        <div className="h-full grid place-items-center">{children}</div>
      </main>
    </div>
  );
}
