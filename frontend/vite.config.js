import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path"; // Import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: "0.0.0.0", // Accept connections from all network interfaces
    port: 5173, // You can change this port if needed
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias for the src directory
    },
  },
});
