import baseCSS from "../../styles/components/banners/banner.module.css";
import css from "../../styles/components/banners/lgbtqPrideBanner.module.css";

export default function LgbtqPride() {
  const isJuly = new Date().getMonth() === 6;

  if (!isJuly && import.meta.env.VITE_IS_DEBUG_ALL_BANNERS !== "true") {
    return <></>;
  }

  return (
    <div
      className={baseCSS.banner + " " + css.lgbtqPrideBanner}
      style={{ "--_banner-color": "transparent" } as React.CSSProperties}
    >
      <span className={css.text}>Celebrating Pride Month</span>
    </div>
  );
}
