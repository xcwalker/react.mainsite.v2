import { useState } from "react";
import Hero from "./home/Hero";
import Button from "../components/Button";
import SecurityWarning from "../components/Security/Warning";
import Projects from "./home/Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../App";
import Sites from "./home/Sites";
import { Radio } from "./home/Radio";
import Recipes from "./home/Recipes";

export default function Home() {
  const [modalVisibility, setModalVisibility] = useState(false);
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
