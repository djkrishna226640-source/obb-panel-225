import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Shield, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Bundle, Rarity, useBundles } from "../hooks/useQueries";

const BUNDLE_IMAGE_MAP: Record<string, string> = {
  "Shadow Pack": "/assets/generated/bundle-shadow-pack.dim_400x500.png",
  "Firestorm Bundle": "/assets/generated/bundle-firestorm.dim_400x500.png",
  "Urban Warrior": "/assets/generated/bundle-urban-warrior.dim_400x500.png",
};

function getBundleImage(bundle: Bundle): string | null {
  if (
    bundle.imageUrl.startsWith("http") ||
    bundle.imageUrl.startsWith("/assets/generated")
  ) {
    return bundle.imageUrl;
  }
  return BUNDLE_IMAGE_MAP[bundle.name] ?? null;
}

const rarityConfig = {
  [Rarity.legendary]: {
    label: "Legendary",
    color: "#F97316",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.4)",
    stars: 4,
  },
  [Rarity.epic]: {
    label: "Epic",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.35)",
    stars: 3,
  },
  [Rarity.rare]: {
    label: "Rare",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.35)",
    stars: 2,
  },
  [Rarity.common]: {
    label: "Common",
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.12)",
    border: "rgba(156,163,175,0.3)",
    stars: 1,
  },
};

function BundleCard({
  bundle,
  idx,
  onView,
}: { bundle: Bundle; idx: number; onView: (b: Bundle) => void }) {
  const rc = rarityConfig[bundle.rarity];
  const imgSrc = getBundleImage(bundle);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="card-gaming rounded-xl overflow-hidden cursor-pointer"
      data-ocid={`bundle.item.${idx + 1}`}
      onClick={() => onView(bundle)}
    >
      {/* Bundle image/visual */}
      <div
        className="h-52 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(20,24,33,1) 0%, ${rc.bg} 100%)`,
          borderBottom: `1px solid ${rc.border}`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 70%, ${rc.color}20 0%, transparent 60%)`,
          }}
        />

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={bundle.name}
            className="relative z-10 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Shield
            className="relative z-10 w-28 h-28 opacity-40"
            style={{
              color: rc.color,
              filter: `drop-shadow(0 0 20px ${rc.color}60)`,
            }}
          />
        )}

        {/* Rarity badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider"
          style={{
            background: rc.bg,
            color: rc.color,
            border: `1px solid ${rc.border}`,
          }}
        >
          <Star className="w-3 h-3" />
          {rc.label}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4].slice(0, rc.stars).map((n) => (
            <Star
              key={n}
              className="w-3 h-3 fill-current"
              style={{ color: rc.color }}
            />
          ))}
        </div>
        <h3 className="font-display font-bold uppercase text-foreground tracking-wide mb-1">
          {bundle.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {bundle.description}
        </p>
        <button
          type="button"
          className="w-full py-2 text-xs font-display font-bold uppercase tracking-wider rounded transition-all"
          style={{
            background: rc.bg,
            border: `1px solid ${rc.border}`,
            color: rc.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onView(bundle);
          }}
          data-ocid={`bundle.view_button.${idx + 1}`}
        >
          VIEW DETAILS
        </button>
      </div>
    </motion.div>
  );
}

type FilterType = "all" | Rarity;

export default function BundlesPage() {
  const { data: bundles, isLoading } = useBundles();
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all"
      ? (bundles ?? [])
      : (bundles ?? []).filter((b) => b.rarity === filter);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page hero */}
      <div
        className="relative py-12 mb-12 border-b border-border"
        style={{
          background:
            "linear-gradient(to right, rgba(249,115,22,0.08) 0%, transparent 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-label">💎 Unlimited Bundles</p>
            <h1 className="section-title mb-2">BUNDLE SHOWCASE</h1>
            <p className="text-muted-foreground max-w-xl">
              Explore our full collection of Free Fire bundles. From Common to
              Legendary — find your perfect style.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter */}
        <div
          className="flex items-center gap-3 mb-8 flex-wrap"
          data-ocid="bundles.filter.tab"
        >
          {(["all", ...Object.values(Rarity)] as FilterType[]).map((r) => {
            const active = filter === r;
            const rc = r !== "all" ? rarityConfig[r] : null;
            return (
              <button
                type="button"
                key={r}
                onClick={() => setFilter(r)}
                data-ocid={`bundles.${r}.tab`}
                className="px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all"
                style={{
                  background: active
                    ? rc
                      ? rc.bg
                      : "rgba(255,138,42,0.15)"
                    : "transparent",
                  border: `1px solid ${
                    active
                      ? rc
                        ? rc.border
                        : "rgba(255,138,42,0.4)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  color: active
                    ? rc
                      ? rc.color
                      : "oklch(var(--fire-orange))"
                    : "oklch(var(--muted-foreground))",
                }}
              >
                {r === "all" ? "All Bundles" : r}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} bundle{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="bundles.loading_state"
          >
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <Skeleton
                key={`skel-${i}`}
                className="h-72 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((b, i) => (
              <BundleCard
                key={String(b.id)}
                bundle={b}
                idx={i}
                onView={setSelectedBundle}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20"
            data-ocid="bundles.empty_state"
            style={{
              background: "rgba(255,138,42,0.03)",
              borderRadius: "1rem",
              border: "1px dashed rgba(255,138,42,0.2)",
            }}
          >
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="font-display font-bold uppercase text-muted-foreground tracking-wider">
              No bundles found
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              {filter !== "all"
                ? "Try a different rarity filter"
                : "Bundles will appear here once added."}
            </p>
          </div>
        )}
      </div>

      {/* Bundle detail dialog */}
      <Dialog
        open={!!selectedBundle}
        onOpenChange={(o) => !o && setSelectedBundle(null)}
      >
        <DialogContent
          className="max-w-md border-border"
          style={{
            background: "oklch(var(--card))",
            border: selectedBundle
              ? `1px solid ${rarityConfig[selectedBundle.rarity].border}`
              : undefined,
          }}
          data-ocid="bundle.dialog"
        >
          {selectedBundle &&
            (() => {
              const rc = rarityConfig[selectedBundle.rarity];
              const dialogImg = getBundleImage(selectedBundle);
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="font-display font-bold uppercase text-foreground tracking-wide">
                      {selectedBundle.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div
                    className="h-48 rounded-xl flex items-center justify-center relative overflow-hidden mb-4"
                    style={{
                      background: `linear-gradient(135deg, rgba(20,24,33,1) 0%, ${rc.bg} 100%)`,
                      border: `1px solid ${rc.border}`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle, ${rc.color}15 0%, transparent 70%)`,
                      }}
                    />
                    {dialogImg ? (
                      <img
                        src={dialogImg}
                        alt={selectedBundle.name}
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Shield
                        className="w-24 h-24 opacity-50 relative z-10"
                        style={{ color: rc.color }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider"
                      style={{
                        background: rc.bg,
                        color: rc.color,
                        border: `1px solid ${rc.border}`,
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {rc.label}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].slice(0, rc.stars).map((n) => (
                        <Star
                          key={n}
                          className="w-3 h-3 fill-current"
                          style={{ color: rc.color }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedBundle.description}
                  </p>

                  <button
                    type="button"
                    className="w-full mt-4 py-3 font-display font-bold uppercase tracking-wider rounded transition-all"
                    style={{
                      background: rc.bg,
                      border: `1px solid ${rc.border}`,
                      color: rc.color,
                    }}
                    data-ocid="bundle.close_button"
                    onClick={() => setSelectedBundle(null)}
                  >
                    CLOSE
                  </button>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
