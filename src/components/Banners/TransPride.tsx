import baseCSS from "../../styles/components/banners/banner.module.css";
import css from "../../styles/components/banners/transPrideBanner.module.css";

export default function TransPride() {
  const isJuly = new Date().getMonth() === 6;

  if (!isJuly) {
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
