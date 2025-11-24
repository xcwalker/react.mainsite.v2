import { User } from "firebase/auth";
import { defaultNav, userSettingsType } from "../../types.tsx";
import LoadingPage from "../../components/Loading.tsx";
import SettingSection from "../../components/SettingSection.tsx";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import GFIcon from "../../components/GFIcon.tsx";
import IconButton from "../../components/IconButton.tsx";
import firebaseSetData from "../../functions/firebase/storage/setData.tsx";

import css from "../../styles/pages/account/settings/navigation.module.css";
import { SettingsNote } from "../../components/Settings/Note.tsx";

export default function SettingsNavigation(props: {
  userSettings: userSettingsType | null;
  currentUser: User | null;
}) {
  const { userSettings, currentUser } = props;

  if (!userSettings || !currentUser) {
    return <LoadingPage />;
  }

  return (
    <SettingSection id="navigationSettings" title="Reorganize Navigation">
      <SettingsNote >
        Any removed tabs can still be accessed throughout the site and via the
        url
      </SettingsNote>
      <ul className={css.mainNavList}>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const newNavigation = [...userSettings.navigation];
            const [removed] = newNavigation.splice(result.source.index, 1);
            newNavigation.splice(result.destination.index, 0, removed);
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              navigation: newNavigation,
            });
          }}
        >
          <Droppable droppableId="navigation-sections">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {userSettings.navigation.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={"section-" + index}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${css.subItem} ${css.draggable}`}
                      >
                        <GFIcon className={css.dragHandle}>drag_handle</GFIcon>
                        <span className={css.title}>{item.title}</span>
                        <div className={css.controls}>
                          <IconButton
                            onClick={() => {
                              const newNavigation = [
                                ...userSettings.navigation,
                              ];

                              newNavigation.splice(index, 1);

                              firebaseSetData("settings", currentUser.uid, {
                                ...userSettings,
                                navigation: newNavigation,
                              });
                            }}
                            title="Remove"
                            icon={{ gficon: "delete" }}
                            style="danger"
                            width="fit-content"
                          />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ul>
      <ul className={css.navigationList}>
        {userSettings.navigation.map((item, index) => (
          <li key={index} className={css.mainNavList}>
            <div className={css.header}>
              <div className={css.titleControls}>
                <h3 className={css.title}>{item.title}</h3>
                <IconButton
                  onClick={() => {
                    const newNavigation = [...userSettings.navigation];
                    newNavigation[index].hideTitle =
                      !newNavigation[index].hideTitle;
                    firebaseSetData("settings", currentUser.uid, {
                      ...userSettings,
                      navigation: newNavigation,
                    });
                  }}
                  title={item.hideTitle ? "Show Title" : "Hide Title"}
                  icon={{
                    gficon: item.hideTitle ? "visibility" : "visibility_off",
                  }}
                  style="secondary"
                  width="fit-content"
                />
              </div>
              <div className={css.controls}>
                <IconButton
                  onClick={() => {
                    const newNavigation = [...userSettings.navigation];
                    newNavigation.splice(index, 1);
                    firebaseSetData("settings", currentUser.uid, {
                      ...userSettings,
                      navigation: newNavigation,
                    });
                  }}
                  title="Remove"
                  icon={{ gficon: "delete" }}
                  style="danger"
                  width="fit-content"
                />
              </div>
            </div>
            <ul className={css.items}>
              <DragDropContext
                onDragEnd={(result) => {
                  if (!result.destination) return;

                  const newNavigation = [...userSettings.navigation];
                  const [removed] = newNavigation[index].items.splice(
                    result.source.index,
                    1
                  );
                  newNavigation[index].items.splice(
                    result.destination.index,
                    0,
                    removed
                  );

                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    navigation: newNavigation,
                  });
                }}
              >
                <Droppable droppableId={"droppable-" + item.title}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={css.draggableList}
                    >
                      {item.items.map((subItem, subIndex) => (
                        <Draggable
                          key={subIndex}
                          draggableId={"draggable-" + subIndex}
                          index={subIndex}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${css.subItem} ${css.draggable}`}
                            >
                              <GFIcon className={css.dragHandle}>
                                drag_handle
                              </GFIcon>
                              <span className={css.title}>{subItem.title}</span>
                              <div className={css.controls}>
                                <IconButton
                                  onClick={() => {
                                    const newNavigation = [
                                      ...userSettings.navigation,
                                    ];
                                    const newItems = [
                                      ...newNavigation[index].items,
                                    ];
                                    newItems.splice(subIndex, 1);
                                    newNavigation[index].items = newItems;
                                    firebaseSetData(
                                      "settings",
                                      currentUser.uid,
                                      {
                                        ...userSettings,
                                        navigation: newNavigation,
                                      }
                                    );
                                  }}
                                  title="Remove"
                                  icon={{ gficon: "delete" }}
                                  style="danger"
                                  width="fit-content"
                                />
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </ul>
            <ul className={css.removedItems}>
              {defaultNav
                .find((defaultItem) => defaultItem.title === item.title)
                ?.items.map((defaultSubItem, defaultIndex) => {
                  const exists = item.items.some(
                    (subItem) => subItem.title === defaultSubItem.title
                  );
                  if (!exists) {
                    return (
                      <li key={defaultIndex} className={css.subItem}>
                        <span className={css.title}>
                          {defaultSubItem.title}
                        </span>
                        <IconButton
                          onClick={() => {
                            const newNavigation = [...userSettings.navigation];
                            newNavigation[index].items.push(defaultSubItem);
                            firebaseSetData("settings", currentUser.uid, {
                              ...userSettings,
                              navigation: newNavigation,
                            });
                          }}
                          title="Add back"
                          icon={{ gficon: "add" }}
                          style="success"
                          width="fit-content"
                        />
                      </li>
                    );
                  }
                  return null;
                })}
            </ul>
          </li>
        ))}
        {/* Rest of the code remains the same */}
        {userSettings.navigationShowSocials && (
          <li>
            <div className={css.header}>
              <h3 className={css.title}>Socials</h3>
              <div className={css.controls}>
                <IconButton
                  onClick={() => {
                    firebaseSetData("settings", currentUser.uid, {
                      ...userSettings,
                      navigationShowSocials: false,
                    });
                  }}
                  title={"Hide Socials"}
                  icon={{ gficon: "delete" }}
                  style="danger"
                  width="fit-content"
                />
              </div>
            </div>
          </li>
        )}

        <li className={css.mainNavList}>
          <h3 className={css.title}>Add Removed Items</h3>
          <ul className={css.itemsToAdd}>
            {defaultNav.map((defaultItem) => {
              const exists = userSettings.navigation.some(
                (item) => item.title === defaultItem.title
              );
              if (!exists) {
                return (
                  <li key={defaultItem.title} className={css.subItem}>
                    <span className={css.title}>{defaultItem.title}</span>
                    <IconButton
                      onClick={() => {
                        const newNavigation = [...userSettings.navigation];
                        newNavigation.push(defaultItem);
                        firebaseSetData("settings", currentUser.uid, {
                          ...userSettings,
                          navigation: newNavigation,
                        });
                      }}
                      style="secondary"
                      title={`Add ${defaultItem.title} back to navigation`}
                      icon={{ gficon: "add" }}
                      width="fit-content"
                    />
                  </li>
                );
              }
              return null;
            })}
            {!userSettings.navigationShowSocials && (
              <li className={css.subItem}>
                <span className={css.title}>Socials</span>
                <IconButton
                  onClick={() => {
                    firebaseSetData("settings", currentUser.uid, {
                      ...userSettings,
                      navigationShowSocials: true,
                    });
                  }}
                  title={"Show Socials"}
                  icon={{ gficon: "add" }}
                  width="fit-content"
                />
              </li>
            )}
          </ul>
        </li>
      </ul>
    </SettingSection>
  );
}
