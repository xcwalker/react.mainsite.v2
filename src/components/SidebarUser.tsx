import { useEffect, useState } from "react";
import css from "../styles/components/sidebarUser.module.css";
import { UserType } from "../types";
import { Link } from "react-router-dom";
import firebaseGetRealtimeData from "../functions/firebase/storage/useRealtimeData";

export default function SidebarUser(props: {
  userId: string;
  className?: string;
}) {
  const [userData, setUserData] = useState<UserType | undefined>();

  useEffect(() => {
    firebaseGetRealtimeData(
      "users",
      props.userId,
      setUserData as React.Dispatch<React.SetStateAction<unknown>>
    );

    return () => {
      setUserData(undefined);
    };
  }, [props.userId]);

  return (
    <Link
      className={css.author + (props.className ? " " + props.className : "")}
      to={"/user/" + props.userId}
    >
      {userData?.images.background && (
        <>
          {userData?.images.backgroundType === "image" && (
            <img
              src={userData?.images.background}
              alt=""
              className={css.background}
            />
          )}
          {userData?.images.backgroundType === "video" && (
            <video
              src={userData?.images.background}
              className={css.background}
              autoPlay
              loop
              muted
              controls={false}
            />
          )}
        </>
      )}
      {!userData?.images.background && <div className={css.background} />}
      <picture className={css.image}>
        {userData?.images.profile && (
          <img
            src={userData?.images.profile}
            className={css.profile + " " + css[userData?.about.status]}
            alt="Profile Picture"
          />
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 340 340"
          className={css.profile + " " + css.placeholder}
        >
          <path
            fill="#DDD"
            d="M169 .5a169 169 0 1 0 2 0zm0 86a76 76 0 1 1-2 0zM57 287q27-35 67-35h92q40 0 67 35a164 164 0 0 1-226 0"
          />
        </svg>
      </picture>
      <div className={css.text}>
        <span className={css.title}>{userData?.about.displayName}</span>
        <span className={css.subTitle}>
          @
          {userData?.about.userName +
            " | " +
            userData?.about.firstName +
            " " +
            userData?.about.lastName}
        </span>
      </div>
    </Link>
  );
}
