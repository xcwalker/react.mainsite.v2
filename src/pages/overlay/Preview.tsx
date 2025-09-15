import { useEffect } from "react";
import { overlayType } from "../../types";

export function Preview(props: { overlay: overlayType; className: string }) {
  useEffect(() => {
    // This is to force the iframe to reload when the overlay changes
    const iframe = document.getElementById(
      "overlay-preview"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src =
        "https://overlay.xcwalker.dev/preview?json=" +
        JSON.stringify(props.overlay);
      console.log(iframe.src);
    }
  }, [props.overlay]);

  return (
    <iframe
      src={
        "https://overlay.xcwalker.dev/preview?json=" +
        JSON.stringify(props.overlay)
      }
      className={props.className}
      id="overlay-preview"
    />
  );
}
