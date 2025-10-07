import css from "../styles/components/footer.module.css";
import Logo from "./Logo";
import Socials from "./Socials";
import build from "../../version.json";

export default function Footer() {
  const buildDate = new Date(build.BUILD_DATE);

  return (
    <footer className={css.footer}>
      <Socials />
      <div className={css.container}>
        <div className={css.column}>
          <Logo className={css.svg} />
          <span className={css.span}>
            Copyright © 2024 - {buildDate.getFullYear()} XCWalker.
          </span>
          <span className={css.span}>All rights reserved.</span>
        </div>

        <div className={css.column}>
          <span className={css.build}>
            Build {buildDate.getFullYear().toString().substr(-2)}W
            {pad(getWeekNumber(buildDate), 2)}
            {
              build.APP_VERSION >= 26 && alphabet[
                Math.floor((build.APP_VERSION) / 26)
              ]
            }
            {alphabet[build.APP_VERSION % alphabet.length]}
          </span>
        </div>
      </div>
    </footer>
  );
}

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
