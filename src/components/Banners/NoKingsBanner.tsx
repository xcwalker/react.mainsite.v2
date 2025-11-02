import { Link } from "react-router-dom";
import baseCSS from "../../styles/components/banners/banner.module.css";
import css from "../../styles/components/banners/noKingsBanner.module.css";
import { Logos } from "../Logo";

export default function NoKingsBanner() {
  return (
    <Link
      className={baseCSS.banner + " " + css.noKingsBanner}
      style={{ "--_banner-color": "#fec224" } as React.CSSProperties}
      to="https://nokings.org/"
    >
      <img
        src="/No Kings Logo_Horizontal_ForLightBackgrounds.svg"
        alt=""
        className={css.logo}
      />
      <span className={css.text}>Supporting No Kings</span>
      <Logos.xcwalkeruk className={css.logo} />
    </Link>
  );
}
