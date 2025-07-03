import { BlogItemProps } from "../../../../types";
import firebaseGetData from "../getData";

export default function getBlog(slug: string) {
  return firebaseGetData("blog", slug) as Promise<BlogItemProps | undefined>;
}
