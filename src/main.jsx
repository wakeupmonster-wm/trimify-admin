import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom"; // Use react-router-dom
import { Provider } from "react-redux";
import { store, persistor } from "@/app/store/redux.store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./components/core/theme-provider";
import { router } from "@/app/routes/index"; // Import your router config
import AppInitializer from "./app/context/AppInitializer";
import { Toaster } from "@/components/ui/sonner";

// --- Add Global Chunk Load Recovery ---
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  // Automatically reload on chunk load failure.
  // We use sessionStorage to avoid infinite reload loops if the server is truly down.
  const isReloading = sessionStorage.getItem("isChunkLoadReloading");
  if (!isReloading) {
    sessionStorage.setItem("isChunkLoadReloading", "true");
    window.location.reload();
  }
});
// Reset the flag on successful load
sessionStorage.removeItem("isChunkLoadReloading");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          defaultTheme="light"
          storageKey="keen-admin-theme"
          attribute="class"
        >
          {/* The router handles the entire app tree now */}
          <AppInitializer>
            <RouterProvider router={router} />
          </AppInitializer>
          {/* <Toaster position="top-right" /> */}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              unstyled: false,
              classNames: {
                toast:
                  "group toast rounded-xl border-2 p-4 shadow-lg flex items-center gap-3",
                title: "font-bold text-base",
                description: "!text-sm !font-bold !text-grey-800 opacity-90",
                success:
                  "!bg-alerts-bg_success !border-alerts-success !text-alerts-success ",
                error:
                  "!bg-alerts-bg_error !border-alerts-error !text-alerts-error",
                warning:
                  "!bg-alerts-bg_warning !border-alerts-warning !text-alerts-warning",
                info: "!bg-alerts-bg_info !border-alerts-info !text-alerts-info",
              },
            }}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
