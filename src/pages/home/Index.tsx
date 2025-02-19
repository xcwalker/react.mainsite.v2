import HomeHero from "./Hero";
import HomeProjects from "./Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import HomeRecipes from "./Recipes";
import HomeBlog from "./Blog";
import firebaseSetData from "../../functions/firebase/storage/setData";

export default function HomeIndex() {

  const data = {
    data: {
      title: "Dodge Ram",
      subTitle: "XCW Photon Series",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam, in temporibus laborum, non est deleniti eum hic, ipsam recusandae dolor impedit? Cumque odit sapiente explicabo minus ea voluptatum eaque illo.",
    },
    metaData: {
      date: {
        created: "2024-05-20T15:38:37.234Z",
        modified: "2024-05-20T15:38:37.234Z",
      },
      slug: "xcw-dodge_ram",
      imageCount: 9,
      tags: ["gmod", "photon", "lua"],
      collection: "gmod",
      collectionName: "garry's mod",
      repoName: "gmod",
      subRepo: true,
      workshop:
        "https://steamcommunity.com/sharedfiles/filedetails/?id=3082493539",
      author: {
        name: "Xander Walker",
        image: {
          webpURL: "/common-images/authors/XanderWalker.webp",
          jpgURL: "/common-images/authors/XanderWalker.jpg",
        },
      },
    },
  };



  return (
    <>
      <Helmet>
        <title>
          Home {separator} {title}
        </title>
      </Helmet>
      <HomeHero />
      <HomeProjects title="My Projects" titleLink={true} onHome={true} />
      <HomeRadio />
      <HomeBlog title="My Blog" titleLink={true} onHome={true} />
      <HomeRecipes title="My Recipes" titleLink={true} onHome={true} />
      <HomeSites />

      <button
        onClick={() => {
          firebaseSetData("projects", "xcw-dodge_ram", data).then((res) =>
            console.log(res)
          );
        }}
      >
        Set Data
      </button>
    </>
  );
}
