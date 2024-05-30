import { useParams } from "react-router-dom";
import Section from "../components/Section";
import { projectsArray } from "../temp";
import SideBySide from "../components/SideBySide";
import { Sidebar } from "./project/Sidebar";
import Markdown from "react-markdown";
import Images from "./project/Images";
import css from "../styles/pages/project.module.css";
import Related from "./project/Related";

export default function Project() {
  const { slug } = useParams();
  const item = projectsArray.filter((item) => item.metaData.slug === slug)[0];
  return (
    <>
      <Section id="project">
        <SideBySide leftWidth="400px">
          <Sidebar item={item} />
          <main className={css.main}>
            <Markdown className={css.description}>
              {item.data.description}
            </Markdown>
            <Images item={item} />
          </main>
        </SideBySide>
        <Related item={item} sameCollection={true} title={"More from the " + item.metaData.collectionName + " collection"} />
        <Related item={item} sameCollection={false} title="More Projects" />
      </Section>
    </>
  );
}
