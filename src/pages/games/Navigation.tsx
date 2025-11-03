import games from "./games.json";
import GridItem from "../../components/GridItem";
import Section from "../../components/Section";
import Carousel from "../../components/Carousel";
import { Fragment } from "react/jsx-runtime";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";

export default function GameNavigation() {
  return (
    <PageSeoWrapper
      title={`Game Navigation ${separator} ${title}`}
      description="Browse and navigate through available games."
    >
      <Section id="game-navigation">
        <Carousel
          title="Games"
          defaultView="grid"
          className="game-carousel"
          multipleViews={false}
          hasChildViews={false}
        >
          {(import.meta.env.VITE_IS_DEVELOPMENT_BUILD === "true"
            ? games
            : games.filter((game) => !game.comingSoon)
          ).map((game) => (
            <Fragment key={game.name}>
              <GridItem
                href="games"
                slug={game.slug}
                item={{
                  metaData: {
                    date: {
                      modified: game.created,
                    },
                    thumbnail: game.preview,
                  },
                  data: {
                    title: game.name,
                    subTitle: game.subTitle,
                    description: game.subTitle || "",
                  },
                }}
              />
            </Fragment>
          ))}
        </Carousel>
      </Section>
    </PageSeoWrapper>
  );
}
