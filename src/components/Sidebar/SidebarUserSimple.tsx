import css from "../../styles/components/sidebarUser.module.css";
import toTitleCase from "../../functions/toTitleCase";

export default function SidebarUserSimple(props: {
  className?: string;
  name: string;
  email: string;
}) {
  return (
    <div
      className={css.author + (props.className ? " " + props.className : "")}
    >
      <div className={css.background} />
      <picture className={css.image}>
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
          className={
            css.profile
            //  + " " + css[userData?.about.status]
          }
          alt="Profile Picture"
        />
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
        <span className={css.title}>
          {props.name ? toTitleCase(props.name) : "Unknown User"}
        </span>
        <span className={css.subTitle}>
          {props.email ? props.email : "No email provided"}
        </span>
      </div>
    </div>
  );
}
