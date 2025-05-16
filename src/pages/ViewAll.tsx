import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import HomeCarousel from "./home/Carousel";

export default function ViewAllPage(props: {
  itemType: "recipes" | "blog" | "projects" | "albums";
  title: string;
}) {
  return (
    <>
      <Helmet>
        <title>
          {props.itemType} {separator} {title}
        </title>
        <meta
          name="twitter:title"
          content={props.itemType + " " + separator + " " + title}
        />
        <meta
          property="og:title"
          content={props.itemType + " " + separator + " " + title}
        />
        <meta name="description" content={props.itemType + " on " + title} />
        <meta
          name="twitter:description"
          content={props.itemType + " on " + title}
        />
        <meta
          property="og:description"
          content={props.itemType + " on " + title}
        />
        {/* Twitter Meta */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://xcwalker.dev/" + props.itemType + "/"} />
      </Helmet>
      <HomeCarousel
        title={props.title}
        onHome={false}
        itemType={props.itemType}
      />
    </>
  );
}
