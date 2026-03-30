import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import BundlesPage from "./pages/BundlesPage";
import HeadshotTipsPage from "./pages/HeadshotTipsPage";
import LandingPage from "./pages/LandingPage";
import SensitivityPage from "./pages/SensitivityPage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors theme="dark" />
    </QueryClientProvider>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: LandingPage,
});

const sensitivityRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/sensitivity",
  component: SensitivityPage,
});

const headshotRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/headshot-tips",
  component: HeadshotTipsPage,
});

const bundlesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bundles",
  component: BundlesPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    sensitivityRoute,
    headshotRoute,
    bundlesRoute,
  ]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
