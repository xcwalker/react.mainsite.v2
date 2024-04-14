import css from "../styles/components/LibraryImage.module.css";
import GFIcon from "./GFIcon";
import { LibraryImageType } from "../types";

export default function LibraryImage(props: LibraryImageType ) {

  return (
    <div className={css.image}>
      <img src={props.url} alt={props.title ? "The artwork for " + props.title : ""} />
      <div className={css.noImage}>
        <GFIcon>no_photography</GFIcon>
      </div>
    </div>
  );
}
