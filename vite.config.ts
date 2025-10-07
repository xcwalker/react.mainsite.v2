import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { readFile, writeFile } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  readFile("./version.json", { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const json = JSON.parse(data);

    const prevDate = new Date(json.BUILD_DATE);
    const date = new Date();

    let out;

    if (
      prevDate.getFullYear() === date.getFullYear() &&
      getWeekNumber(prevDate) === getWeekNumber(date)
    ) {
      if (mode === "development") {
        out = {
          APP_VERSION: json.APP_VERSION,
          BUILD_DATE: json.BUILD_DATE,
        };
      } else {
        out = {
          APP_VERSION: json.APP_VERSION + 1,
          BUILD_DATE: json.BUILD_DATE,
        };
      }

      console.log("App Version: " + out.APP_VERSION);
      console.log("Build Date: " + JSON.stringify(out.BUILD_DATE));

      const buildDate = new Date(out.BUILD_DATE);
      console.log(
        buildDate.getFullYear().toString().substr(-2) +
          "W" +
          pad(getWeekNumber(buildDate), 2) +
          (out.APP_VERSION >= 26
            ? alphabet[Math.floor(out.APP_VERSION / 26)]
            : "") +
          alphabet[out.APP_VERSION % alphabet.length]
      );
    } else {
      out = {
        APP_VERSION: 0,
        BUILD_DATE: `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(
          date.getDate(),
          2
        )}`,
      };

      console.log("App Version: " + out.APP_VERSION);
      console.log("Build Date: " + JSON.stringify(out.BUILD_DATE));

      console.log(
        date.getFullYear().toString().substr(-2) +
          "W" +
          pad(getWeekNumber(date), 2) +
          alphabet[out.APP_VERSION % alphabet.length]
      );
    }

    writeFile("./version.json", JSON.stringify(out), "utf-8", (err) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pad(num: any, size: number) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));
