import HomeHero from "./Hero";
import HomeProjects from "./Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import HomeRecipes from "./Recipes";
import HomeBlog from "./Blog";
// import firebaseSetData from "../../functions/firebase/storage/setData";

export default function HomeIndex() {

  // const data = {
  //   data: {
  //     title: "The First Test Post",
  //     subTitle: "A Test (duh)",
  //     description:
  //       "*Emphasize*  _emphasize_\n\n**Strong**  __strong__\n\n==Marked text.==\n\n~~Mistaken text.~~\n\nH~2~O is a liquid.\n\n2^10^ is 1024.\n\n[This is a link](https://www.google.com)\n\n## Heading 1\n\n### Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6\n\n\n\n - Unordered List item 1\n\n - Unordered List item 2\n\n\n\n 1. Ordered List item 1\n\n 2. Ordered List item 2\n\n\n\n - [X] Checlist Item List item 1\n\n - [ ] Checlist Item List item 2\n\n\n\n> Blockquote\n\n\n\nasdasd\n\n|1|2|3|4|5|6|7|8|9|\n|--|--|--|--|--|--|--|--|--|\n|a|b|c|d|e|f|g|h|i|\n\n![random unsplash image](https://images.unsplash.com/photo-1733234976396-87cf34ae6038?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb)",
  //   },
  //   metaData: {
  //     date: {
  //       created: "2024-12-04T23:22:49.447Z",
  //       modified: "2025-01-05T18:51:57.820Z",
  //     },
  //     imageCount: 0,
  //     tags: ["test", "first", "duh"],
  //     collection: "test",
  //     collectionName: "testing",
  //     author: {
  //       name: "Xander Walker",
  //       image: {
  //         webpURL: "/common-images/authors/XanderWalker.webp",
  //         jpgURL: "/common-images/authors/XanderWalker.jpg",
  //       },
  //     },
  //   },
  // };

  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <HomeHero />
      <HomeProjects limit={3} title="My Projects" titleLink={true} />
      <HomeRadio />
      <HomeBlog limit={3} title="My Blog" titleLink={true} />
      <HomeRecipes limit={3} title="Some Recipes" titleLink={true} />
      <HomeSites />

      
      {/* <button
        onClick={() => {
          firebaseSetData("blog", "test-post", data).then((res) =>
            console.log(res)
          );
        }}
      >
        Set Data
      </button> */}
    </>
  );
}
