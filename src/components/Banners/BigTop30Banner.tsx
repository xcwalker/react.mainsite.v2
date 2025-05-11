import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { RadioAtom } from "../../App";

import css from "../../styles/components/banners/banner.module.css";

export default function BigTop30Banner() {
  const dj = useAtomValue(RadioAtom).dj.name;
  return (
    <>
      {(dj === "BigTop30" ||
        import.meta.env.VITE_IS_DEBUG_ALL_BANNERS === "true") && (
        <Link
          to={"https://mobile.reactradio.dev/station/simulator-radio"}
          className={css.banner}
          style={{ "--_banner-color": "darkblue", "--_text-color": "white" } as React.CSSProperties}
          target="_blank"
          rel="noopener noreferrer"
        >
          BigTop30 Now Live On Simulator Radio
        </Link>
      )}
    </>
  );
}
