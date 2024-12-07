import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { RecipeSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import RecipeImages from "./Images";
import RecipeRelated from "./Related";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import removeMd from "remove-markdown";
import { useEffect, useState } from "react";
import { RecipeItem } from "../../types";
import Stack from "../../components/Stack";
import { RecipePrintSidebar } from "./PrintSidebar";
import ErrorPage from "../../ErrorPage";
import LoadingPage from "../../components/Loading";
import { decode } from "html-entities";

import css from "../../styles/pages/recipe.module.css";

export default function RecipeIndex() {
  const { slug } = useParams<string>();
  const [item, setItem] = useState<RecipeItem | undefined>(undefined);
  const [error, setError] = useState(false);
  const [canPassLoading, setCanPassLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
        slug?.toLowerCase() +
        "/recipe.json"
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanPassLoading(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      setCanPassLoading(false);
    };
  }, [slug]);

  return (
    <>
      {item !== undefined && !error && slug && canPassLoading && (
        <>
          <Helmet>
            <title>
              {item.data.title} - {item.data.subTitle} {separator} {title}
            </title>
            <meta
              name="description"
              content={
                "A " +
                title +
                " recipe. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              name="twitter:description"
              content={
                "A " +
                title +
                " recipe. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              property="og:description"
              content={
                "A " +
                title +
                " recipe. " +
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
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={"https://xcwalker.dev/recipes/" + slug.toLowerCase()}
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
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
          </Helmet>
          <Section id="recipe" className={css.recipe}>
            <SideBySide leftWidth="350px">
              <RecipeSidebar item={item} slug={slug} />
              <main className={css.main}>
                <Markdown className={css.description}>
                  {item.data.description}
                </Markdown>
                <div
                  className={css.instructions + " " + css.ingredients}
                  id="ingredients"
                >
                  <h3>Ingredients</h3>
                  <ul>
                    {item.data.ingredients &&
                      item.data.ingredients.map((item, index) => {
                        return <li key={index}>{decode(item)}</li>;
                      })}
                  </ul>
                </div>
                <div className={css.instructions + " " + css.prep} id="prep">
                  <h3>Prep</h3>
                  <ul>
                    {item.data.instructions.prep &&
                      item.data.instructions.prep.map((item, index) => {
                        return <li key={index}>{decode(item)}</li>;
                      })}
                  </ul>
                </div>
                <div
                  className={css.instructions + " " + css.cook}
                  id="instructions"
                >
                  <h3>Instructions</h3>
                  <ul>
                    {item.data.instructions.cook &&
                      item.data.instructions.cook.map((item, index) => {
                        return <li key={index}>{decode(item)}</li>;
                      })}
                  </ul>
                </div>
                <RecipeImages item={item} slug={slug} />
              </main>
            </SideBySide>
          </Section>

          <Section id="recipe-print" className={css.printRecipe}>
            <Stack>
              <RecipePrintSidebar item={item} slug={slug} />
              <main className={css.main}>
                <Markdown className={css.description}>
                  {item.data.description}
                </Markdown>
                <div className={css.instructions + " " + css.prep}>
                  <h3>Prep</h3>
                  <ul>
                    {item.data.instructions.prep &&
                      item.data.instructions.prep.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                  </ul>
                </div>
                <div className={css.instructions + " " + css.cook}>
                  <h3>Instructions</h3>
                  <ul>
                    {item.data.instructions.cook &&
                      item.data.instructions.cook.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                  </ul>
                </div>
              </main>
            </Stack>
          </Section>
          <RecipeRelated
            slug={slug}
            collection={item.metaData.collection}
            sameCollection={true}
            title={
              "More from the " + item.metaData.collectionName + " collection"
            }
          />
          <RecipeRelated
            slug={slug}
            collection={item.metaData.collection}
            sameCollection={false}
            title="More Recipes"
          />
        </>
      )}
      {((item === undefined && !error) || !canPassLoading) && <LoadingPage />}
      {(slug === undefined || error) && canPassLoading && (
        <ErrorPage code={404} error="Recipe Not Found" />
      )}
    </>
  );
}
