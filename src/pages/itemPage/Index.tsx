import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { ItemSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import ItemImages from "./Images";
import ItemCarousel from "../../components/ItemCarousel";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import removeMd from "remove-markdown";
import ErrorPage from "../../ErrorPage";
import { useEffect, useState } from "react";
import { ItemType, ItemTypes, RecipeItemProps } from "../../types";
import LoadingPage from "../../components/Loading";

import css from "../../styles/pages/itemPage/index.module.css";
import cssMarkdown from "../../styles/components/markdown.module.css";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import RecipeContent from "./RecipeContent";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import toTitleCase from "../../functions/toTitleCase";

export default function ItemPage(props: { itemType: ItemTypes }) {
  const { slug } = useParams();
  const [item, setItem] = useState<ItemType | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    firebaseGetRealtimeData(
      props.itemType,
      slug as string,
      setItem as React.Dispatch<React.SetStateAction<unknown>>,
      setError
    );

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
              {toTitleCase(item.data.title)} - {item.data.subTitle} {separator}{" "}
              {title}
            </title>
            <meta
              name="description"
              content={
                "An " +
                title +
                " " +
                toTitleCase(item.data.title) +
                ". " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              name="twitter:description"
              content={
                "An " +
                title +
                " " +
                toTitleCase(item.data.title) +
                ". " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              property="og:description"
              content={
                "An " +
                title +
                " " +
                toTitleCase(item.data.title) +
                ". " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            {/* Twitter Meta */}
            <meta
              name="twitter:title"
              content={
                toTitleCase(item.data.title) +
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
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                props.itemType +
                "/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={
                "https://xcwalker.dev/" +
                props.itemType +
                "/" +
                slug.toLowerCase()
              }
            />
            <meta
              property="og:title"
              content={
                toTitleCase(item.data.title) +
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
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                props.itemType +
                "/" +
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
                {props.itemType === "recipes" && (
                  <RecipeContent item={item as RecipeItemProps} />
                )}
                <ItemImages item={item} slug={slug} itemType={props.itemType} />
              </main>
            </SideBySide>
            <ItemCarousel
              itemType={props.itemType}
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={true}
              title={
                "More from the " + item.metaData.collectionName + " collection"
              }
            />
            <ItemCarousel
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
      {error && (
        <ErrorPage
          code={404}
          error={
            props.itemType.substring(0, props.itemType.length - 1) +
            " Not Found"
          }
        />
      )}
    </>
  );
}