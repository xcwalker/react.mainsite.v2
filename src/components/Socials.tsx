import { Fragment } from "react/jsx-runtime";
import Button from "./Button";
import SocialBackground, { SocialIcon } from "./SocialIcon";
import css from "../styles/components/socials.module.css";

export default function Socials() {
  return (
    <div className={css.container}>
      <SocialsList />
    </div>
  );
}

export function SocialsList(props: {
  listClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  externalClassName?: string;
  contentClassName?: string;
  textClassName?: string;
  useUnstyledButton?: boolean;
}) {
  return (
    <ul className={props.listClassName ? props.listClassName : css.list}>
      {array.map((item, index) => {
        return (
          <Fragment key={index}>
            {!props.useUnstyledButton && (
              <Button
                href={item.url}
                title={item.icon}
                className={props.buttonClassName ? "" : css.social}
              >
                <SocialIcon
                  social={item.icon}
                  className={props.iconClassName}
                />
                <SocialBackground social={item.icon} />
              </Button>
            )}
            {props.useUnstyledButton && (
              <Button
                href={item.url}
                title={item.icon}
                className={props.buttonClassName ? props.buttonClassName : ""}
                icon={{
                  inline: (
                    <SocialIcon
                      social={item.icon}
                      className={props.iconClassName}
                    />
                  ),
                }}
                external
                externalClassName={props.externalClassName}
              >
                <span className={props.textClassName ? props.textClassName : ""}>{item.icon}</span>
              </Button>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}

const array = [
  {
    icon: "Twitter",
    url: "https://xcw.one/social/twitter",
  },
  {
    icon: "Instagram",
    url: "https://xcw.one/social/instagram",
  },
  {
    icon: "Youtube",
    url: "https://xcw.one/social/youtube",
  },
  {
    icon: "Discord",
    url: "https://xcw.one/social/discord",
  },
  {
    icon: "Twitch",
    url: "https://xcw.one/social/twitch",
  },
  {
    icon: "TikTok",
    url: "https://xcw.one/social/tiktok",
  },
];
