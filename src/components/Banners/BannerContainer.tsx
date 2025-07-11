import { useEffect, useState } from "react";
import css from "../../styles/components/banners/container.module.css";
import BigTop30Banner from "./BigTop30Banner";
import DevBanner from "./DEVBanner";
import NetworkLostBanner from "./NetworkLostBanner";
import NetworkRegainedBanner from "./NetworkRegainedBanner";

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
      <BigTop30Banner />
      {networkLost && <NetworkLostBanner />}
      {!networkLost && networkWasLost && <NetworkRegainedBanner />}
    </div>
  );
}
