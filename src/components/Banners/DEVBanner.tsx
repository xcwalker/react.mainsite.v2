import css from "../../styles/components/banners/developmentBanner.module.css";
import baseCSS from "../../styles/components/banners/banner.module.css";

export default function DevBanner() {
  return (
    <>
      {import.meta.env.VITE_IS_DEVELOPMENT_BUILD === "true" && (
        <div
          className={baseCSS.banner + " " + css.developmentBanner}
          style={{ "--banner-color": "#ff8f00" } as React.CSSProperties}
        >
          Development Build
        </div>
      )}
    </>
  );
}
