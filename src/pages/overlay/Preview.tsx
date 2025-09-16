import { useEffect } from "react";
import { overlayType } from "../../types";

export function Preview(props: { overlay: overlayType; className: string; size?: "small" | "large" }) {
  useEffect(() => {
    // This is to force the iframe to reload when the overlay changes
    const iframe = document.getElementById(
      "overlay-preview-" + (props.overlay.data.title as string).replace(/\s+/g, "-").toLowerCase()
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src =
        "https://overlay.xcwalker.dev/"+ (props.size ? props.size + "-preview" : "preview") +"?json=" +
        JSON.stringify(props.overlay);
      console.log(iframe.src);
    }
  }, [props.overlay, props.size]);

  return (
    <iframe
      src={
        "https://overlay.xcwalker.dev/"+ (props.size ? props.size + "-preview" : "preview") +"?json=" +
        JSON.stringify(props.overlay)
      }
      className={props.className}
      id={"overlay-preview-" + props.overlay.data.title.replace(/\s+/g, "-").toLowerCase()}
    />
  );
}
