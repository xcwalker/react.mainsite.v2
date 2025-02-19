import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";
import { RecipeItem as RecipeItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";

export default function HomeRecipes(props: {
  title: string;
  titleLink: boolean;
  onHome?: boolean;
}) {
  const [recipesArray, setRecipesArray] = useState<
    { id: string; value: RecipeItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.onHome) {
      getDataByDateFromUser("recipes", import.meta.env.VITE_MAIN_USER_ID).then(
        (data) => {
          setRecipesArray(data as { id: string; value: RecipeItemType }[]);
        }
      );
    } else {
      getDataByDate("recipes").then((data) => {
        setRecipesArray(data as { id: string; value: RecipeItemType }[]);
      });
    }

    return () => {
      setRecipesArray(undefined);
    };
  }, []);

  return (
    <Section id="recipes" container={{ className: css.container }}>
      <Carousel
        className={css.slider}
        title={props.title}
        multipleViews={true}
        defaultView={props.onHome ? "column" : "grid"}
        titleLink={
          props.titleLink ? { text: "View All", href: "/recipe" } : undefined
        }
        listView={<>
          {recipesArray &&
            recipesArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ListItem title={item.value.data.title} subTitle={item.value.data.subTitle} date={item.value.metaData.date.created} href={"/recipe/" + item.id}/>
                </Fragment>
              );
            })}
        </>}
      >
        <>
          {recipesArray &&
            recipesArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <RecipeItem item={item.value} slug={item.id} />
                </Fragment>
              );
            })}
        </>
      </Carousel>
    </Section>
  );
}
