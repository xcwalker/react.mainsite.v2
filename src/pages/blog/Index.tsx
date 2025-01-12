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
import getBlog from "../../functions/firebase/storage/extra/getBlog";

export default function BlogIndex() {
  const { slug } = useParams();
  const [item, setItem] = useState<BlogItem | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    // fetch(
    //   "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/blog/" +
    //     slug?.toLowerCase() +
    //     "/blog.json"
    // )
    //   .then((res) => {
    //     return res.json();
    //   })
    getBlog(slug?.toLowerCase() as string).then((data) => {
      console.log(data);
      if (data === undefined) setError(true);
      else setItem(data);
    });

    return () => {
      setItem(undefined);
      setError(false);
    };
  }, [slug]);

  return (
    <>
      {item && !error && slug && (
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
                  {item.data.description}
                  {/* {testData} */}
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
      {((item === undefined && !error)) && <LoadingPage />}
      {error && (
        <ErrorPage code={404} error="Blog Post Not Found" />
      )}
    </>
  );
}
