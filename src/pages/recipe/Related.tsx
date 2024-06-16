import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import { recipesArray } from "../../temp";
import css from "../../styles/pages/project/related.module.css";
import RecipeItem from "../../components/RecipeItem";

export default function Related(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const otherProjects = recipesArray.filter(
    (recipe) =>
      props.slug && recipe.slug.toLowerCase() !== props.slug.toLowerCase() &&
      ((!props.sameCollection && recipe.collection !== props.collection) ||
        (props.sameCollection && recipe.collection === props.collection))
  );

  return (
    <>
      {otherProjects.length != 0 && (
        <Section id="related" container={{ className: css.container }}>
          <h2>{props.title}</h2>
          <div className={css.scroller}>
            {otherProjects.map((item, index) => {
              return (
                <Fragment key={index}>
                  <RecipeItem slug={item.slug} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
