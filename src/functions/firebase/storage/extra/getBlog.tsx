import firebaseGetData from "../getData";

export default function getBlog(slug: string) {
  firebaseGetData("blog", slug);
}
