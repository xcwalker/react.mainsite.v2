import { useParams, useSearchParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { AlbumSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import AlbumImages from "./Images";
import AlbumRelated from "./Related";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import removeMd from "remove-markdown";
import ErrorPage from "../../ErrorPage";
import { useEffect, useState } from "react";
import { AlbumItem } from "../../types";
import LoadingPage from "../../components/Loading";

import css from "../../styles/pages/project.module.css";
import { firebaseGetDataWithKey } from "../../functions/firebase/storage/getData";

export default function AlbumIndex() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [item, setItem] = useState<AlbumItem | undefined>(undefined);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(params.get("key") || "");
  const [input, setInput] = useState(true);

  useEffect(() => {
    firebaseGetDataWithKey("albums", slug as string, key as string).then(
      (data) => {
        console.log(data);
        if (data === undefined) {
          console.log("Album not found");
          setTimeout(() => {
          console.log("reset");
            setError(true);
            setInput(true);
          }, 2500);
          return;
        }
        setItem(data as AlbumItem);
      }
    );

    return () => {
      setItem(undefined);
      setError(false);
      setInput(true);
    };
  }, [slug, key]);

  return (
    <>
      {item && !error && slug && !input && (
        <>
          <Helmet>
            <title>
              {item.data.title} - {item.data.subTitle} {separator} {title}
            </title>
            <meta
              name="description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              name="twitter:description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              property="og:description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
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
          <Section id="album">
            <SideBySide leftWidth="350px">
              <AlbumSidebar item={item} slug={slug} />
              <main className={css.main}>
                <Markdown className={css.description}>
                  {item.data.description}
                </Markdown>
                <AlbumImages item={item} slug={slug} />
              </main>
            </SideBySide>
            <AlbumRelated
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={true}
              title={
                "More from the " + item.metaData.collectionName + " collection"
              }
            />
            <AlbumRelated
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={false}
              title="More Projects"
            />
          </Section>
        </>
      )}
      {item === undefined && !error && !input && <LoadingPage />}
      {/* {error && !input && <ErrorPage code={404} error="Project Not Found" />} */}
      {console.log(error, input)}
      {(error || input) && (
        <Section id="album-secure">
          <input
            type="text"
            name=""
            id=""
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setInput(false);
              setError(false);
            }}
          >
            Submit
          </button>
        </Section>
      )}
    </>
  );
}
