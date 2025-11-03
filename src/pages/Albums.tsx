import { separator, title } from "../App";
import HomeAlbums from "./home/Albums";
import PageSeoWrapper from "../components/PageSeoWrapper";

export default function AlbumsPage() {
  return (
    <PageSeoWrapper
      title={`Recipes ${separator} ${title}`}
      description={`Projects on ${title}`}
    >
      <HomeAlbums title={"Albums"} titleLink={false} />
    </PageSeoWrapper>
  );
}
