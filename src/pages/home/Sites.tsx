import { Link } from "react-router-dom";
import Section from "../../components/Section";
import css from "../../styles/pages/home/sites.module.css";
import { Fragment } from "react/jsx-runtime";

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
  );
}

const websites = [
  {
    icon: "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
    background: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7",
    name: "Immersion",
    url: "immersion.xcwalker.dev",
  },
  {
    icon: "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
    background: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7",
    name: "Searrson",
    url: "searrson.xcwalker.dev",
  },
  {
    icon: "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
    background: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7",
    name: "Therwim",
    url: "therwim.xcwalker.dev",
  },
];
