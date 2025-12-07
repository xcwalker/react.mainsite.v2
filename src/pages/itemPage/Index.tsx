import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { ItemSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import ItemImages from "./Images";
import ItemCarousel from "../../components/ItemCarousel";
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
import PageSeoWrapper from "../../components/PageSeoWrapper";

export default function ItemPage(props: { itemType: ItemTypes }) {
  const { slug } = useParams();
  const [item, setItem] = useState<ItemType | undefined>(undefined);
  const [error, setError] = useState(false);
  const [checklistMode, setChecklistMode] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "alpha-asc" | "alpha-desc">("desc");
  const [sortDirectionCollection, setSortDirectionCollection] = useState<
    "asc" | "desc" | "alpha-asc" | "alpha-desc"
  >("desc");

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
        <PageSeoWrapper
          title={`${toTitleCase(item.data.title)} ${separator} ${item.data.subTitle} ${separator} ${toTitleCase(props.itemType)} ${separator} ${title}`}
          description={removeMd(
            item.data.description ? item.data.description : ""
          )}
          image={item.metaData.thumbnail}
        >
          <Section id="project">
            <SideBySide leftWidth="350px" printLeftWidth="350px">
              <ItemSidebar
                itemType={props.itemType}
                item={item}
                slug={slug}
                checklistMode={checklistMode}
                setChecklistMode={setChecklistMode}
              />
              <main className={css.main}>
                {item.data.description.length > 0 && (
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
                )}
                {props.itemType === "recipes" && (
                  <RecipeContent
                    item={item as RecipeItemProps}
                    checklistMode={checklistMode}
                  />
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
              sortDirection={{
                value: sortDirectionCollection,
                set: setSortDirectionCollection,
              }}
            />
            <ItemCarousel
              itemType={props.itemType}
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={false}
              title={"More " + props.itemType}
              sortDirection={{ value: sortDirection, set: setSortDirection }}
            />
          </Section>
        </PageSeoWrapper>
      )}
      {item === undefined && !error && <LoadingPage />}
      {error && (
        <ErrorPage
          code={404}
          error={
            toTitleCase(
              props.itemType.charAt(props.itemType.length - 1) === "s"
                ? props.itemType.slice(0, -1)
                : props.itemType
            ) + " Not Found"
          }
        />
      )}
    </>
  );
}
