import { UserType } from "../../types";
import css from "../../styles/pages/user/sidebar.module.css";
import Button from "../../components/Button";

export default function Sidebar(props: { user: UserType }) {
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

  return (
    <div className={css.sidebar}>
      <div className={css.user}>
        {props.user.images.background && (
          <>
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
      <ul className={css.links}>
        {props.user.links &&
          props.user.links.length > 0 &&
          props.user.links.map((item, index) => {
            // const matches = item.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
            // const domain = matches && matches[1];
            // console.log(domain);

            const url = new URL(item);
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
    </div>
  );
}
