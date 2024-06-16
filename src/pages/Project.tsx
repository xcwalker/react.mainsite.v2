import { useParams } from "react-router-dom";
import Section from "../components/Section";
import SideBySide from "../components/SideBySide";
import { Sidebar } from "./project/Sidebar";
import Markdown from "react-markdown";
import Images from "./project/Images";
import css from "../styles/pages/project.module.css";
import Related from "./project/Related";
import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import removeMd from "remove-markdown";
import ErrorPage from "../ErrorPage";
import { useEffect, useState } from "react";
import { ProjectItem } from "../types";
import LoadingPage from "../components/Loading";

export default function Project() {
  const { slug } = useParams();
  const [item, setItem] = useState<ProjectItem | undefined>(undefined);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
        slug?.toLowerCase() +
        "/project.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setItem(data);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });

    return () => {
      setItem(undefined);
      setError(false);
    };
  }, [slug]);
  const [error, setError] = useState(false);
  return (
    <>
      {item && !error && slug && (
        <>
          <Helmet>
            <title>
              {item.data.title} - {item.data.subTitle} {separator} {title}
            </title>
            {item.data.description && (
              <>
                <meta
                  name="description"
                  content={
                    "An " +
                    title +
                    " project. " +
                    removeMd(item.data.description)
                  }
                />
                <meta
                  name="twitter:description"
                  content={
                    "An " +
                    title +
                    " project. " +
                    removeMd(item.data.description)
                  }
                />
                <meta
                  property="og:description"
                  content={
                    "An " +
                    title +
                    " project. " +
                    removeMd(item.data.description)
                  }
                />
              </>
            )}
            {/* Twitter Meta */}
            <meta
              name="twitter:title"
              content={
                item.data.title +
                " | " +
                item.data.subTitle +
                " " +
                separator +
                " " +
                title
              }
            />
            <meta
              name="twitter:image"
              content={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={"https://xcwalker.dev/projects/" + slug.toLowerCase()}
            />
            <meta
              property="og:title"
              content={
                item.data.title +
                " | " +
                item.data.subTitle +
                " " +
                separator +
                " " +
                title
              }
            />
            <meta
              property="og:image"
              content={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
          </Helmet>
          <Section id="project">
            <SideBySide leftWidth="400px">
              <Sidebar item={item} slug={slug} />
              <main className={css.main}>
                <Markdown className={css.description}>
                  {item.data.description}
                </Markdown>
                <Images item={item} slug={slug} />
              </main>
            </SideBySide>
            <Related
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={true}
              title={
                "More from the " + item.metaData.collectionName + " collection"
              }
            />
            <Related
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={false}
              title="More Projects"
            />
          </Section>
        </>
      )}
      {item === undefined && !error && <LoadingPage />}
      {error && <ErrorPage code={404} error="Project Not Found" />}
    </>
  );
}
