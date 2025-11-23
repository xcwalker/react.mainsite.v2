import { useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import { overlayType } from "../../types";
import { useNavigate, useParams } from "react-router";
import Section from "../../components/Section";
import css from "../../styles/pages/overlay/index.module.css";
import SideBySide from "../../components/SideBySide";
import { Preview } from "./Preview";
import SidebarUser from "../../components/Sidebar/SidebarUser";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import LoadingPage from "../../components/Loading";
import ErrorPage from "../../ErrorPage";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import SidebarDates from "../../components/Sidebar/SidebarDates";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import DeleteWarning from "../../components/DeleteWarning";
import firebaseDeleteData from "../../functions/firebase/storage/deleteData";

export default function OverlayIndex() {
  const currentUser = useAuth();
  const params = useParams();
  const [overlay, setOverlay] = useState<overlayType | undefined>(undefined);
  const [error, setError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const dateModified = new Date(
    overlay !== undefined ? overlay.metaData.date.modified : 0
  );
  const dateCreated = new Date(
    overlay !== undefined ? overlay.metaData.date.created : 0
  );

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
    return <ErrorPage code={404} error="Overlay not found" />;
  }

  if (overlay === undefined) {
    return <LoadingPage />;
  }

  return (
    <PageSeoWrapper
      title={`${overlay.data.title} ${separator} Overlay ${separator} ${title}`}
      description={`View the overlay "${overlay.data.title}" on ${title}`}
    >
      <DeleteWarning
        visibility={showDeleteConfirm}
        setVisibility={setShowDeleteConfirm}
        deleteAction={() => {
          if (
            !currentUser ||
            !(currentUser.uid === overlay.metaData.authorID) ||
            !params.id
          ) {
            return;
          }

          firebaseDeleteData("overlays", params.id).then(() => {
            toast.success("Overlay deleted successfully.");
            navigate("../", { replace: true });
          });
        }}
      />
      <Section id="overlay-index">
        <SideBySide leftWidth="350px">
          <SidebarContainer>
            <div className={css.details}>
              <SidebarTitle title={overlay.data.title} />
              <SidebarDates created={dateCreated} modified={dateModified} />
            </div>
            <SidebarUser userId={overlay.metaData.authorID} />
            <div className={css.buttons}>
              <div className={css.extraButtons}>
                <Button
                  href={
                    "https://overlay.xcwalker.dev/" + params.id + ".unstyled"
                  }
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
              <Button
                href={"https://overlay.xcwalker.dev/" + params.id}
                icon={{ gficon: "open_in_browser" }}
                style="primary"
                title="Open Overlay"
                external
              >
                Open Overlay
              </Button>
              {currentUser && currentUser.uid === overlay.metaData.authorID && (
                <>
                  <Button
                    href="./edit"
                    icon={{ gficon: "edit" }}
                    style="secondary"
                    title="Edit Overlay"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    icon={{ gficon: "delete" }}
                    style="danger"
                    title="Delete Overlay"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </SidebarContainer>
          <Preview overlay={overlay} className={css.preview} size="large" />
          <Preview
            overlay={overlay}
            className={css.previewSmall}
            size="small"
          />
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}
