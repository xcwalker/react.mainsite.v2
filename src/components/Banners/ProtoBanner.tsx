import css from "../../styles/components/banners/protoBanner.module.css";
import baseCSS from "../../styles/components/banners/banner.module.css";

export default function ProtoBanner() {
  return (
    <>
      {(import.meta.env.VITE_IS_PROTO_BUILD === "true" ||
        import.meta.env.VITE_IS_DEBUG_ALL_BANNERS === "true") && (
        <div
          className={baseCSS.banner + " " + css.protoBanner}
          style={{ "--banner-color": "#ff8f00" } as React.CSSProperties}
        >
          Proto Build
        </div>
      )}
    </>
  );
}
