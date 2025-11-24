import css from "../../styles/components/sidebarUser.module.css";
import { Link } from "react-router-dom";
import toTitleCase from "../../functions/toTitleCase";

type UserTypeSimple = {
  info: {
    displayName: string;
    role: string;
  };
  images: {
    profile?: string;
    background?: string;
    backgroundType?: "color" | "image" | "video";
    backgroundColor?: string;
    color?: string;
  };
};

export default function SidebarOrganization(props: {
  orgId?: string;
  className?: string;
  orgData?: UserTypeSimple;
}) {
  return (
    <Link
      className={css.author + (props.className ? " " + props.className : "")}
      to={"/organizations/" + props.orgId}
      style={{
        color: props.orgData?.images?.color
          ? props.orgData.images.color
          : undefined,
      }}
    >
      {props.orgData?.images.backgroundType === "color" && (
        <div
          className={css.background}
          style={{
            backgroundColor: props.orgData?.images.backgroundColor,
          }}
        />
      )}
      {props.orgData?.images.backgroundType === "image" &&
        props.orgData?.images.background && (
          <img
            src={props.orgData.images.background}
            alt=""
            className={css.background}
          />
        )}
      {props.orgData?.images.backgroundType === "video" &&
        props.orgData?.images.background && (
          <video
            src={props.orgData.images.background}
            className={css.background}
            autoPlay
            loop
            muted
            controls={false}
          />
        )}
      {!props.orgData?.images.backgroundType && (
        <div className={css.background} />
      )}
      <picture className={css.image}>
        {props.orgData?.images.profile && (
          <img
            src={props.orgData?.images.profile}
            className={
              css.profile
              //  + " " + css[userData?.about.status]
            }
            alt="Profile Picture"
          />
        )}

        {!props.orgData?.images.profile && (
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
        )}
      </picture>
      <div className={css.text}>
        <span className={css.title}>{props.orgData?.info.displayName}</span>
        {props.orgData?.info.role &&
          props.orgData?.info.role !== "unverified" && (
            <span className={css.role}>
              {toTitleCase(props.orgData?.info.role)}
            </span>
          )}
      </div>
    </Link>
  );
}
