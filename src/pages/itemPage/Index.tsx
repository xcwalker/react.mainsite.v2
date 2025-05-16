import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { ItemSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import ItemImages from "./Images";
import ItemRelated from "./Related";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import removeMd from "remove-markdown";
import ErrorPage from "../../ErrorPage";
import { useEffect, useState } from "react";
import { ItemType, ProjectItem, RecipeItem } from "../../types";
import LoadingPage from "../../components/Loading";

import css from "../../styles/pages/itemPage/index.module.css";
import cssMarkdown from "../../styles/components/markdown.module.css";
import firebaseGetData from "../../functions/firebase/storage/getData";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import RecipeContent from "./RecipeContent";

export default function ItemPage(
  props: {itemType: "projects" | "recipes" | "albums" | "blog"}
) {
  const { slug } = useParams();
  const [item, setItem] = useState<ItemType | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    firebaseGetData(props.itemType, slug as string).then((data) => {
      if (data === undefined) {
        setError(true);
        return;
      }
      setItem(data as ProjectItem);
    });

    return () => {
      setItem(undefined);
      setError(false);
    };
  }, [slug, props.itemType]);

  return (
    <>
      {item && !error && slug && (
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
          <Section id="project">
            <SideBySide leftWidth="350px">
              <ItemSidebar itemType={props.itemType} item={item} slug={slug} />
              <main className={css.main}>
                <Markdown
                  remarkPlugins={[
                    [remarkGfm, { singleTilde: false }],
                    supersub,
                  ]}
                  className={css.description + " " + cssMarkdown.markdown}
                >
                  {item.data.description}
                  {/* {testData} */}
                </Markdown>
                {props.itemType === "recipes" && <RecipeContent item={item as RecipeItem} />}
                <ItemImages item={item} slug={slug} itemType={props.itemType} />
              </main>
            </SideBySide>
            <ItemRelated
              itemType={props.itemType}
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={true}
              title={
                "More from the " + item.metaData.collectionName + " collection"
              }
            />
            <ItemRelated
              itemType={props.itemType}
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={false}
              title={"More " + props.itemType}
            />
          </Section>
        </>
      )}
      {item === undefined && !error && <LoadingPage />}
      {error && <ErrorPage code={404} error="Project Not Found" />}
    </>
  );
}
