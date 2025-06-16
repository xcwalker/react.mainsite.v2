import { useEffect, useState } from "react";
import Section from "../../components/Section";
import firebaseGetData from "../../functions/firebase/storage/getData";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { LinkItem as LinkItemType, NewTabLinks } from "../../types";
import css from "../../styles/pages/newTab/edit.module.css";
import LoadingPage from "../../components/Loading";
import ErrorPage from "../../ErrorPage";
import { Navigate } from "react-router-dom";

import { BlockPicker, CompactPicker, PhotoshopPicker } from "react-color";
import GFIcon from "../../components/GFIcon";
import Checkbox from "../../components/Checkbox";

export default function NewTabEdit() {
  const user = useAuth(null);
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [modifierPressed, setModifierPressed] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    firebaseGetData("newtab", user?.uid).then((data) => {
      if (data === undefined) {
        console.error("User data not found");
        setError(true);
        return;
      }
      setLinkData(data as NewTabLinks);
      setError(false);
      return;
    });
    return () => {
      setLinkData(undefined);
      setError(false);
    };
  }, [user?.uid]);

  useEffect(() => {
    // updates newtab
    console.log("Updating new tab data", linkData, user?.uid);
    firebaseSetData("newtab", user?.uid, linkData)
      .then(() => {
        console.log("New tab data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating new tab data:", error);
        setError(true);
      });
  }, [linkData, user?.uid]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setModifierPressed(true);

        if (e.key.toLowerCase() === "e") {
          e.preventDefault();
          setEditMode((prev) => !prev);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setModifierPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [linkData?.links]);

  return (
    <>
      {!error && editMode && (
        <Section
          id="new-tab-edit"
          className={css.newTabEdit}
          container={{ className: css.container }}
        >
          {linkData && (
            <>
              <h2>Edit New Tab</h2>
              <ul className={css.links}>
                {linkData.links.map((link, index) => (
                  <LinkItemEdit
                    key={index}
                    link={link}
                    index={index}
                    setLinkData={(link: LinkItemType) => {
                      setLinkData((prevLinkData) => {
                        if (!prevLinkData) return prevLinkData;
                        const newLinks = [...prevLinkData.links];
                        newLinks[index] = link;
                        return { ...prevLinkData, links: newLinks };
                      });
                    }}
                    removeLink={() => {
                      setLinkData((prevLinkData) => {
                        if (!prevLinkData) return prevLinkData;
                        const newLinks = prevLinkData.links.filter(
                          (_, i) => i !== index
                        );
                        return { ...prevLinkData, links: newLinks };
                      });
                    }}
                    changePosition={(newPosition: number) => {
                      setLinkData((prevLinkData) => {
                        if (!prevLinkData) return prevLinkData;
                        const newLinks = [...prevLinkData.links];
                        const [movedLink] = newLinks.splice(index, 1);
                        newLinks.splice(newPosition, 0, movedLink);
                        return { ...prevLinkData, links: newLinks };
                      });
                    }}
                    positionCount={linkData.links.length}
                    position={index}
                  />
                ))}
                <li className={css.addLink}>
                  <button
                    onClick={() => {
                      setLinkData((prevLinkData) => {
                        if (!prevLinkData) return prevLinkData;
                        const newLinks = [
                          ...prevLinkData.links,
                          {
                            title: "New Link",
                            url: "https://example.com",
                            icon: "",
                            type: "normal",
                            background: {
                              type: "color",
                              color: "#ffffff",
                              image: "",
                            },
                            color: "#000000",
                          },
                        ];
                        return { ...prevLinkData, links: newLinks };
                      });
                    }}
                  >
                    Add Link
                  </button>
                </li>
              </ul>
            </>
          )}
        </Section>
      )}
      {!error && !linkData && <LoadingPage />}
      {error && <ErrorPage code={400} error="Error Loading New Tab" />}
      {!error && !editMode && <Navigate to={"../"} />}
    </>
  );
}

function LinkItemEdit(props: {
  link: LinkItemType;
  index: number;
  setLinkData: (link: LinkItemType) => void;
  removeLink: () => void;
  changePosition: (newPosition: number) => void;
  positionCount: number;
  position: number;
}) {
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(props.link.color || "#000000");
  const [backgroundColor, setBackgroundColor] = useState(
    props.link.background.color || "#ffffff"
  );

  return (
    <>
      <li className={props.link.type === "wide" ? " " + css.wide : ""}>
        <div className={css.link}>
          <div className={css.backdrop}/>
          <div className={css.iconWrapper}>
            <div className={css.positionSelector}>
              <button
                onClick={() => {
                  if (props.position > 0) {
                    props.changePosition(props.position - 1);
                  }
                }}
                disabled={props.position === 0}
              >
                <GFIcon>arrow_drop_up</GFIcon>
              </button>
              <button
                onClick={() => {
                  if (props.position < props.positionCount - 1) {
                    props.changePosition(props.position + 1);
                  }
                }}
                disabled={props.position === props.positionCount - 1}
              >
                <GFIcon>arrow_drop_down</GFIcon>
              </button>
            </div>

            <button
              className={css.remove}
              onClick={() => {
                props.removeLink();
              }}
            >
              <GFIcon className={css.icon}>remove</GFIcon>
            </button>

            <div className={css.backgroundPreview}>
              {props.link.background.type === "image" &&
              props.link.background.image ? (
                <img
                  src={props.link.background.image}
                  alt={props.link.title}
                  className={css.backgroundImage}
                />
              ) : (
                <div
                  className={css.backgroundColor}
                  style={{ backgroundColor: backgroundColor }}
                ></div>
              )}
            </div>
            <img
              src={
                props.link.icon
                  ? props.link.icon
                  : "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
                    props.link.url +
                    "&size=50"
              }
              alt={props.link.title}
              className={css.iconImage}
            />
          </div>
          <input
            type="url"
            name="iconUrl"
            id=""
            onInput={(e) => {
              const newLink = {
                ...props.link,
                icon: (e.target as HTMLInputElement).value,
              };
              props.setLinkData(newLink);
            }}
            value={props.link.icon}
            placeholder="https://example.com/favicon.svg"
          />
          <input
            type="url"
            name=""
            id=""
            onInput={(e) => {
              const newLink = {
                ...props.link,
                url: (e.target as HTMLInputElement).value,
              };
              props.setLinkData(newLink);
            }}
            value={props.link.url}
            placeholder="https://example.com"
          />
          <div className={css.title}>
            <input
              type="text"
              className={css.title}
              value={props.link.title}
              onInput={(e) => {
                const newLink = {
                  ...props.link,
                  title: (e.target as HTMLInputElement).value,
                };
                props.setLinkData(newLink);
              }}
              placeholder="Link Title"
            />
            <Checkbox
              id={`show-title-${props.index}`}
              label="Show Title"
              showLabel={false}
              checked={
                props.link.showTitle === undefined ||
                props.link.showTitle === true
                  ? true
                  : false
              }
              onChange={(checked) => {
                const newLink = {
                  ...props.link,
                  showTitle: checked,
                };
                props.setLinkData(newLink);
              }}
              className={css.showTitleCheckbox}
            />
            {/* <input
              type="checkbox"
              name=""
              id=""
              className={css.showTitleCheckbox}
              checked={
                props.link.showTitle === undefined ||
                props.link.showTitle === true
                  ? true
                  : false
              }
              onChange={(e) => {
                const newLink = {
                  ...props.link,
                  showTitle: (e.target as HTMLInputElement).checked,
                };
                props.setLinkData(newLink);
              }}
            /> */}
          </div>
          <div className={css.background}>
            <select
              name=""
              id=""
              value={props.link.background.type}
              onChange={(e) => {
                const newLink = {
                  ...props.link,
                  background: {
                    ...props.link.background,
                    type: (e.target as HTMLSelectElement).value,
                  },
                };
                props.setLinkData(newLink);
              }}
            >
              <option value="image">Image</option>
              <option value="color">Color</option>
            </select>
            {props.link.background.type === "image" && (
              <input
                type="url"
                name=""
                id=""
                value={props.link.background.image}
                onInput={(e) => {
                  const newLink = {
                    ...props.link,
                    background: {
                      ...props.link.background,
                      image: (e.target as HTMLInputElement).value,
                    },
                  };
                  props.setLinkData(newLink);
                }}
                placeholder="https://example.com/image.jpg"
              />
            )}
            {props.link.background.type === "color" && (
              <>
                <button
                  onClick={() => {
                    setShowBackgroundColorPicker((prev) => !prev);
                  }}
                >
                  Show Picker
                </button>
              </>
            )}
          </div>
          <>
            <button
              onClick={() => {
                setShowColorPicker((prev) => !prev);
              }}
            >
              Show Text Color Picker
            </button>
          </>
        </div>
      </li>

      {showBackgroundColorPicker && (
        <PhotoshopPicker
          className={css.picker}
          color={backgroundColor}
          header="Background Color Picker"
          onChange={(e) => {
            setBackgroundColor(e.hex);
          }}
          onAccept={() => {
            const newLink = {
              ...props.link,
              background: {
                ...props.link.background,
                color: backgroundColor,
              },
            };
            props.setLinkData(newLink);
            setShowBackgroundColorPicker(false);
          }}
          onCancel={() => {
            setBackgroundColor(props.link.background.color || "#ffffff");
            setShowBackgroundColorPicker(false);
          }}
        />
      )}
      {showColorPicker && (
        <PhotoshopPicker
          className={css.picker}
          color={color}
          header="Text Color Picker"
          onChange={(e) => {
            setColor(e.hex);
          }}
          onAccept={() => {
            const newLink = {
              ...props.link,
              color: color,
            };
            props.setLinkData(newLink);
            setShowColorPicker(false);
          }}
          onCancel={() => {
            setColor(props.link.color || "#000000");
            setShowColorPicker(false);
          }}
        />
      )}
    </>
  );
}
