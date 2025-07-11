import { RecipeItemProps } from "../../../../types";
import firebaseSetData from "../setData";

export default function setRecipe(slug: string, data: RecipeItemProps) {
  return firebaseSetData("recipes", slug, data);
}
