import HomeHero from "./Hero";
import HomeProjects from "./Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import HomeRecipes from "./Recipes";
import HomeBlog from "./Blog";

export default function HomeIndex() {
  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <HomeHero />
      <HomeProjects title="My Projects" titleLink={true} onHome={true} />
      <HomeRadio />
      <HomeBlog title="My Blog" titleLink={true} onHome={true} />
      <HomeRecipes title="My Recipes" titleLink={true} onHome={true} />
      <HomeSites />
    </>
  );
}
