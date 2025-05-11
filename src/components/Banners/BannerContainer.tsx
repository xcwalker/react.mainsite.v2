import css from "../../styles/components/banners/container.module.css";
import BigTop30Banner from "./BigTop30Banner";
import DevBanner from "./DEVBanner";

export default function BannerContainer() {
  return <div className={css.container}>
    <DevBanner />
    <BigTop30Banner />
    
  </div>;
}
