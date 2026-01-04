import HomeHero from "./Hero";
import HomeCarousel from "./Carousel";
import { HomeSettingsAtom, separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { useAtomValue } from "jotai";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function HomeIndex() {
  const homeSettings = useAtomValue(HomeSettingsAtom);
  const currentUser = useAuth();

  return (
    <PageSeoWrapper
      title={`Home ${separator} ${title}`}
      description={`Welcome to Awesome ${separator} ${title} ${separator} Explore projects, blog posts, recipes, and more!`}
    >
      <HomeHero
        showHero={homeSettings && currentUser ? homeSettings.showHero !== false : true}
      />
      <HomeCarousel
        title="Projects"
        titleLink={"projects"}
        onHome={true}
        itemType="projects"
        hasThumbnail={true}
      />
      <HomeRadio />
      <HomeCarousel
        title="Blog"
        titleLink={"blog"}
        onHome={true}
        itemType="blog"
        hasThumbnail={false}
      />
      <HomeCarousel
        title="Recipes"
        titleLink={"recipes"}
        onHome={true}
        itemType="recipes"
        hasThumbnail={true}
      />
      <HomeSites />
    </PageSeoWrapper>
  );
}
