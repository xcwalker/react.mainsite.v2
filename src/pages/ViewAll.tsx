import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import HomeCarousel from "./home/Carousel";
import toTitleCase from "../functions/toTitleCase";

export default function ViewAllPage(props: {
  itemType: "recipes" | "blog" | "projects" | "albums";
  title: string;
  hasThumbnail: boolean;
}) {
  return (
    <>
      <Helmet>
        <title>
          {toTitleCase(props.itemType)} {separator} {title}
        </title>
        <meta
          name="twitter:title"
          content={toTitleCase(props.itemType) + " " + separator + " " + title}
        />
        <meta
          property="og:title"
          content={toTitleCase(props.itemType) + " " + separator + " " + title}
        />
        <meta
          name="description"
          content={toTitleCase(props.itemType) + " on " + title}
        />
        <meta
          name="twitter:description"
          content={toTitleCase(props.itemType) + " on " + title}
        />
        <meta
          property="og:description"
          content={toTitleCase(props.itemType) + " on " + title}
        />
        {/* Twitter Meta */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={"https://xcwalker.dev/" + props.itemType + "/"}
        />
      </Helmet>
      <HomeCarousel
        title={props.title}
        onHome={false}
        itemType={props.itemType}
        hasThumbnail={props.hasThumbnail}
      />
    </>
  );
}
