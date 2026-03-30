import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Crosshair,
  Edit2,
  Image,
  Loader2,
  Lock,
  LogOut,
  Package,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createActorWithConfig } from "../config";
import {
  type Bundle,
  Category,
  type HeadshotTip,
  Rarity,
  type Sensitivity,
  useAddBundle,
  useAddSensitivity,
  useAddTip,
  useBundles,
  useDeleteBundle,
  useDeleteSensitivity,
  useDeleteTip,
  useSensitivities,
  useStats,
  useTips,
  useUpdateBundle,
  useUpdateSensitivity,
  useUpdateTip,
} from "../hooks/useQueries";
import { uploadImage } from "../hooks/useStorageClient";

function InputField({
  label,
  id,
  ...props
}: {
  label: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block"
      >
        {label}
      </Label>
      <Input
        id={id}
        {...props}
        className="bg-surface-2 border-border text-foreground focus:border-fire-orange focus:ring-fire-orange/30"
      />
    </div>
  );
}

function ImageUploadField({
  value,
  onChange,
  label = "Bundle Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, (pct) => setProgress(pct));
      onChange(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="bg-surface-2 border-border text-foreground focus:border-fire-orange focus:ring-fire-orange/30 flex-1"
        />
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-fire-orange/40 text-fire-orange hover:bg-fire-orange/10 transition-all text-xs font-display font-bold uppercase tracking-wider shrink-0 disabled:opacity-50"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-ocid="admin.bundle.upload_button"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <Upload className="w-3 h-3" />
              Upload
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          data-ocid="admin.bundle.dropzone"
        />
      </div>
      {value && (
        <div className="mt-2 rounded overflow-hidden" style={{ maxHeight: 80 }}>
          <img
            src={value}
            alt="Preview"
            className="h-20 object-cover rounded border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const actor = await createActorWithConfig();
      const ok = await actor.checkAdminPassword(pw);
      if (ok) {
        toast.success("Access granted!");
        onLogin();
      } else {
        setError("Incorrect password. Access denied.");
        toast.error("Incorrect password");
      }
    } catch {
      setError("Failed to verify password.");
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #080a0d 0%, #0b0d10 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(20,24,33,0.95)",
            border: "1px solid rgba(255,138,42,0.25)",
            boxShadow: "0 0 40px rgba(255,138,42,0.08)",
          }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(255,138,42,0.12)",
                border: "1px solid rgba(255,138,42,0.35)",
              }}
            >
              <Lock className="w-8 h-8 text-fire-orange" />
            </div>
            <h1 className="font-display font-bold uppercase text-foreground text-xl tracking-wider">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              OBB Panel 225 — Restricted Area
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="password"
                className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="bg-surface-2 border-border text-foreground focus:border-fire-orange"
                data-ocid="admin.input"
              />
            </div>

            {error && (
              <p
                className="text-destructive text-sm"
                data-ocid="admin.error_state"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !pw}
              className="btn-fire w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="admin.submit_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {loading ? "VERIFYING..." : "ACCESS PANEL"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function BundleManager() {
  const { data: bundles, isLoading } = useBundles();
  const addBundle = useAddBundle();
  const updateBundle = useUpdateBundle();
  const deleteBundle = useDeleteBundle();

  const [editing, setEditing] = useState<Bundle | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    rarity: Rarity.common,
  });

  const resetForm = () =>
    setForm({ name: "", description: "", imageUrl: "", rarity: Rarity.common });

  const handleEdit = (b: Bundle) => {
    setEditing(b);
    setForm({
      name: b.name,
      description: b.description,
      imageUrl: b.imageUrl,
      rarity: b.rarity,
    });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateBundle.mutateAsync({ id: editing.id, ...form });
        toast.success("Bundle updated!");
        setEditing(null);
      } else {
        await addBundle.mutateAsync(form);
        toast.success("Bundle added!");
      }
      resetForm();
    } catch {
      toast.error("Failed to save bundle");
    }
  };

  const isSaving = addBundle.isPending || updateBundle.isPending;

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(255,138,42,0.04)",
          border: "1px solid rgba(255,138,42,0.15)",
        }}
      >
        <h3 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-4">
          {editing ? "EDIT BUNDLE" : "ADD NEW BUNDLE"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField
            label="Name"
            id="b-name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Bundle name"
            data-ocid="admin.bundle.input"
          />
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Bundle Image"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Bundle description..."
              className="bg-surface-2 border-border text-foreground focus:border-fire-orange resize-none"
              rows={2}
              data-ocid="admin.bundle.textarea"
            />
          </div>
          <div>
            <Label className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Rarity
            </Label>
            <Select
              value={form.rarity}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, rarity: v as Rarity }))
              }
            >
              <SelectTrigger
                className="bg-surface-2 border-border text-foreground"
                data-ocid="admin.bundle.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.values(Rarity).map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="text-foreground capitalize"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-fire flex items-center gap-2 text-sm"
            onClick={handleSave}
            disabled={isSaving || !form.name}
            data-ocid="admin.bundle.save_button"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editing ? "UPDATE" : "ADD BUNDLE"}
          </button>
          {editing && (
            <button
              type="button"
              className="px-4 py-2 rounded text-sm font-display font-bold uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground transition-all"
              onClick={() => {
                setEditing(null);
                resetForm();
              }}
              data-ocid="admin.bundle.cancel_button"
            >
              CANCEL
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (bundles ?? []).length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-ocid="admin.bundle.empty_state"
          >
            No bundles yet. Add one above.
          </p>
        ) : (
          (bundles ?? []).map((b, i) => (
            <div
              key={String(b.id)}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(20,24,33,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              data-ocid={`admin.bundle.item.${i + 1}`}
            >
              <div className="flex items-center gap-3">
                {b.imageUrl && (
                  <img
                    src={b.imageUrl}
                    alt={b.name}
                    className="w-10 h-10 rounded object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div>
                  <span className="font-display font-bold text-foreground uppercase text-sm">
                    {b.name}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">
                    ({b.rarity})
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 rounded hover:bg-fire-orange/10 text-muted-foreground hover:text-fire-orange transition-all"
                  onClick={() => handleEdit(b)}
                  data-ocid={`admin.bundle.edit_button.${i + 1}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  onClick={() =>
                    deleteBundle
                      .mutateAsync(b.id)
                      .then(() => toast.success("Deleted"))
                      .catch(() => toast.error("Failed"))
                  }
                  data-ocid={`admin.bundle.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BackgroundManager() {
  const [bgUrl, setBgUrl] = useState<string>(
    () => localStorage.getItem("bgImageUrl") ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, (pct) => setProgress(pct));
      localStorage.setItem("bgImageUrl", url);
      setBgUrl(url);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "bgImageUrl", newValue: url }),
      );
      toast.success("Background image updated!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    localStorage.removeItem("bgImageUrl");
    setBgUrl("");
    window.dispatchEvent(
      new StorageEvent("storage", { key: "bgImageUrl", newValue: null }),
    );
    toast.success("Background removed");
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(255,138,42,0.04)",
          border: "1px solid rgba(255,138,42,0.15)",
        }}
      >
        <h3 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-4">
          APP BACKGROUND IMAGE
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          Upload an image to set as the global background for the entire app.
          The image will be displayed with a dark overlay to keep content
          readable.
        </p>

        <div className="flex flex-wrap gap-3 mb-5">
          <button
            type="button"
            className="btn-fire flex items-center gap-2 text-sm disabled:opacity-50"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            data-ocid="admin.bg.upload_button"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {progress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Background
              </>
            )}
          </button>

          {bgUrl && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-display font-bold uppercase tracking-wider border border-destructive/40 text-destructive hover:bg-destructive/10 transition-all"
              onClick={handleRemove}
              data-ocid="admin.bg.delete_button"
            >
              <X className="w-4 h-4" />
              Remove Background
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            data-ocid="admin.bg.dropzone"
          />
        </div>

        {bgUrl ? (
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ height: 200 }}
          >
            <img
              src={bgUrl}
              alt="Current background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "rgba(8,10,13,0.5)" }}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-display font-bold uppercase tracking-wider">
              <Image className="w-4 h-4" />
              Current Background
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl flex flex-col items-center justify-center text-muted-foreground"
            style={{
              height: 120,
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,138,42,0.2)",
            }}
            data-ocid="admin.bg.empty_state"
          >
            <Image className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No background image set</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SensitivityManager() {
  const { data: sensitivities, isLoading } = useSensitivities();
  const addSens = useAddSensitivity();
  const updateSens = useUpdateSensitivity();
  const deleteSens = useDeleteSensitivity();

  const defaultForm = {
    deviceLabel: "",
    general: "",
    redDot: "",
    scope2x: "",
    scope4x: "",
    awmScope: "",
    gyroscope: "",
  };
  const [editing, setEditing] = useState<Sensitivity | null>(null);
  const [form, setForm] = useState(defaultForm);

  const handleEdit = (s: Sensitivity) => {
    setEditing(s);
    setForm({
      deviceLabel: s.deviceLabel,
      general: String(Number(s.general)),
      redDot: String(Number(s.redDot)),
      scope2x: String(Number(s.scope2x)),
      scope4x: String(Number(s.scope4x)),
      awmScope: String(Number(s.awmScope)),
      gyroscope: String(Number(s.gyroscope)),
    });
  };

  const handleSave = async () => {
    try {
      const vals = {
        deviceLabel: form.deviceLabel,
        general: BigInt(form.general || 0),
        redDot: BigInt(form.redDot || 0),
        scope2x: BigInt(form.scope2x || 0),
        scope4x: BigInt(form.scope4x || 0),
        awmScope: BigInt(form.awmScope || 0),
        gyroscope: BigInt(form.gyroscope || 0),
      };
      if (editing) {
        await updateSens.mutateAsync({ id: editing.id, ...vals });
        toast.success("Settings updated!");
        setEditing(null);
      } else {
        await addSens.mutateAsync(vals);
        toast.success("Settings added!");
      }
      setForm(defaultForm);
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const isSaving = addSens.isPending || updateSens.isPending;
  const numFields = [
    { key: "general" as const, label: "General" },
    { key: "redDot" as const, label: "Red Dot" },
    { key: "scope2x" as const, label: "2x Scope" },
    { key: "scope4x" as const, label: "4x Scope" },
    { key: "awmScope" as const, label: "AWM Scope" },
    { key: "gyroscope" as const, label: "Gyroscope" },
  ];

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(255,138,42,0.04)",
          border: "1px solid rgba(255,138,42,0.15)",
        }}
      >
        <h3 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-4">
          {editing ? "EDIT SENSITIVITY" : "ADD SENSITIVITY PROFILE"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="sm:col-span-2 lg:col-span-4">
            <InputField
              label="Device Label"
              id="s-device"
              value={form.deviceLabel}
              onChange={(e) =>
                setForm((p) => ({ ...p, deviceLabel: e.target.value }))
              }
              placeholder="e.g. Samsung S24 Ultra"
              data-ocid="admin.sensitivity.input"
            />
          </div>
          {numFields.map((f) => (
            <InputField
              key={f.key}
              label={f.label}
              id={`s-${f.key}`}
              type="number"
              min="0"
              max="100"
              value={form[f.key]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [f.key]: e.target.value }))
              }
              placeholder="0-100"
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-fire flex items-center gap-2 text-sm"
            onClick={handleSave}
            disabled={isSaving || !form.deviceLabel}
            data-ocid="admin.sensitivity.save_button"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editing ? "UPDATE" : "ADD PROFILE"}
          </button>
          {editing && (
            <button
              type="button"
              className="px-4 py-2 rounded text-sm font-display font-bold uppercase border border-border text-muted-foreground hover:text-foreground transition-all"
              onClick={() => {
                setEditing(null);
                setForm(defaultForm);
              }}
              data-ocid="admin.sensitivity.cancel_button"
            >
              CANCEL
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (sensitivities ?? []).length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-ocid="admin.sensitivity.empty_state"
          >
            No profiles yet.
          </p>
        ) : (
          (sensitivities ?? []).map((s, i) => (
            <div
              key={String(s.id)}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(20,24,33,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              data-ocid={`admin.sensitivity.item.${i + 1}`}
            >
              <div>
                <span className="font-display font-bold text-foreground uppercase text-sm">
                  {s.deviceLabel}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  Gen:{Number(s.general)} RD:{Number(s.redDot)} 2x:
                  {Number(s.scope2x)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 rounded hover:bg-fire-orange/10 text-muted-foreground hover:text-fire-orange transition-all"
                  onClick={() => handleEdit(s)}
                  data-ocid={`admin.sensitivity.edit_button.${i + 1}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  onClick={() =>
                    deleteSens
                      .mutateAsync(s.id)
                      .then(() => toast.success("Deleted"))
                      .catch(() => toast.error("Failed"))
                  }
                  data-ocid={`admin.sensitivity.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TipsManager() {
  const { data: tips, isLoading } = useTips();
  const addTip = useAddTip();
  const updateTip = useUpdateTip();
  const deleteTip = useDeleteTip();

  const defaultForm = {
    title: "",
    description: "",
    category: Category.technique,
    displayOrder: "1",
  };
  const [editing, setEditing] = useState<HeadshotTip | null>(null);
  const [form, setForm] = useState(defaultForm);

  const handleEdit = (t: HeadshotTip) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description,
      category: t.category,
      displayOrder: String(Number(t.displayOrder)),
    });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateTip.mutateAsync({
          id: editing.id,
          ...form,
          displayOrder: BigInt(form.displayOrder || 1),
        });
        toast.success("Tip updated!");
        setEditing(null);
      } else {
        await addTip.mutateAsync({
          ...form,
          displayOrder: BigInt(form.displayOrder || 1),
        });
        toast.success("Tip added!");
      }
      setForm(defaultForm);
    } catch {
      toast.error("Failed to save tip");
    }
  };

  const isSaving = addTip.isPending || updateTip.isPending;

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(255,138,42,0.04)",
          border: "1px solid rgba(255,138,42,0.15)",
        }}
      >
        <h3 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-4">
          {editing ? "EDIT TIP" : "ADD NEW TIP"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField
            label="Title"
            id="t-title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Tip title"
            data-ocid="admin.tip.input"
          />
          <InputField
            label="Display Order"
            id="t-order"
            type="number"
            min="1"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((p) => ({ ...p, displayOrder: e.target.value }))
            }
          />
          <div className="sm:col-span-2">
            <Label className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Tip description..."
              className="bg-surface-2 border-border text-foreground focus:border-fire-orange resize-none"
              rows={3}
              data-ocid="admin.tip.textarea"
            />
          </div>
          <div>
            <Label className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Category
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, category: v as Category }))
              }
            >
              <SelectTrigger
                className="bg-surface-2 border-border text-foreground"
                data-ocid="admin.tip.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.values(Category).map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="text-foreground capitalize"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-fire flex items-center gap-2 text-sm"
            onClick={handleSave}
            disabled={isSaving || !form.title}
            data-ocid="admin.tip.save_button"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editing ? "UPDATE" : "ADD TIP"}
          </button>
          {editing && (
            <button
              type="button"
              className="px-4 py-2 rounded text-sm font-display font-bold uppercase border border-border text-muted-foreground hover:text-foreground transition-all"
              onClick={() => {
                setEditing(null);
                setForm(defaultForm);
              }}
              data-ocid="admin.tip.cancel_button"
            >
              CANCEL
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (tips ?? []).length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-ocid="admin.tip.empty_state"
          >
            No tips yet.
          </p>
        ) : (
          [...(tips ?? [])]
            .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
            .map((t, i) => (
              <div
                key={String(t.id)}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: "rgba(20,24,33,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-ocid={`admin.tip.item.${i + 1}`}
              >
                <div>
                  <span className="font-display font-bold text-foreground uppercase text-sm">
                    {t.title}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">
                    ({t.category})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-fire-orange/10 text-muted-foreground hover:text-fire-orange transition-all"
                    onClick={() => handleEdit(t)}
                    data-ocid={`admin.tip.edit_button.${i + 1}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    onClick={() =>
                      deleteTip
                        .mutateAsync(t.id)
                        .then(() => toast.success("Deleted"))
                        .catch(() => toast.error("Failed"))
                    }
                    data-ocid={`admin.tip.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: stats } = useStats();

  const statCards = [
    {
      label: "Bundles",
      val: stats ? Number(stats.bundleCount) : 0,
      icon: <Package className="w-6 h-6" />,
      color: "#F97316",
    },
    {
      label: "Sensitivity Profiles",
      val: stats ? Number(stats.sensitivityCount) : 0,
      icon: <Settings className="w-6 h-6" />,
      color: "#FF8A2A",
    },
    {
      label: "Headshot Tips",
      val: stats ? Number(stats.tipCount) : 0,
      icon: <Crosshair className="w-6 h-6" />,
      color: "#A855F7",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #080a0d 0%, #0b0d10 100%)",
      }}
    >
      <header
        className="border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-40"
        style={{
          background: "rgba(11,13,16,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-fire-orange" />
          <span className="font-display font-bold uppercase tracking-wider text-foreground">
            OBB PANEL <span className="text-fire-orange">225</span>
            <span className="text-muted-foreground text-xs ml-2">— Admin</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-fire-orange/50 text-sm font-display font-bold uppercase tracking-wider transition-all"
          data-ocid="admin.logout_button"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{
                background: "rgba(20,24,33,0.9)",
                border: `1px solid ${s.color}30`,
              }}
              data-ocid="admin.stats.card"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}35`,
                }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-foreground">
                  {s.val}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="bundles" data-ocid="admin.tabs">
          <TabsList className="bg-surface border border-border mb-6 w-full sm:w-auto">
            <TabsTrigger
              value="bundles"
              className="font-display font-bold uppercase tracking-wider text-xs data-[state=active]:bg-fire-orange/20 data-[state=active]:text-fire-orange"
              data-ocid="admin.bundles.tab"
            >
              <Package className="w-4 h-4 mr-1" />
              Bundles
            </TabsTrigger>
            <TabsTrigger
              value="sensitivity"
              className="font-display font-bold uppercase tracking-wider text-xs data-[state=active]:bg-fire-orange/20 data-[state=active]:text-fire-orange"
              data-ocid="admin.sensitivity.tab"
            >
              <Settings className="w-4 h-4 mr-1" />
              Sensitivity
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="font-display font-bold uppercase tracking-wider text-xs data-[state=active]:bg-fire-orange/20 data-[state=active]:text-fire-orange"
              data-ocid="admin.tips.tab"
            >
              <Crosshair className="w-4 h-4 mr-1" />
              Tips
            </TabsTrigger>
            <TabsTrigger
              value="background"
              className="font-display font-bold uppercase tracking-wider text-xs data-[state=active]:bg-fire-orange/20 data-[state=active]:text-fire-orange"
              data-ocid="admin.background.tab"
            >
              <Image className="w-4 h-4 mr-1" />
              Background
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bundles" data-ocid="admin.bundles.panel">
            <BundleManager />
          </TabsContent>
          <TabsContent value="sensitivity" data-ocid="admin.sensitivity.panel">
            <SensitivityManager />
          </TabsContent>
          <TabsContent value="tips" data-ocid="admin.tips.panel">
            <TipsManager />
          </TabsContent>
          <TabsContent value="background" data-ocid="admin.background.panel">
            <BackgroundManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  return (
    <>
      <Toaster richColors theme="dark" />
      {authed ? (
        <AdminDashboard onLogout={() => setAuthed(false)} />
      ) : (
        <LoginScreen onLogin={() => setAuthed(true)} />
      )}
    </>
  );
}
