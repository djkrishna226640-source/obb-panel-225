import { Link, useLocation } from "@tanstack/react-router";
import { Flame, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { label: "HOME", to: "/" },
  { label: "SENSITIVITY", to: "/sensitivity" },
  { label: "TIPS", to: "/headshot-tips" },
  { label: "BUNDLES", to: "/bundles" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:
          "linear-gradient(to bottom, rgba(11,13,16,0.98), rgba(11,13,16,0.85))",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,138,42,0.15)",
        boxShadow: "0 1px 0 rgba(255,138,42,0.08), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-ocid="nav.link">
          <div className="flex items-center gap-2">
            <Flame
              className="w-6 h-6 text-fire-orange"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,138,42,0.7))" }}
            />
            <span
              className="font-display font-bold text-lg uppercase tracking-wider text-foreground"
              style={{ textShadow: "0 0 10px rgba(255,138,42,0.3)" }}
            >
              OBB PANEL <span className="text-fire-orange">225</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className="px-4 py-2 text-sm font-display font-bold tracking-wider transition-all duration-200 rounded"
                style={{
                  color: active
                    ? "oklch(var(--fire-orange))"
                    : "oklch(var(--muted-foreground))",
                  textShadow: active ? "0 0 10px rgba(255,138,42,0.6)" : "none",
                  background: active ? "rgba(255,138,42,0.08)" : "transparent",
                  borderBottom: active
                    ? "2px solid oklch(var(--fire-orange))"
                    : "2px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
          data-ocid="nav.toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border"
            style={{ background: "rgba(11,13,16,0.98)" }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="nav.link"
                  className="block px-6 py-4 text-sm font-display font-bold tracking-wider border-b border-border transition-all"
                  style={{
                    color: active
                      ? "oklch(var(--fire-orange))"
                      : "oklch(var(--foreground))",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
