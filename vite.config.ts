import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { readFile, writeFile } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  readFile("./.env." + mode + ".local", { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const prevDate = new Date(env.VITE_BUILD_DATE);
    const date = new Date();

    let out;

    if (
      // JSON.stringify(env.VITE_BUILD_DATE) ===
      // JSON.stringify(new Date().toISOString().split("T", 1)[0])
      prevDate.getFullYear() === date.getFullYear() &&
      getWeekNumber(prevDate) === getWeekNumber(date)
    ) {
      out = data
        .toString()
        .replace(
          "VITE_APP_VERSION=" + env.VITE_APP_VERSION,
          "VITE_APP_VERSION=" + (Number(env.VITE_APP_VERSION) + 1)
        )
        .replace(
          "VITE_BUILD_DATE=" + env.VITE_BUILD_DATE,
          "VITE_BUILD_DATE=" +
            JSON.stringify(new Date().toISOString().split("T", 1)[0])
        );
      console.log("App Version: " + (Number(env.VITE_APP_VERSION) + 1));
      console.log("Build Date: " + env.VITE_BUILD_DATE);
    } else {
      out = data
        .toString()
        .replace(
          "VITE_APP_VERSION=" + env.VITE_APP_VERSION,
          "VITE_APP_VERSION=0"
        )
        .replace(
          "VITE_BUILD_DATE=" + env.VITE_BUILD_DATE,
          "VITE_BUILD_DATE=" +
            JSON.stringify(new Date().toISOString().split("T", 1)[0])
        );
      console.log("App Version: 0");
      console.log(
        "Build Date: " +
          JSON.stringify(new Date().toISOString().split("T", 1)[0])
      );
    }

    writeFile("./.env." + mode + ".local", out, "utf-8", (err) => {
      if (!err) return;
      console.error(err);
    });
  });

  return {
    plugins: [react(), tsconfigPaths()],
  };
});

function getWeekNumber(date: Date) {
  // Copy date so don't modify original
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  // Return week number
  return weekNo;
}