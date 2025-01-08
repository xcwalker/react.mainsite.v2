import HomeHero from "./Hero";
import HomeProjects from "./Projects";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import HomeSites from "./Sites";
import { HomeRadio } from "./Radio";
import HomeRecipes from "./Recipes";
import HomeBlog from "./Blog";
import { useState } from "react";
import getRecipe from "../../functions/firebase/storage/extra/getRecipe";
import getRecipesByDate from "../../functions/firebase/storage/getDataByDate";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "../../functions/firebase/storage/setup";

export default function HomeIndex() {
  const [value, setValue] = useState("");

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
      <input
        type="text"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <button
        onClick={() => {
          getRecipe(value).then((res) => console.log(res));
        }}
      >
        Test Search
      </button>
      <button
        onClick={() => {
          getRecipesByDate().then((res) => console.log(res));
        }}
      >
        Test Get All
      </button>
    </>
  );
}
