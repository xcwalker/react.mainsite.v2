import HomeHero from "./Hero";
import HomeCarousel from "./Carousel";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";

export default function HomeIndex() {
  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <HomeHero />
      <HomeCarousel
        title="My Projects"
        titleLink={"projects"}
        onHome={true}
        itemType="projects"
      />
      <HomeRadio />
      <HomeCarousel
        title="My Blog"
        titleLink={"blog"}
        onHome={true}
        itemType="blog"
      />
      <HomeCarousel
        title="My Recipes"
        titleLink={"recipes"}
        onHome={true}
        itemType="recipes"
      />
      <HomeSites />
    </>
  );
}
