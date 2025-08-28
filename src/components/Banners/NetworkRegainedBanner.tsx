import { useEffect, useState } from "react";
import baseCSS from "../../styles/components/banners/banner.module.css";

export default function NetworkRegainedBanner() {
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisibility(false), 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {(visibility || import.meta.env.VITE_IS_DEBUG_ALL_BANNERS === "true") && (
        <div
          className={baseCSS.banner}
          style={{ "--_banner-color": "#2a8000" } as React.CSSProperties}
        >
          Network Regained
        </div>
      )}
    </>
  );
}
