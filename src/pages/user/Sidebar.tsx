import { UserType } from "../../types";
import css from "../../styles/pages/user/sidebar.module.css";
import Button from "../../components/Button";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import { useEffect, useState } from "react";
import firebaseSetData from "../../functions/firebase/storage/setData";
import toTitleCase from "../../functions/toTitleCase";
import { isValidHttpUrl } from "../newTab/Index";
import { useParams } from "react-router-dom";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import InputDropdown from "../../components/InputDropdown";
import devConsole from "../../functions/devConsole";

export default function Sidebar(props: { user: UserType; id: string }) {
  const params = useParams();
  const currentUser = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserType | undefined>(
    undefined
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
  const dateJoined = new Date(props.user.info.joined);
  const dateOnline = new Date(props.user.info.lastOnline);
  const dateNow = new Date();

  useEffect(() => {
    if (currentUser?.uid) {
      // Assuming you have a function to get the current user's data
      firebaseGetRealtimeUserData(
        currentUser.uid,
        setCurrentUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    }
  }, [currentUser?.uid]);

  return (
    <SidebarContainer>
      <div
        className={css.user}
        style={{
          color: props.user.images.color ? props.user.images.color : undefined,
        }}
      >
        {props.user.images.background && (
          <>
            {props.user.images.backgroundType === "color" && (
              <div
                className={css.background}
                style={{ backgroundColor: props.user.images.background }}
              />
            )}
            {props.user.images.backgroundType === "image" && (
              <img
                src={props.user.images.background}
                alt=""
                className={css.background}
              />
            )}
            {props.user.images.backgroundType === "video" && (
              <video
                src={props.user.images.background}
                className={css.background}
                autoPlay
                loop
                muted
                controls={false}
              />
            )}
          </>
        )}
        <div className={css.details}>
          <span className={css.displayName}>
            {props.user.about.displayName}
            {props.user.info.role !== "unverified" && (
              <span className={css.role}>
                {toTitleCase(props.user.info.role)}
              </span>
            )}
          </span>
          <span className={css.userName}>
            @
            {props.user.about.userName +
              " | " +
              props.user.about.firstName +
              " " +
              props.user.about.lastName}
          </span>
        </div>
        <img src={props.user.images.profile} alt="" className={css.profile} />
      </div>
      <div className={css.information}>
        <span>Gender</span>
        <span>Pronouns</span>
        <span>Location</span>
        <div className={css.info}>
          <span>{props.user.info.gender}</span>
        </div>
        <div className={css.info}>
          <span>{props.user.info.pronouns}</span>
        </div>
        <div className={css.info}>
          <span>{props.user.info.location}</span>
        </div>
      </div>
      <div className={css.date}>
        <div className={css.left}>
          <span>Member Since</span>
          <span className={css.date}>
            {dateJoined.toLocaleDateString(undefined, dateOptions)}
          </span>
        </div>
        <div className={css.right}>
          <span>Last Seen</span>
          <span className={css.date}>
            {dateOnline.toLocaleDateString(undefined, dateOptions) ===
              dateNow.toLocaleDateString(undefined, dateOptions) &&
              dateOnline.toLocaleTimeString(undefined, timeOptions)}
            {dateOnline.toLocaleDateString(undefined, dateOptions) !==
              dateNow.toLocaleDateString(undefined, dateOptions) &&
              dateOnline.toLocaleDateString(undefined, dateOptions)}
          </span>
        </div>
      </div>
      {props.user.links && props.user.links.length > 0 && (
        <ul className={css.links}>
          {props.user.links.map((item, index) => {
            const url = isValidHttpUrl(item)
              ? new URL(item)
              : new URL("https://invalidurl.com");
            const hostname = url.hostname.replace(/^www\./, "");

            return (
              <Button
                key={index}
                href={item}
                title={hostname}
                style="secondary"
                className={css.linkButton}
                icon={{
                  inline: (
                    <div className={css.linkIcon}>
                      <div className={css.background} />
                      <img
                        src={
                          // old gstatic implementation
                          // "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
                          // item +
                          // "&size=128"
                          "https://icon.horse/icon/" + hostname
                        }
                        alt=""
                      />
                    </div>
                  ),
                }}
              >
                {/* {domain !== null && domain.replace("www.", "")}
                {domain === null && item} */}
                {hostname}
              </Button>
            );
          })}
          {props.user.links && props.user.links.length % 2 != 0 && (
            <div className={css.innerCorner} />
          )}
        </ul>
      )}
      {currentUserData?.info.role &&
        currentUserData?.info.role !== "user" &&
        currentUserData?.info.role !== "unverified" && (
          <>
            <InputDropdown
              id="user-role"
              label="User Role"
              value={props.user.info.role}
              values={[
                { label: "Unverified", value: "unverified", icon: "help" },
                { label: "User", value: "user", icon: "person" },
                { label: "Developer", value: "developer", icon: "code" },
                { label: "Moderator", value: "moderator", icon: "shield" },
                { label: "Admin", value: "admin", icon: "shield_person" },
                { label: "Overlord", value: "overlord", icon: "star" },
              ]}
              onChange={(value) => {
                const updatedUserData: UserType = { ...props.user };
                updatedUserData.info.role = value as UserType["info"]["role"];

                firebaseSetData("users", props.id, updatedUserData).then(() => {
                  devConsole.log("User role updated successfully.");
                });
              }}
            />
            {/* Hide User */}
            {props.user.info.hidden ? (
              <Button
                onClick={() => {
                  const updatedUserData: UserType = { ...props.user };
                  updatedUserData.info.hidden = false;

                  firebaseSetData("users", props.id, updatedUserData).then(
                    () => {
                      devConsole.log("User unhidden successfully.");
                    }
                  );
                }}
                title={"Unhide User"}
                icon={{ gficon: "visibility" }}
                style="danger"
              >
                Unhide User
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const updatedUserData: UserType = { ...props.user };
                  updatedUserData.info.hidden = true;

                  firebaseSetData("users", props.id, updatedUserData).then(
                    () => {
                      devConsole.log("User hidden successfully.");
                    }
                  );
                }}
                title={"Hide User"}
                icon={{ gficon: "visibility_off" }}
                style="danger"
              >
                Hide User
              </Button>
            )}
          </>
        )}

      {currentUser?.uid === props.id && (
        <Button
          href={"./edit"}
          title={"Edit"}
          icon={{ gficon: "edit" }}
          style="primary"
        >
          Edit
        </Button>
      )}
      {currentUserData?.info.role &&
        currentUserData?.info.role !== "user" &&
        currentUserData?.info.role !== "unverified" &&
        params.id && (
          <Button
            href={"./admin-edit"}
            title={"Admin Edit"}
            icon={{ gficon: "person_edit" }}
            style="primary"
          >
            Admin Edit
          </Button>
        )}
    </SidebarContainer>
  );
}
