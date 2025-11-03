import { separator, title } from "../App";
import HomeCarousel from "./home/Carousel";
import PageSeoWrapper from "../components/PageSeoWrapper";

export default function BlogPage() {
  return (
    <PageSeoWrapper
      title={`Blog ${separator} ${title}`}
      description={`Blog on ${title}`}
    >
      <HomeCarousel
        title="My Blog"
        onHome={false}
        itemType="blog"
        hasThumbnail={false}
      />
    </PageSeoWrapper>
  );
}
