import { User } from "firebase/auth";
import InputDropdown from "../../components/InputDropdown.tsx";
import SettingSection from "../../components/SettingSection.tsx";
import {
  BookmarkItem as BookmarkItemType,
  LinkItem,
  NewTabLinks,
} from "../../types.tsx";
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
import InputGroup from "../../components/InputGroup.tsx";

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
              onChange={(event) => {
                firebaseSetData("newtab", currentUser.uid, {
                  ...newTabLinks,
                  settings: {
                    ...newTabLinks.settings,
                    search: {
                      ...newTabLinks.settings.search,
                      queryURL: event.target.value,
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
          id="newTabSearchVisibility"
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
          id="newTabUserVisibility"
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
          id="newTabOrganizationVisibility"
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
        <InputToggle
          id="newTabHeroVisibility"
          label="Show Hero"
          checked={
            newTabLinks.settings.showHero !== undefined ? newTabLinks.settings.showHero : true
          }
          onChange={(value) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                showHero: value,
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
              onChange={(event) => {
                firebaseSetData("newtab", currentUser.uid, {
                  ...newTabLinks,
                  settings: {
                    ...newTabLinks.settings,
                    background: {
                      ...newTabLinks.settings.background,
                      image: event.target.value,
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
          onChange={(event) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                background: {
                  ...newTabLinks.settings.background,
                  filter: event.target.value,
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
                  links: [
                    ...newTabLinks.links,
                    { title: "", url: "", color: "", background: {} },
                  ],
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
      {/* bookmarks */}
      <SettingSection id="newTabBookmarks" title="Bookmarks Settings">
        <SettingsNote>
          Bookmarks appear below your links on the new tab page and in search
          results.
        </SettingsNote>
        <InputToggle
          id="newTabShowBookmarks"
          label="Show Bookmarks"
          checked={newTabLinks.settings.showBookmarks || false}
          onChange={(checked) => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              settings: {
                ...newTabLinks.settings,
                showBookmarks: checked,
              },
            });
          }}
        />
        {newTabLinks.bookmarks && newTabLinks.bookmarks.length > 0 && (
          <ul className={css.bookmarks}>
            {newTabLinks.bookmarks.map((bookmark, index) => (
              <Fragment key={index}>
                <BookmarkItem
                  bookmark={bookmark}
                  index={index}
                  setBookmarkData={(updatedBookmark: BookmarkItemType) => {
                    firebaseSetData("newtab", currentUser.uid, {
                      ...newTabLinks,
                      bookmarks: (newTabLinks.bookmarks || []).map((b, i) =>
                        i === index ? updatedBookmark : b
                      ),
                    });
                  }}
                  removeBookmark={() => {
                    firebaseSetData("newtab", currentUser.uid, {
                      ...newTabLinks,
                      bookmarks: (newTabLinks.bookmarks || []).filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                />
              </Fragment>
            ))}
          </ul>
        )}
        {!newTabLinks.bookmarks || newTabLinks.bookmarks.length === 0 ? (
          <SettingsNote>No bookmarks added yet.</SettingsNote>
        ) : null}
        <Button
          title="Add New Bookmark"
          icon={{ gficon: "add" }}
          onClick={() => {
            firebaseSetData("newtab", currentUser.uid, {
              ...newTabLinks,
              bookmarks: [
                ...(newTabLinks.bookmarks || []),
                { title: "", url: "", color: "", background: {} },
              ],
            });
          }}
          style="primary"
          width="300px"
        >
          Add New Bookmark
        </Button>
      </SettingSection>
    </>
  );
}

function BookmarkItem(props: {
  bookmark: BookmarkItemType;
  index: number;
  setBookmarkData: (bookmark: BookmarkItemType) => void;
  removeBookmark: () => void;
}) {
  const { bookmark, index, setBookmarkData, removeBookmark } = props;

  return (
    <li className={css.bookmarkItem}>
      <InputGroup>
        <Input
          id={`bookmarkTitle${index}`}
          label="Title"
          type="text"
          value={bookmark.title}
          onChange={(event) => {
            setBookmarkData({ ...bookmark, title: event.target.value });
          }}
        />
        <Input
          id={`bookmarkURL${index}`}
          label="URL"
          type="url"
          value={bookmark.url}
          onChange={(event) => {
            setBookmarkData({ ...bookmark, url: event.target.value });
          }}
        />
        <Input
          id={`bookmarkShorthand${index}`}
          label="Shorthand"
          type="text"
          value={bookmark.shorthand || ""}
          onChange={(event) => {
            setBookmarkData({ ...bookmark, shorthand: event.target.value });
          }}
        />
        <Input
          id={`bookmarkIconURL${index}`}
          label="Icon URL"
          type="url"
          value={bookmark.icon || ""}
          onChange={(event) => {
            setBookmarkData({ ...bookmark, icon: event.target.value });
          }}
        />
        <Button
          title="Remove Bookmark"
          icon={{ gficon: "remove" }}
          onClick={() => {
            removeBookmark();
          }}
          style="danger"
        />
      </InputGroup>
    </li>
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
