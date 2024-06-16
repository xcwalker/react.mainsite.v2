import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { recipesArray } from "../../temp";
import { Fragment } from "react/jsx-runtime";
import RecipeItem from "../../components/RecipeItem";
import { ButtonLink } from "../../components/Button";

export default function Recipes(props: { limit?: number, title: string }) {
  return (
    <Section id="projects" container={{ className: css.container }}>
      <h2>{props.title}</h2>
      <div className={css.slider}>
        {recipesArray.map((item, index) => {
          if (props.limit && index >= props.limit)
            return <Fragment key={index} />;
          else
            return (
              <Fragment key={index}>
                <RecipeItem slug={item.slug} />
              </Fragment>
            );
        })}
      </div>
      {props.limit && recipesArray.length > props.limit && (
        <ButtonLink href="/recipes" className={css.viewMore}>View More</ButtonLink>
      )}
    </Section>
  );
}
