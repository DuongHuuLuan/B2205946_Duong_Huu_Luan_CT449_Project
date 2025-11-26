import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
    },
  },

  server: {
    port: 3002,

    proxy: {
      "/api": {
        target: "http://localhost:3000/",
      },
      "/uploads": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
    },
  },
});
