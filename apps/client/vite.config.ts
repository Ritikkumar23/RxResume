/// <reference types='vitest' />

import { lingui } from "@lingui/vite-plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, searchForWorkspaceRoot, splitVendorChunkPlugin } from "vite";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/client",

  build: {
    outDir: "../../dist/apps/client",
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: true,
  },

  define: {
    appVersion: JSON.stringify(process.env.npm_package_version),
  },

  server: {
    host: true,
    port: +(process.env.__DEV__CLIENT_PORT ?? 5173),
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
  },

  plugins: [
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    lingui(),
    nxViteTsPaths(),
    splitVendorChunkPlugin(),
  ],

  test: {
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/apps/client",
      provider: "v8",
    },
    globals: true,
    environment: "jsdom",
    cache: { dir: "../../node_modules/.vitest" },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },

  resolve: {
    alias: {
      "@/client/": `${searchForWorkspaceRoot(process.cwd())}/apps/client/src/`,
    },
  },
});
