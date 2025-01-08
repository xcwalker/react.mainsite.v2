import { RecipeItem } from "../../../../types";
import firebaseSetData from "../setData";

export default function setRecipe(slug: string, data: RecipeItem) {
  return firebaseSetData("recipes", slug, data);
}
