import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import HomeProjects from "./home/Projects";

export default function ProjectsPage() {
  return (
    <>
      <Helmet>
        <title>
          Recipes {separator} {title}
        </title>
        <meta
          name="twitter:title"
          content={"Projects " + separator + " " + title}
        />
        <meta
          property="og:title"
          content={"Projects " + separator + " " + title}
        />
        <meta name="description" content={"Projects on " + title} />
        <meta name="twitter:description" content={"Projects on " + title} />
        <meta property="og:description" content={"Projects on " + title} />
        {/* Twitter Meta */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xcwalker.dev/projects/" />
      </Helmet>
      <HomeProjects title={"Projects"} titleLink={false} />
    </>
  );
}
