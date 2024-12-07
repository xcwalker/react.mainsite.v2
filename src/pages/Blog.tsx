import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import HomeBlog from "./home/Blog";

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>
          Blog {separator} {title}
        </title>
        <meta
          name="twitter:title"
          content={"Blog " + separator + " " + title}
        />
        <meta
          property="og:title"
          content={"Blog " + separator + " " + title}
        />
        <meta name="description" content={"Blog on " + title} />
        <meta name="twitter:description" content={"Blog on " + title} />
        <meta property="og:description" content={"Blog on " + title} />
        {/* Twitter Meta */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xcwalker.dev/Blog/" />
      </Helmet>
      <HomeBlog title={"Blog"} titleLink={false} />
    </>
  );
}
