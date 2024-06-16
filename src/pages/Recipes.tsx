import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import Recipes from "./home/Recipes";

export default function RecipesPage() {
  return (
    <>
      <Helmet>
        <title>
          Recipes {separator} {title}
        </title>
        <meta
          name="twitter:title"
          content={"Recipes " + separator + " " + title}
        />
        <meta
          property="og:title"
          content={"Recipes " + separator + " " + title}
        />
        <meta name="description" content={"Recipes on " + title} />
        <meta name="twitter:description" content={"Recipes on " + title} />
        <meta property="og:description" content={"Recipes on " + title} />
        {/* Twitter Meta */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://xcwalker.dev/recipes/"} />
      </Helmet>
      <Recipes title="Recipes" />
    </>
  );
}
