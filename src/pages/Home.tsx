import Hero from "./home/Hero";
import Projects from "./home/Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import Sites from "./home/Sites";
import { Radio } from "./home/Radio";
import Recipes from "./home/Recipes";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <Hero />
      <Projects limit={3} title="Some of our projects" />
      <Radio />
      <Recipes limit={3} title="Some recipes" />
      <Sites />
    </>
  );
}
