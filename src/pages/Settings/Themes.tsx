import { User } from "firebase/auth";
import { customThemeType, userSettingsType } from "../../types";
import { Fragment, useState } from "react";
import SettingSection from "../../components/SettingSection";
import css from "../../styles/pages/account/manage.module.css";
import { availableThemes } from "../../SettingController";
import ButtonWithPreview from "../../components/ButtonWithPreview";
import firebaseSetData from "../../functions/firebase/storage/setData";
import InputGroup from "../../components/InputGroup";
import InputColor from "../../components/InputColor";
import invert from "invert-color";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function SettingsThemes(props: {
  userSettings: userSettingsType;
  currentUser: User;
}) {
  const { currentUser, userSettings } = props;
  const [customThemeName, setCustomThemeName] = useState("");
  return (
    <>
      <SettingSection id="themeSettings" title="Select A Theme">
        <ul className={css.themeList}>
          {availableThemes.map((theme, index) => (
            <li key={index}>
              <ButtonWithPreview
                title="Click to select theme"
                style={userSettings.theme === theme ? "primary" : "secondary"}
                label={theme}
                onClick={() => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    theme: theme,
                  });
                }}
              >
                {PreviewTheme({ themeName: theme })}
              </ButtonWithPreview>
            </li>
          ))}
        </ul>
      </SettingSection>
      {userSettings.theme === "custom" && userSettings.customThemeColor && (
        <SettingSection
          id="customThemeSettings"
          title="Customize Your Theme Colors"
        >
          <InputGroup direction="row">
            <InputGroup>
              <InputColor
                id="themeBackgroundColor"
                label="Background Color"
                value={userSettings.customThemeColor.background}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      background: color,
                    },
                  });
                }}
              />
              <InputColor
                id="themeTextColor"
                label="Text Color"
                value={userSettings.customThemeColor.text}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      text: color,
                      textInverse: invert(color),
                    },
                  });
                }}
              />
              <InputColor
                id="themeTextAltColor"
                label="Text Alt Color"
                value={userSettings.customThemeColor.textAlt}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      textAlt: color,
                    },
                  });
                }}
              />
              <InputColor
                id="themePrimaryColor"
                label="Primary Color"
                value={userSettings.customThemeColor.primary}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      primary: color,
                    },
                  });
                }}
              />
              <InputColor
                id="themeSecondaryColor"
                label="Secondary Color"
                value={userSettings.customThemeColor.secondary}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      secondary: color,
                    },
                  });
                }}
              />
              <InputColor
                id="themeAccentColor"
                label="Accent Color"
                value={userSettings.customThemeColor.accent}
                onChange={(color) => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemeColor: {
                      ...userSettings.customThemeColor,
                      accent: color,
                    },
                  });
                }}
              />
            </InputGroup>
            <InputGroup>
              {/* Save Custom Theme */}
              <Input
                label="Custom Theme Name"
                value={customThemeName}
                onChange={(e) => setCustomThemeName(e.target.value)}
                placeholder={`Custom Theme ${
                  userSettings.customThemes?.length + 1
                }`}
                id="customThemeName"
              />
              <button
                onClick={() => {
                  firebaseSetData("settings", currentUser.uid, {
                    ...userSettings,
                    customThemes: [
                      ...(userSettings.customThemes || []),
                      {
                        name:
                          customThemeName ||
                          `Custom Theme ${userSettings.customThemes?.length + 1}`,
                        colors: userSettings.customThemeColor,
                      },
                    ],
                  });
                  setCustomThemeName("");
                }}
              >
                Save Custom Theme
              </button>
              <div>
                {userSettings.customThemes &&
                userSettings.customThemes.length > 0 ? (
                  userSettings.customThemes.map((theme, index) => (
                    <Fragment key={index}>
                      <Button
                        onClick={() => {
                          firebaseSetData("settings", currentUser.uid, {
                            ...userSettings,
                            theme: "custom",
                            customThemeColor: theme.colors,
                          });
                        }}
                        style="secondary"
                        title={"Click to apply theme " + theme.name}
                        className={css.customThemeButton}
                      >
                        {theme.name}

                        <Button
                          onClick={() => {
                            const newCustomThemes = [
                              ...(userSettings.customThemes || []),
                            ];
                            newCustomThemes.splice(index, 1);

                            firebaseSetData("settings", currentUser.uid, {
                              ...userSettings,
                              customThemes: newCustomThemes,
                            });
                          }}
                          style="danger"
                          title={"Delete theme " + theme.name}
                          icon={{ gficon: "delete" }}
                          className={css.deleteButton}
                          width="fit-content"
                        >
                          <></>
                        </Button>
                      </Button>
                    </Fragment>
                  ))
                ) : (
                  <p>No custom themes saved.</p>
                )}
              </div>
            </InputGroup>
          </InputGroup>
        </SettingSection>
      )}
    </>
  );
}

function PreviewTheme(props: {
  themeName: string;
  customThemeColors?: customThemeType;
}) {
  return (
    <div className="preview" data-theme={props.themeName}>
      Previewing theme: {props.themeName}
    </div>
  );
}
