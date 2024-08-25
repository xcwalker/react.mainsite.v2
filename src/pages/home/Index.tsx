import HomeHero from "./Hero";
import HomeProjects from "./Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import HomeRecipes from "./Recipes";

export default function HomeIndex() {
  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <HomeHero />
      <HomeProjects limit={3} title="Some of our projects" />
      <HomeRadio />
      <HomeRecipes limit={3} title="Some recipes" />
      <HomeSites />
    </>
  );
}
