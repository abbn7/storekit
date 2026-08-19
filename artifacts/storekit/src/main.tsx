import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Build marker: keeps browser/proxy caches from reusing a previous storefront bundle.
document.documentElement.dataset.storekitBuild = "restore-2026-08-20";

createRoot(document.getElementById("root")!).render(<App />);
