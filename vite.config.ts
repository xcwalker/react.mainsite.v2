import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  const env = loadEnv(mode, process.cwd(), "");

  if (env.VITE_BUILD_DATE === JSON.stringify(new Date().toISOString())) {
    return {
      define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(
          ((env.VITE_APP_VERSION ? env.VITE_APP_VERSION : 0) as number) + 1
        ),
      },
      plugins: [react(), tsconfigPaths()],
    };
  } else {
    return {
      define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(0),
        "import.meta.env.VITE_BUILD_DATE": JSON.stringify(
          new Date().toISOString()
        ),
      },
      plugins: [react(), tsconfigPaths()],
    };
  }
});
