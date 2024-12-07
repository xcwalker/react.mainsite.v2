import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { BlogSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import BlogImages from "./Images";
import BlogRelated from "./Related";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import removeMd from "remove-markdown";
import ErrorPage from "../../ErrorPage";
import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";
import { BlogItem } from "../../types";

import css from "../../styles/pages/project.module.css";
import cssMarkdown from "../../styles/components/markdown.module.css";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";

export default function BlogIndex() {
  const { slug } = useParams();
  const [item, setItem] = useState<BlogItem | undefined>(undefined);
  const [error, setError] = useState(false);
  const [canPassLoading, setCanPassLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/blog/" +
        slug?.toLowerCase() +
        "/blog.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setItem(data);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });

    return () => {
      setItem(undefined);
      setError(false);
    };
  }, [slug]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanPassLoading(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      setCanPassLoading(false);
    };
  }, [slug]);

  return (
    <>
      {item && !error && slug && canPassLoading && (
        <>
          <Helmet>
            <title>
              {item.data.title} - {item.data.subTitle} {separator} {title}
            </title>
            <meta
              name="description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              name="twitter:description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            <meta
              property="og:description"
              content={
                "An " +
                title +
                " project. " +
                removeMd(item.data.description ? item.data.description : "")
              }
            />
            {/* Twitter Meta */}
            <meta
              name="twitter:title"
              content={
                item.data.title +
                " | " +
                item.data.subTitle +
                " " +
                separator +
                " " +
                title
              }
            />
            <meta
              name="twitter:image"
              content={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={"https://xcwalker.dev/projects/" + slug.toLowerCase()}
            />
            <meta
              property="og:title"
              content={
                item.data.title +
                " | " +
                item.data.subTitle +
                " " +
                separator +
                " " +
                title
              }
            />
            <meta
              property="og:image"
              content={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
                slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
            />
          </Helmet>
          <Section id="project">
            <SideBySide leftWidth="350px">
              <BlogSidebar item={item} slug={slug} />
              <main className={css.main}>
                <Markdown
                  remarkPlugins={[
                    [remarkGfm, { singleTilde: false }],
                    supersub,
                  ]}
                  className={css.description + " " + cssMarkdown.markdown}
                >
                  {/* {item.data.description} */}
                  {testData}
                </Markdown>
                <BlogImages item={item} slug={slug} />
              </main>
            </SideBySide>
            <BlogRelated
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={true}
              title={
                "More from the " + item.metaData.collectionName + " collection"
              }
            />
            <BlogRelated
              slug={slug}
              collection={item.metaData.collection}
              sameCollection={false}
              title="More Projects"
            />
          </Section>
        </>
      )}
      {((item === undefined && !error) || !canPassLoading) && <LoadingPage />}
      {error && canPassLoading && (
        <ErrorPage code={404} error="Project Not Found" />
      )}
    </>
  );
}

const testData =
  "*Emphasize*  _emphasize_\n\n**Strong**  __strong__\n\n==Marked text.==\n\n~~Mistaken text.~~\n\nH~2~O is a liquid.\n\n2^10^ is 1024.\n\n[This is a link](https://www.google.com)\n\n# Heading 1\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6\n\n\n\n - Unordered List item 1\n\n - Unordered List item 2\n\n\n\n 1. Ordered List item 1\n\n 2. Ordered List item 2\n\n\n\n - [X] Checlist Item List item 1\n\n - [ ] Checlist Item List item 2\n\n\n\n> Blockquote\n\n\n\n    asdasd\n\n| 1 | 2 |\n|--|--|\n|a|b|\n\n![random unsplash image](https://images.unsplash.com/photo-1733234976396-87cf34ae6038?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb)";
