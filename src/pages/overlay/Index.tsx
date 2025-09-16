import { useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import { overlayType } from "../../types";
import { useParams } from "react-router";
import Section from "../../components/Section";
import css from "../../styles/pages/overlay/index.module.css";
import SideBySide from "../../components/SideBySide";
import { Preview } from "./Preview";
import SidebarUser from "../../components/SidebarUser";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";

export default function OverlayIndex() {
  const params = useParams();
  const [overlay, setOverlay] = useState<overlayType | null>(null);
  const [error, setError] = useState(false);

  const dateModified = new Date(
    overlay !== null ? overlay.metaData.date.modified : 0
  );
  const dateCreated = new Date(
    overlay !== null ? overlay.metaData.date.created : 0
  );
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    second: undefined,
    minute: "numeric",
    hour: "numeric",
  };

  useEffect(() => {
    if (!params.id) return;

    firebaseGetRealtimeData(
      "overlays",
      params.id,
      setOverlay as React.Dispatch<React.SetStateAction<unknown>>,
      setError
    );
  }, [params.id]);

  if (error) {
    return <div>Error loading overlay.</div>;
  }

  if (!overlay) {
    return <div>Loading...</div>;
  }

  return (
    <Section id="overlay-index">
      <SideBySide leftWidth="350px">
        <div className={css.sidebar}>
          <div className={css.details}>
            <h3>{overlay.data.title}</h3>
            <div className={css.dates}>
              <div className={css.created}>
                {dateCreated.toLocaleDateString(undefined, dateOptions)}
              </div>
              {overlay.metaData.date.created !==
                overlay.metaData.date.modified && (
                <div className={css.modified}>
                  Last Modified:{" "}
                  {dateModified.toLocaleDateString(undefined, dateOptions) ===
                    dateCreated.toLocaleDateString(undefined, dateOptions) &&
                    dateModified.toLocaleTimeString(undefined, timeOptions)}
                  {dateModified.toLocaleDateString(undefined, dateOptions) !==
                    dateCreated.toLocaleDateString(undefined, dateOptions) &&
                    dateModified.toLocaleDateString(undefined, dateOptions)}
                </div>
              )}
            </div>
          </div>
          <SidebarUser userId={overlay.metaData.authorID} />
          <div className={css.buttons}>
            <Button
              href="./edit"
              icon={{ gficon: "edit" }}
              style="secondary"
              title="Edit Overlay"
            >
              Edit
            </Button>
            <Button
              href={"https://overlay.xcwalker.dev/" + params.id}
              icon={{ gficon: "open_in_browser" }}
              style="primary"
              title="Open Overlay"
              external
            >
              Open Overlay
            </Button>
            <div className={css.extraButtons}>
              <Button
                href={"https://overlay.xcwalker.dev/" + params.id + ".unstyled"}
                icon={{ gficon: "check_box_outline_blank" }}
                style="secondary"
                title="Open Unstyled Overlay"
              >
                Unstyled
              </Button>
              {/* copy link */}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://overlay.xcwalker.dev/" + params.id
                  );

                  toast.success("Link copied to clipboard!");
                }}
                icon={{ gficon: "link" }}
                style="secondary"
                title="Copy Overlay Link"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
        <Preview overlay={overlay} className={css.preview} />
      </SideBySide>
    </Section>
  );
}
