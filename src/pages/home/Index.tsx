import HomeHero from "./Hero";
import HomeCarousel from "./Carousel";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import PageSeoWrapper from "../../components/PageSeoWrapper";

export default function HomeIndex() {
  return (
    <PageSeoWrapper
      title={`Home ${separator} ${title}`}
      description={`Welcome to Awesome ${separator} ${title} ${separator} Explore projects, blog posts, recipes, and more!`}
    >
      <HomeHero />
      <HomeCarousel
        title="My Projects"
        titleLink={"projects"}
        onHome={true}
        itemType="projects"
        hasThumbnail={true}
      />
      <HomeRadio />
      <HomeCarousel
        title="My Blog"
        titleLink={"blog"}
        onHome={true}
        itemType="blog"
        hasThumbnail={false}
      />
      <HomeCarousel
        title="My Recipes"
        titleLink={"recipes"}
        onHome={true}
        itemType="recipes"
        hasThumbnail={true}
      />
      <HomeSites />
    </PageSeoWrapper>
  );
}
