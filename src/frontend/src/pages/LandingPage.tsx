import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  ChevronRight,
  Crosshair,
  Flame,
  Loader2,
  Package,
  Settings,
  Shield,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  type Bundle,
  Category,
  Rarity,
  useBundles,
  useSensitivities,
  useTips,
} from "../hooks/useQueries";
import { uploadImage } from "../hooks/useStorageClient";

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

function EmberParticles() {
  const embers = [
    { id: 0, left: "8%", size: 5, delay: 0, duration: 3 },
    { id: 1, left: "15%", size: 4, delay: 1, duration: 4 },
    { id: 2, left: "22%", size: 7, delay: 0.5, duration: 2.5 },
    { id: 3, left: "30%", size: 3, delay: 2, duration: 3.5 },
    { id: 4, left: "38%", size: 5, delay: 0.8, duration: 4 },
    { id: 5, left: "45%", size: 6, delay: 1.5, duration: 3 },
    { id: 6, left: "52%", size: 4, delay: 0.3, duration: 2.8 },
    { id: 7, left: "60%", size: 5, delay: 1.8, duration: 3.2 },
    { id: 8, left: "68%", size: 8, delay: 0.6, duration: 4.5 },
    { id: 9, left: "75%", size: 3, delay: 2.2, duration: 3 },
    { id: 10, left: "82%", size: 5, delay: 0.9, duration: 2.5 },
    { id: 11, left: "90%", size: 6, delay: 1.3, duration: 3.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute ember"
          style={{
            left: e.left,
            bottom: "-10px",
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationName: "ember-rise",
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-out",
          }}
        />
      ))}
    </div>
  );
}

const rarityColor = (r: Rarity) => {
  switch (r) {
    case Rarity.legendary:
      return "#F97316";
    case Rarity.epic:
      return "#A855F7";
    case Rarity.rare:
      return "#3B82F6";
    default:
      return "#9CA3AF";
  }
};

const rarityBg = (r: Rarity) => {
  switch (r) {
    case Rarity.legendary:
      return "rgba(249,115,22,0.15)";
    case Rarity.epic:
      return "rgba(168,85,247,0.15)";
    case Rarity.rare:
      return "rgba(59,130,246,0.15)";
    default:
      return "rgba(156,163,175,0.15)";
  }
};

function ProfileAvatar() {
  const [profileUrl, setProfileUrl] = useState<string | null>(() =>
    localStorage.getItem("profilePicUrl"),
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, (pct) => setProgress(pct));
      localStorage.setItem("profilePicUrl", url);
      setProfileUrl(url);
    } catch (err) {
      console.error("Profile upload failed", err);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="relative group">
        <button
          type="button"
          className="w-20 h-20 rounded-full overflow-hidden relative flex items-center justify-center cursor-pointer transition-all"
          style={{
            border: "2px solid rgba(255,138,42,0.5)",
            background: "rgba(20,24,33,0.9)",
            boxShadow: "0 0 20px rgba(255,138,42,0.2)",
          }}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-ocid="profile.upload_button"
          title="Click to change profile picture"
        >
          {profileUrl ? (
            <img
              src={profileUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-fire-orange" />
          )}

          {/* Hover overlay */}
          {!uploading && (
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <Camera className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Upload progress overlay */}
          {uploading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full"
              style={{ background: "rgba(0,0,0,0.75)" }}
            >
              <Loader2 className="w-5 h-5 text-fire-orange animate-spin" />
              <span className="text-white text-[10px] mt-1 font-bold">
                {progress}%
              </span>
            </div>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          data-ocid="profile.dropzone"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {uploading ? `Uploading... ${progress}%` : "Tap to set profile photo"}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const { data: bundles, isLoading: bundlesLoading } = useBundles();
  const { data: sensitivities, isLoading: sensLoading } = useSensitivities();
  const { data: tips, isLoading: tipsLoading } = useTips();

  const featuredBundles = bundles ?? [];
  const featuredSens = (sensitivities ?? []).slice(0, 3);
  const featuredTips = (tips ?? []).slice(0, 4);

  const categoryIcon = (cat: Category) => {
    switch (cat) {
      case Category.technique:
        return <Crosshair className="w-6 h-6" />;
      case Category.movement:
        return <Zap className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(255,106,0,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,59,47,0.08) 0%, transparent 50%), linear-gradient(135deg, #080a0d 0%, #0b0d10 50%, #101318 100%)",
        }}
      >
        <EmberParticles />
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,138,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,138,42,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Profile Avatar */}
              <ProfileAvatar />

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-fire-orange/30 bg-fire-orange/10 mb-6">
                <Flame className="w-4 h-4 text-fire-orange" />
                <span className="text-xs font-display font-bold uppercase tracking-widest text-fire-orange">
                  Free Fire Gaming Utility
                </span>
              </div>

              <h1
                className="font-display font-bold uppercase text-foreground mb-4 leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5rem)",
                  textShadow: "0 0 40px rgba(255,138,42,0.2)",
                }}
              >
                DOMINATE{" "}
                <span
                  style={{
                    color: "oklch(var(--fire-orange))",
                    textShadow: "0 0 20px rgba(255,138,42,0.5)",
                  }}
                >
                  FREE FIRE
                </span>
              </h1>

              <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                Master your sensitivity settings, perfect headshot techniques,
                and unlock exclusive bundles with OBB Panel 225.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/sensitivity" data-ocid="hero.primary_button">
                  <button
                    type="button"
                    className="btn-fire flex items-center gap-2"
                  >
                    <Crosshair className="w-4 h-4" />
                    GET SETTINGS
                  </button>
                </Link>
                <Link to="/bundles" data-ocid="hero.secondary_button">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 font-display font-bold uppercase tracking-wider text-foreground border border-border rounded hover:border-fire-orange/50 hover:text-fire-orange transition-all duration-200"
                  >
                    <Package className="w-4 h-4" />
                    VIEW BUNDLES
                  </button>
                </Link>
              </div>

              <div className="flex gap-8 mt-10">
                {[
                  {
                    icon: <Settings className="w-4 h-4" />,
                    label: "Sensitivity Profiles",
                    val: sensitivities?.length ?? 0,
                  },
                  {
                    icon: <Crosshair className="w-4 h-4" />,
                    label: "Headshot Tips",
                    val: tips?.length ?? 0,
                  },
                  {
                    icon: <Package className="w-4 h-4" />,
                    label: "Bundles",
                    val: bundles?.length ?? 0,
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center gap-1 text-fire-orange mb-0.5">
                      {s.icon}
                    </div>
                    <div className="font-display font-bold text-2xl text-foreground">
                      {s.val}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center relative"
            >
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,138,42,0.5) 0%, rgba(255,59,47,0.2) 50%, transparent 70%)",
                }}
              />
              <img
                src="/assets/generated/ff-hero-character.dim_600x700.png"
                alt="Free Fire Character"
                className="relative z-10 max-h-[500px] object-contain"
                style={{ filter: "drop-shadow(0 0 40px rgba(255,138,42,0.3))" }}
              />
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #0b0d10)",
          }}
        />
      </section>

      {/* Features strip */}
      <section
        className="py-12 border-y border-border"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,138,42,0.04), transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Crosshair className="w-8 h-8" />,
                title: "HEADSHOT MASTERY",
                desc: "Precision techniques to land consistent headshots in every match",
              },
              {
                icon: <Settings className="w-8 h-8" />,
                title: "PERFECT SENSITIVITY",
                desc: "Device-specific settings for smooth, accurate aiming",
              },
              {
                icon: <Package className="w-8 h-8" />,
                title: "EXCLUSIVE BUNDLES",
                desc: "Browse legendary and epic bundles to complete your style",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-start gap-4 p-5 card-gaming rounded-xl"
              >
                <div
                  className="p-3 rounded-lg shrink-0"
                  style={{
                    background: "rgba(255,138,42,0.1)",
                    border: "1px solid rgba(255,138,42,0.25)",
                  }}
                >
                  <span className="text-fire-orange">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase text-sm tracking-wider text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensitivity Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">⚙ Configuration</p>
              <h2 className="section-title">SENSITIVITY SETTINGS</h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Pro-optimized settings for every device. Copy and apply in
                seconds.
              </p>
            </div>
            <Link
              to="/sensitivity"
              className="hidden sm:flex items-center gap-1 text-fire-orange text-sm font-display font-bold uppercase tracking-wider"
              data-ocid="sensitivity.link"
            >
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sensLoading
              ? Array.from({ length: 3 }, (_, i) => i).map((i) => (
                  <Skeleton
                    key={`skel-${i}`}
                    className="h-48 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                ))
              : featuredSens.map((s) => (
                  <div
                    key={String(s.id)}
                    className="card-gaming p-5 rounded-xl glow-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold uppercase text-foreground tracking-wide">
                        {s.deviceLabel}
                      </h3>
                      <Trophy className="w-4 h-4 text-fire-amber" />
                    </div>
                    {[
                      { label: "General", val: Number(s.general) },
                      { label: "Red Dot", val: Number(s.redDot) },
                      { label: "2x Scope", val: Number(s.scope2x) },
                      { label: "Gyroscope", val: Number(s.gyroscope) },
                    ].map((item) => (
                      <div key={item.label} className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="text-fire-orange font-bold">
                            {item.val}
                          </span>
                        </div>
                        <div className="value-bar-track">
                          <div
                            className="value-bar-fill"
                            style={{ width: `${Math.min(item.val, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            {!sensLoading && featuredSens.length === 0 && (
              <div
                className="col-span-3 text-center text-muted-foreground py-10"
                data-ocid="sensitivity.empty_state"
              >
                No sensitivity settings yet. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Headshot Tips Preview */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,138,42,0.03), transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">🎯 Techniques</p>
              <h2 className="section-title">HEADSHOT TIPS</h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Battle-tested tips to improve your accuracy.
              </p>
            </div>
            <Link
              to="/headshot-tips"
              className="hidden sm:flex items-center gap-1 text-fire-orange text-sm font-display font-bold uppercase tracking-wider"
              data-ocid="tips.link"
            >
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tipsLoading
              ? Array.from({ length: 4 }, (_, i) => i).map((i) => (
                  <Skeleton
                    key={`skel-${i}`}
                    className="h-40 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                ))
              : featuredTips.map((tip) => (
                  <motion.div
                    key={String(tip.id)}
                    whileHover={{ y: -4 }}
                    className="card-gaming p-5 rounded-xl text-center"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{
                        background: "rgba(255,138,42,0.12)",
                        border: "1px solid rgba(255,138,42,0.3)",
                      }}
                    >
                      <span className="text-fire-orange">
                        {categoryIcon(tip.category)}
                      </span>
                    </div>
                    <div
                      className="inline-block text-xs font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2"
                      style={{
                        background:
                          tip.category === Category.technique
                            ? "rgba(168,85,247,0.15)"
                            : tip.category === Category.movement
                              ? "rgba(255,138,42,0.15)"
                              : "rgba(59,130,246,0.15)",
                        color:
                          tip.category === Category.technique
                            ? "#A855F7"
                            : tip.category === Category.movement
                              ? "#FF8A2A"
                              : "#3B82F6",
                      }}
                    >
                      {tip.category}
                    </div>
                    <h3 className="font-display font-bold uppercase text-sm text-foreground mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {tip.description}
                    </p>
                  </motion.div>
                ))}
            {!tipsLoading && featuredTips.length === 0 && (
              <div
                className="col-span-4 text-center text-muted-foreground py-10"
                data-ocid="tips.empty_state"
              >
                No tips yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bundle Showcase - ALL Bundles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">💎 Unlimited Bundles</p>
              <h2 className="section-title">BUNDLE SHOWCASE</h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Discover legendary and epic bundles. Stand out on the
                battlefield.
              </p>
            </div>
            <Link
              to="/bundles"
              className="hidden sm:flex items-center gap-1 text-fire-orange text-sm font-display font-bold uppercase tracking-wider"
              data-ocid="bundles.link"
            >
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundlesLoading
              ? Array.from({ length: 3 }, (_, i) => i).map((i) => (
                  <Skeleton
                    key={`skel-${i}`}
                    className="h-64 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                ))
              : featuredBundles.map((b) => {
                  const imgSrc = getBundleImage(b);
                  return (
                    <motion.div
                      key={String(b.id)}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="card-gaming rounded-xl overflow-hidden"
                    >
                      <div
                        className="h-48 flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, rgba(20,24,33,1) 0%, ${rarityBg(b.rarity)} 100%)`,
                        }}
                      >
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={b.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Shield
                            className="w-24 h-24"
                            style={{
                              color: rarityColor(b.rarity),
                              opacity: 0.5,
                            }}
                          />
                        )}
                        <div
                          className="absolute top-3 right-3 text-xs font-display font-bold uppercase px-2 py-1 rounded"
                          style={{
                            background: rarityBg(b.rarity),
                            color: rarityColor(b.rarity),
                            border: `1px solid ${rarityColor(b.rarity)}40`,
                          }}
                        >
                          {b.rarity}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold uppercase text-foreground mb-1">
                          {b.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {b.description}
                        </p>
                        <Link to="/bundles" data-ocid="bundle.button">
                          <button
                            type="button"
                            className="w-full text-xs font-display font-bold uppercase tracking-wider py-2 rounded border border-fire-orange/40 text-fire-orange hover:bg-fire-orange/10 transition-all"
                          >
                            VIEW DETAILS
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
            {!bundlesLoading && featuredBundles.length === 0 && (
              <div
                className="col-span-3 text-center text-muted-foreground py-10"
                data-ocid="bundles.empty_state"
              >
                No bundles yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-2xl p-10 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,106,0,0.15) 0%, rgba(255,59,47,0.08) 50%, rgba(11,13,16,0.9) 100%)",
              border: "1px solid rgba(255,138,42,0.3)",
              boxShadow: "0 0 40px rgba(255,138,42,0.1)",
            }}
          >
            <EmberParticles />
            <h2
              className="font-display font-bold uppercase text-foreground mb-3"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              START DOMINATING <span className="text-fire-orange">TODAY</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Apply our pro settings and techniques to climb the ranks.
            </p>
            <Link to="/sensitivity" data-ocid="cta.primary_button">
              <button type="button" className="btn-fire">
                GET PRO SETTINGS
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
