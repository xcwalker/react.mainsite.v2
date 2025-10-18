import { ItemTypes, VehicleItemType } from "../../types";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import Image from "../../components/Image";
import SidebarDates from "../../components/Sidebar/SidebarDates";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";

export function ItemSidebar(props: {
  item: VehicleItemType;
  vrn: string;
  itemType: ItemTypes;
}) {
  const item = props.item;

  return (
    <SidebarContainer>
      {props.item.metaData.thumbnail && (
        <Image
          src={props.item.metaData.thumbnail}
          alt="Thumbnail"
          className={css.thumbnail}
        />
      )}
      <SidebarTitle
        title={`${item.data.make} ${item.data.model}`}
        subtitle={`${item.data.year} | ${props.vrn}`}
      />
      <SidebarDates
        created={new Date(item.metaData.date.created)}
        modified={new Date(item.metaData.date.modified)}
      />
    </SidebarContainer>
  );
}
