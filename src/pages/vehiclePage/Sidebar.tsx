import { ItemTypes,  VehicleItemType } from "../../types";
import Button from "../../components/Button";
import SidebarUser from "../../components/Sidebar/SidebarUser";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import Image from "../../components/Image";

export function ItemSidebar(props: {
  item: VehicleItemType;
  vrn: string;
  itemType: ItemTypes;
}) {
  const currentUser = useAuth();
  const item = props.item;
  const dateModified = new Date(item.metaData.date.modified);
  const dateCreated = new Date(item.metaData.date.created);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    second: undefined,
    minute: "numeric",
    hour: "numeric",
  };
  return (
    <div className={css.sidebar}>
      {props.item.metaData.thumbnail && <Image
        src={props.item.metaData.thumbnail}
        alt="Thumbnail"
        className={css.thumbnail}
      />}
      <div className={css.details}>
        <h3>
          {item.data.make} {item.data.model}
        </h3>
        <h4>{item.data.year} | {props.vrn}</h4>
      </div>
      <div className={css.dates}>
        <div className={css.created}>
          {dateCreated.toLocaleDateString(undefined, dateOptions)}
        </div>
        {item.metaData.date.created !== item.metaData.date.modified && (
          <div className={css.modified}>
            Last Modified:{" "}
            {dateModified.toLocaleDateString(undefined, dateOptions) ===
              dateCreated.toLocaleDateString(undefined, dateOptions) &&
              dateModified.toLocaleTimeString(undefined, timeOptions)}
            {dateModified.toLocaleDateString(undefined, dateOptions) !==
              dateCreated.toLocaleDateString(undefined, dateOptions) &&
              dateModified.toLocaleDateString(undefined, dateOptions)}
          </div>
        )}
      </div>
      {item.metaData.authorID && (
        <SidebarUser userId={item.metaData.authorID} />
      )}
      <div className={css.links}>
        {currentUser?.uid === props.item.metaData.authorID && (
          <Button
            href={"./edit"}
            title={"Edit " + props.vrn}
            icon={{ gficon: "edit" }}
            style="primary"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
