import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer
      className="border-t border-border mt-20"
      style={{
        background:
          "linear-gradient(to top, rgba(8,10,13,1), rgba(11,13,16,0.95))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-fire-orange" />
              <span className="font-display font-bold text-foreground uppercase tracking-wider">
                OBB PANEL <span className="text-fire-orange">225</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The ultimate Free Fire gaming utility. Master your sensitivity
              settings, perfect your headshots, and unlock exclusive bundles.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Sensitivity Settings", to: "/sensitivity" },
                { label: "Headshot Tips", to: "/headshot-tips" },
                { label: "Bundle Showcase", to: "/bundles" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground hover:text-fire-orange text-sm transition-colors"
                    data-ocid="footer.link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase text-fire-orange text-sm tracking-wider mb-3">
              Panel
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-fire-orange text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            &copy; {year} OBB Panel 225. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fire-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
