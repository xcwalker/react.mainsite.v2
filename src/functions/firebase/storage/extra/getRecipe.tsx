import { RecipeItem } from "../../../../types";
import firebaseGetData from "../getData";

export default function getRecipe(slug: string) {
  return firebaseGetData("recipes", slug) as Promise<RecipeItem | undefined>;
}
