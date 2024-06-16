import { Fragment } from "react/jsx-runtime";
import { ButtonLink } from "./Button";
import SocialBackground, { SocialIcon } from "./SocialIcon";
import css from "../styles/components/socials.module.css"

export default function Socials() {
  return (
    <div className={css.container}>
      <ul className={css.list}>
        {array.map((item, index) => {
          return (
            <Fragment key={index}>
              <ButtonLink
                href={item.url}
                title={item.icon}
                className={css.social}
              >
                <SocialIcon social={item.icon} />
                <SocialBackground social={item.icon} />
              </ButtonLink>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}

const array = [
  {
    icon: "Twitter",
    url: "http://www.twitter.com/xc_walker",
  },
  {
    icon: "Instagram",
    url: "https://instagram.com/xc_walker/",
  },
  {
    icon: "Youtube",
    url: "https://www.youtube.com/@xcwalker",
  },
  {
    icon: "Discord",
    url: "https://discordapp.com/users/358316209252597761",
  },
  {
    icon: "Twitch",
    url: "https://www.twitch.tv/xc_walker",
  },
  {
    icon: "TikTok",
    url: "https://www.tiktok.com/@xc_walker",
  },
];
