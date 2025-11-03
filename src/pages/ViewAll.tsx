import { separator, title } from "../App";
import HomeCarousel from "./home/Carousel";
import toTitleCase from "../functions/toTitleCase";
import PageSeoWrapper from "../components/PageSeoWrapper";

export default function ViewAllPage(props: {
  itemType: "recipes" | "blog" | "projects" | "albums" | "videos";
  title: string;
  hasThumbnail: boolean;
}) {
  return (
    <PageSeoWrapper
      title={`${toTitleCase(props.itemType)} ${separator} ${title}`}
      description={`${toTitleCase(props.itemType)} on ${title}`}
    >
      <HomeCarousel
        title={props.title}
        onHome={false}
        itemType={props.itemType}
        hasThumbnail={props.hasThumbnail}
      />
    </PageSeoWrapper>
  );
}
