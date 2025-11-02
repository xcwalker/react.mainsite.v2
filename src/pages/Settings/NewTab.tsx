import { User } from "firebase/auth";
import InputDropdown from "../../components/InputDropdown.tsx";
import SettingSection from "../../components/SettingSection.tsx";
import { LinkItem, NewTabLinks } from "../../types.tsx";
import { Fragment, useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData.tsx";
import LoadingPage from "../../components/Loading.tsx";
import firebaseSetData from "../../functions/firebase/storage/setData.tsx";
import Input from "../../components/Input.tsx";
import InputToggle from "../../components/InputToggle.tsx";
import InputColor from "../../components/InputColor.tsx";
import Image from "../../components/Image.tsx";

import css from "../../styles/pages/account/settings/newTab.module.css";
import { SettingsNote } from "../../components/Settings/Note.tsx";
import { LinkItemEdit } from "../newTab/Edit.tsx";
import { arrayMove } from "../../functions/arrayMove.tsx";
import Button from "../../components/Button.tsx";

export default function SettingsNewTab(props: { currentUser: User | null }) {
  const { currentUser } = props;
  const [newTabLinks, setNewTabLinks] = useState<NewTabLinks | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setNewTabLinks(null);
      return;
    }

    firebaseGetRealtimeData(
      "newtab",
      currentUser.uid,
      setNewTabLinks as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [currentUser]);

  if (!currentUser || !newTabLinks) {
    return <LoadingPage />;
  }

  return (
    <>
      {newTabLinks.settings.search.provider && (
        <SettingSection id="newTabSettings" title="Search Settings">
          {/* choose a search engine */}
          <InputDropdown
            id="newTabSearchProvider"
            label="Search Engine"
            onChange={(value) => {
              firebaseSetData("newtab", currentUser.uid, {
                ...newTabLinks,
                settings: {
                  ...newTabLinks.settings,
                  search: {
                    ...newTabLinks.settings.search,
                    provider: value,
                    queryURL:
                      value !== "custom"
                        ? searchProviders.find((sp) => sp.value === value)
                            ?.queryURL || ""
                        : newTabLinks.settings.search.queryURL || "",
                  },
                },
              });
            }}
            value={newTabLinks.settings.search.provider}
            values={searchProviders}
          />
          {newTabLinks.settings.search.provider === "custom" && (
            <Input
              id="newTabSearchCustomQueryURL"
              label="Custom Search Query URL"
              type="url"
              value={newTabLinks.settings.search.queryURL}
              onChange={(value) => {
                firebaseSetData("newtab", currentUser.uid, {
                  ...newTabLinks,
                  settings: {
                    ...newTabLinks.settings,
                    search: {
                      ...newTabLinks.settings.search,
                      queryURL: value.target.value,
                    },
                  },
                });
              }}
            />
          )}
        </SettingSection>
      )}
      {/* visibility toggles */}
      <SettingSection id="newTabVisibility" title="Visibility Settings">
        <InputToggle
          id="newTabLinksVisibility"
          label="Show Search"
          checked={newTabLinks.settings.showSearch}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                showSearch: value,
              },
            });
          }}
        />
        <InputToggle
          id="newTabLinksVisibility"
          label="Show User"
          checked={newTabLinks.settings.showUser}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                showUser: value,
              },
            });
          }}
        />
        <InputToggle
          id="newTabLinksVisibility"
          label="Show Organization"
          checked={newTabLinks.settings.showOrganization}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                showOrganization: value,
              },
            });
          }}
        />
      </SettingSection>
      {/* Styling */}
      <SettingSection id="newTabStyling" title="Styling Settings">
        {/* Text Color Picker */}
        <InputColor
          id="newTabTextColor"
          label="Text Color"
          value={newTabLinks.settings.color || "#000000"}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                textColor: value,
              },
            });
          }}
        />
        {/* Background Type Picker */}
        <InputDropdown
          id="newTabBackgroundType"
          label="Background Type"
          value={newTabLinks.settings.background.type || "color"}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                background: {
                  ...newTabLinks.settings.background,
                  type: value,
                },
              },
            });
          }}
          values={[
            { label: "Color", value: "color" },
            { label: "Image", value: "image" },
          ]}
        />
        {newTabLinks.settings.background.type === "color" && (
          <InputColor
            id="newTabBackgroundColor"
            label="Background Color"
            value={newTabLinks.settings.background.color || "#000000"}
            onChange={(value) => {
              firebaseSetData("newtab", currentUser.uid, {
                ...newTabLinks,
                settings: {
                  ...newTabLinks.settings,
                  background: {
                    ...newTabLinks.settings.background,
                    color: value,
                  },
                },
              });
            }}
          />
        )}
        {newTabLinks.settings.background.type === "image" && (
          <>
            <Input
              id="newTabBackgroundImageURL"
              label="Background Image URL"
              type="url"
              value={newTabLinks.settings.background.image || ""}
              onChange={(value) => {
                firebaseSetData("newtab", currentUser.uid, {
                  ...newTabLinks,
                  settings: {
                    ...newTabLinks.settings,
                    background: {
                      ...newTabLinks.settings.background,
                      image: value,
                    },
                  },
                });
              }}
            />
            <Image
              src={newTabLinks.settings.background.image || ""}
              alt="Background Preview"
              className={css.preview}
            />
          </>
        )}
        {/* filter */}
        <SettingsNote>
          You can apply CSS filters to the background image using this setting.
          {"\n"}
          For example, to make the image grayscale, you can use:{" "}
          <code>grayscale(100%)</code>.{"\n"}To adjust brightness, you can use:{" "}
          <code>brightness(50%)</code>.{"\n"}You can combine multiple filters as
          well, like: <code>grayscale(100%) brightness(50%)</code>.
        </SettingsNote>
        <Input
          id="newTabBackgroundFilter"
          label="Background Filter (CSS)"
          type="text"
          value={newTabLinks.settings.background.filter || ""}
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                background: {
                  ...newTabLinks.settings.background,
                  filter: value,
                },
              },
            });
          }}
        />
      </SettingSection>
      {/* Links */}
      <SettingSection id="newTabLinks" title="Links Settings">
        <SettingsNote>
          Customize the links that appear on your new tab page.
        </SettingsNote>
        <ul className={css.links}>
          {newTabLinks.links.map((link, index) => (
            <Fragment key={index}>
              <LinkItemEdit
                link={link}
                index={index}
                setLinkData={(link: LinkItem) => {
                  firebaseSetData("newtab", currentUser.uid, {
                    ...newTabLinks,
                    links: newTabLinks.links.map((l, i) =>
                      i === index ? link : l
                    ),
                  });
                }}
                removeLink={() => {
                  firebaseSetData("newtab", currentUser.uid, {
                    ...newTabLinks,
                    links: newTabLinks.links.filter((_, i) => i !== index),
                  });
                }}
                changePosition={(newPosition: number) => {
                  firebaseSetData("newtab", currentUser.uid, {
                    ...newTabLinks,
                    links: arrayMove(newTabLinks.links, index, newPosition),
                  });
                }}
                positionCount={newTabLinks.links.length}
                position={index}
              />
            </Fragment>
          ))}
          <li>
            <Button
              title="Add New Link"
              icon={{ gficon: "add" }}
              onClick={() => {
                firebaseSetData("newtab", currentUser.uid, {
                  ...newTabLinks,
                  links: [...newTabLinks.links, { title: "", url: "" }],
                });
              }}
              style="primary"
              width="300px"
            >
              Add New Link
            </Button>
          </li>
        </ul>
      </SettingSection>
    </>
  );
}

const searchProviders = [
  {
    label: "Google",
    value: "google",
    queryURL: "https://www.google.com/search?q=",
  },
  { label: "Bing", value: "bing", queryURL: "https://www.bing.com/search?q=" },
  {
    label: "DuckDuckGo",
    value: "duckduckgo",
    queryURL: "https://duckduckgo.com/?q=",
  },
  { label: "Custom", value: "custom", queryURL: "" },
];
