import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bgImageUrl");
    if (stored) setBgUrl(stored);

    const handler = (e: StorageEvent) => {
      if (e.key === "bgImageUrl") setBgUrl(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {bgUrl && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for readability */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(8,10,13,0.75)" }}
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
