import { useEffect, useState } from "react";
import css from "../../styles/components/banners/container.module.css";
import BigTop30Banner from "./BigTop30Banner";
import DevBanner from "./DEVBanner";
import NetworkLostBanner from "./NetworkLostBanner";
import NetworkRegainedBanner from "./NetworkRegainedBanner";
import ProtoBanner from "./ProtoBanner";

export default function BannerContainer() {
  const [networkLost, setNetworkLost] = useState(false);
  const [networkWasLost, setNetworkWasLost] = useState(false);

  useEffect(() => {
    window.addEventListener("offline", () => {
      console.log("The network connection has been lost.");
      setNetworkLost(true);
      setNetworkWasLost(true);
    });

    window.addEventListener("online", () => {
      console.log("The network connection has been restored.");
      setNetworkLost(false);
    });

    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);

  return (
    <div className={css.container}>
      <DevBanner />
      <ProtoBanner />
      <BigTop30Banner />
      {(networkLost ||
        import.meta.env.VITE_IS_DEBUG_ALL_BANNERS === "true") && (
        <NetworkLostBanner />
      )}
      {((!networkLost && networkWasLost) ||
        import.meta.env.VITE_IS_DEBUG_ALL_BANNERS === "true") && (
        <NetworkRegainedBanner />
      )}
    </div>
  );
}
