import { Link } from "react-router-dom";
import Section from "../../components/Section";
import css from "../../styles/pages/home/sites.module.css";
import { Fragment } from "react/jsx-runtime";
import GFIcon from "../../components/GFIcon";
import { defaultNav } from "../../types";

export default function HomeSites() {
  return (
    <Section id="sites">
      <h2>Our other sites</h2>
      <div className={css.sites}>
        {defaultNav.filter(item => item.title === "Sites")[0].items.map((item, index) => {
          return (
            <Fragment key={index}>
              <SiteItem site={{ icon: item.gficon, name: item.title, url: item.href }} />
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
    <Link className={css.site} to={props.site.url}>
      <GFIcon className={css.icon}>{props.site.icon}</GFIcon>
      <div className={css.container}>
        <h3>{props.site.name}</h3>
        <span>{props.site.url.replace("https://", "").replace("http://", "").replace("/", "")}</span>
      </div>
    </Link>
  );
}