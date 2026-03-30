import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crosshair, Filter, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category, type HeadshotTip, useTips } from "../hooks/useQueries";

const categoryConfig = {
  [Category.technique]: {
    label: "Technique",
    icon: <Crosshair className="w-5 h-5" />,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.3)",
  },
  [Category.movement]: {
    label: "Movement",
    icon: <Zap className="w-5 h-5" />,
    color: "#FF8A2A",
    bg: "rgba(255,138,42,0.12)",
    border: "rgba(255,138,42,0.3)",
  },
  [Category.settings]: {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.3)",
  },
};

function TipCard({ tip, idx }: { tip: HeadshotTip; idx: number }) {
  const conf = categoryConfig[tip.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      whileHover={{ y: -4 }}
      className="card-gaming rounded-xl p-6 flex flex-col"
      data-ocid={`tips.item.${idx + 1}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: conf.bg, border: `1px solid ${conf.border}` }}
        >
          <span style={{ color: conf.color }}>{conf.icon}</span>
        </div>
        <span
          className="text-xs font-display font-bold uppercase px-2.5 py-1 rounded tracking-wider"
          style={{
            background: conf.bg,
            color: conf.color,
            border: `1px solid ${conf.border}`,
          }}
        >
          {conf.label}
        </span>
      </div>
      <h3 className="font-display font-bold uppercase text-foreground tracking-wide mb-2">
        {tip.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {tip.description}
      </p>
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Order #{Number(tip.displayOrder)}
        </span>
      </div>
    </motion.div>
  );
}

type FilterType = "all" | Category;

export default function HeadshotTipsPage() {
  const { data: tips, isLoading } = useTips();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all"
      ? (tips ?? [])
      : (tips ?? []).filter((t) => t.category === filter);

  const sorted = [...filtered].sort(
    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
  );

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page hero */}
      <div
        className="relative py-12 mb-12 border-b border-border"
        style={{
          background:
            "linear-gradient(to right, rgba(168,85,247,0.06) 0%, transparent 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-label flex items-center gap-2">
              <Crosshair className="w-3 h-3" /> Techniques
            </p>
            <h1 className="section-title mb-2">HEADSHOT TIPS</h1>
            <p className="text-muted-foreground max-w-xl">
              Battle-tested techniques from top players. Master movement, aim,
              and settings for consistent headshots.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div
          className="flex items-center gap-3 mb-8 flex-wrap"
          data-ocid="tips.filter.tab"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(["all", ...Object.values(Category)] as FilterType[]).map((cat) => {
            const active = filter === cat;
            const conf = cat !== "all" ? categoryConfig[cat] : null;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setFilter(cat)}
                data-ocid={`tips.${cat}.tab`}
                className="px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all"
                style={{
                  background: active
                    ? conf
                      ? conf.bg
                      : "rgba(255,138,42,0.15)"
                    : "transparent",
                  border: `1px solid ${active ? (conf ? conf.border : "rgba(255,138,42,0.4)") : "rgba(255,255,255,0.1)"}`,
                  color: active
                    ? conf
                      ? conf.color
                      : "oklch(var(--fire-orange))"
                    : "oklch(var(--muted-foreground))",
                }}
              >
                {cat === "all" ? "All Tips" : cat}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-muted-foreground">
            {sorted.length} tip{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="tips.loading_state"
          >
            {Array.from({ length: 6 }, (_, i) => i).map((i) => (
              <Skeleton
                key={`skel-${i}`}
                className="h-52 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((tip, i) => (
              <TipCard key={String(tip.id)} tip={tip} idx={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20"
            data-ocid="tips.empty_state"
            style={{
              background: "rgba(255,138,42,0.03)",
              borderRadius: "1rem",
              border: "1px dashed rgba(255,138,42,0.2)",
            }}
          >
            <Crosshair className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="font-display font-bold uppercase text-muted-foreground tracking-wider">
              No tips found
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              {filter !== "all"
                ? "Try a different category filter"
                : "Tips will appear here once added."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
