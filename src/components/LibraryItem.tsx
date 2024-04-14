import css from "../styles/components/libraryItem.module.css";
import {Link} from "react-router-dom";
import LibraryImage from "./LibraryImage";
import { LibraryItemType } from "../types";

export default function LibraryItem(props: LibraryItemType) {
  const data = props.data;
  const metadata = props.metadata;

  return (
    <li className={css.libraryItem}>
      <Link to={metadata.route + metadata.url}>
        <LibraryImage {...props.image} />
        <span className={css.title}>{data.title}</span>
        {data.subtitle && <span className={css.subtitle}>{data.subtitle}</span>}
      </Link>
    </li>
  );
}