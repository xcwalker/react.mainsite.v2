import { Link } from "react-router-dom";
import Section from "../../components/Section";
import css from "../../styles/pages/home/sites.module.css";
import { Fragment } from "react/jsx-runtime";
import GFIcon from "../../components/GFIcon";

export default function HomeSites() {
  return (
    <Section id="sites">
      <h2>Our other sites</h2>
      <div className={css.sites}>
        {websites.map((item, index) => {
          return (
            <Fragment key={index}>
              <SiteItem site={item} />
            </Fragment>
          );
        })}
      </div>
    </Section>
  );
}

function SiteItem(props: {
  site: { icon: string; name: string; url: string };
}) {
  return (
    <Link className={css.site} to={"https://" + props.site.url}>
      <GFIcon className={css.icon}>{props.site.icon}</GFIcon>
      <div className={css.container}>
        <h3>{props.site.name}</h3>
        <span>{props.site.url}</span>
      </div>
    </Link>
  );
}

const websites = [
  {
    icon: "grid_view",
    name: "Immersion",
    url: "immersion.xcwalker.dev",
  },
  {
    icon: "wallpaper_slideshow",
    name: "Searrson",
    url: "searrson.xcwalker.dev",
  },
  {
    icon: "web",
    name: "Therwim",
    url: "therwim.xcwalker.dev",
  },
];
