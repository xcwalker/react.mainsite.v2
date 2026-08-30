import baseCSS from "../../styles/components/banners/banner.module.css";
import css from "../../styles/components/banners/transPrideBanner.module.css";

export default function TransPride() {
  const isJuly = new Date().getMonth() === 5;

  if (!isJuly && import.meta.env.VITE_IS_DEBUG_ALL_BANNERS !== "true") {
    return <></>;
  }

  return (
    <div
      className={baseCSS.banner + " " + css.transPrideBanner}
      style={{ "--_banner-color": "transparent" } as React.CSSProperties}
    >
      <span className={css.text}>Supporting Trans Pride</span>
    </div>
  );
}
