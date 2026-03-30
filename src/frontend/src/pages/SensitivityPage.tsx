import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Settings, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Sensitivity, useSensitivities } from "../hooks/useQueries";

function ValueBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="text-fire-orange font-display font-bold">{value}</span>
      </div>
      <div className="value-bar-track">
        <div
          className="value-bar-fill"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function SensCard({ sens, idx }: { sens: Sensitivity; idx: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Device: ${sens.deviceLabel}
General: ${Number(sens.general)}
Red Dot: ${Number(sens.redDot)}
2x Scope: ${Number(sens.scope2x)}
4x Scope: ${Number(sens.scope4x)}
AWM Scope: ${Number(sens.awmScope)}
Gyroscope: ${Number(sens.gyroscope)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Settings copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="card-gaming rounded-xl p-6"
      data-ocid={`sensitivity.item.${idx + 1}`}
      style={{ border: "1px solid rgba(255,138,42,0.2)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(255,138,42,0.12)",
              border: "1px solid rgba(255,138,42,0.3)",
            }}
          >
            <Settings className="w-5 h-5 text-fire-orange" />
          </div>
          <div>
            <h3 className="font-display font-bold uppercase text-foreground tracking-wide">
              {sens.deviceLabel}
            </h3>
            <p className="text-xs text-muted-foreground">Sensitivity Profile</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          data-ocid={`sensitivity.copy_button.${idx + 1}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-display font-bold uppercase tracking-wider transition-all"
          style={{
            background: copied
              ? "rgba(34,197,94,0.15)"
              : "rgba(255,138,42,0.12)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,138,42,0.35)"}`,
            color: copied ? "#22C55E" : "oklch(var(--fire-orange))",
          }}
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <ValueBar label="General" value={Number(sens.general)} />
        <ValueBar label="Red Dot" value={Number(sens.redDot)} />
        <ValueBar label="2x Scope" value={Number(sens.scope2x)} />
        <ValueBar label="4x Scope" value={Number(sens.scope4x)} />
        <ValueBar label="AWM Scope" value={Number(sens.awmScope)} />
        <ValueBar label="Gyroscope" value={Number(sens.gyroscope)} />
      </div>

      {/* Values summary */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: "GEN", val: Number(sens.general) },
          { label: "DOT", val: Number(sens.redDot) },
          { label: "2X", val: Number(sens.scope2x) },
          { label: "4X", val: Number(sens.scope4x) },
          { label: "AWM", val: Number(sens.awmScope) },
          { label: "GYRO", val: Number(sens.gyroscope) },
        ].map((v) => (
          <div key={v.label} className="text-center">
            <div className="text-xs text-muted-foreground mb-0.5">
              {v.label}
            </div>
            <div className="font-display font-bold text-fire-orange text-sm">
              {v.val}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SensitivityPage() {
  const { data: sensitivities, isLoading } = useSensitivities();

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page hero */}
      <div
        className="relative py-12 mb-12 border-b border-border"
        style={{
          background:
            "linear-gradient(to right, rgba(255,106,0,0.08) 0%, transparent 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-label flex items-center gap-2">
              <Settings className="w-3 h-3" /> Configuration
            </p>
            <h1 className="section-title mb-2">SENSITIVITY SETTINGS</h1>
            <p className="text-muted-foreground max-w-xl">
              Pro-tuned sensitivity profiles for all devices. Copy any profile
              with a single tap and dominate your opponents.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tips banner */}
        <div
          className="rounded-xl p-4 mb-10 flex items-start gap-3"
          style={{
            background: "rgba(255,138,42,0.07)",
            border: "1px solid rgba(255,138,42,0.2)",
          }}
        >
          <Trophy className="w-5 h-5 text-fire-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-display font-bold text-fire-amber uppercase tracking-wider mb-0.5">
              Pro Tip
            </p>
            <p className="text-sm text-muted-foreground">
              Hit "COPY" on any profile, then paste the values into Free Fire
              Settings → Sensitivity. Apply the gyroscope settings for maximum
              aim control.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            data-ocid="sensitivity.loading_state"
          >
            {Array.from({ length: 4 }, (_, i) => i).map((i) => (
              <Skeleton
                key={`skel-${i}`}
                className="h-64 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : sensitivities && sensitivities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sensitivities.map((s, i) => (
              <SensCard key={String(s.id)} sens={s} idx={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20"
            data-ocid="sensitivity.empty_state"
            style={{
              background: "rgba(255,138,42,0.03)",
              borderRadius: "1rem",
              border: "1px dashed rgba(255,138,42,0.2)",
            }}
          >
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="font-display font-bold uppercase text-muted-foreground tracking-wider">
              No sensitivity profiles yet
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Profiles will appear here once an admin adds them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
