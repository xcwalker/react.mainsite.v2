import { Link } from "react-router-dom";
import Section from "../../components/Section";
import css from "../../styles/pages/home/sites.module.css";
import { Fragment } from "react/jsx-runtime";

import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";

export default function Sites() {
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
  site: { icon: string; background: string; name: string; url: string };
}) {
  return (
    <HoverCard scaleFactor={0.7}>
      <Link className={css.site} to={props.site.url}>
        <img src={props.site.icon} className={css.icon} alt="" />
        <img src={props.site.background} className={css.background} alt="" />
        <div className={css.container}>
          <div className={css.info}>
            <h3>{props.site.name}</h3>
            <span>{props.site.url}</span>
          </div>
        </div>
      </Link>
    </HoverCard>
  );
}

const websites = [
  {
    icon: "https://reactradio.dev/favicon.svg",
    background: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7",
    name: "ReactRadio",
    url: "www.reactradio.dev",
  },
  {
    icon: "https://reactradio.dev/favicon.svg",
    background: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7",
    name: "ReactRadio",
    url: "www.reactradio.dev",
  },
];
