import baseCSS from "../../styles/components/banners/banner.module.css";

export default function NetworkLostBanner() {
  return (
    <>
      <div
        className={baseCSS.banner}
        style={{ "--_banner-color": "#fc790d" } as React.CSSProperties}
      >
        Network Lost
      </div>
    </>
  );
}
