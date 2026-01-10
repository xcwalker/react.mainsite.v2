import { Fragment, useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import { ItemProps } from "../../types";
import getRealtimeDataByDateFromOrganization from "../../functions/firebase/storage/useRealtimeDataByDateFromOrganization";
import GridItem from "../../components/GridItem";
import ListItem from "../../components/ListItem";

export default function OrganizationsCarousel(props: {
  organizationId: string;
  title: string;
  itemType: "projects" | "blog" | "recipes";
  hasThumbnail: boolean;
}) {
  const { organizationId, title, itemType, hasThumbnail } = props;
  const [itemArray, setItemArray] = useState<
    { id: string; value: ItemProps }[] | undefined
  >();
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | "alpha-asc" | "alpha-desc"
  >("desc");

  useEffect(() => {
    getRealtimeDataByDateFromOrganization(
      itemType,
      organizationId,
      setItemArray as React.Dispatch<React.SetStateAction<unknown>>,
      sortDirection
    );
  }, [organizationId, itemType, sortDirection]);

  if (!itemArray || itemArray.length === 0) {
    return null;
  }

  return (
    <Carousel
      className="organizationCarousel"
      title={title}
      defaultView="grid"
      multipleViews={true}
      listView={
        <>
          {itemArray &&
            itemArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ListItem
                    title={item.value.data.title}
                    subTitle={item.value.data.subTitle}
                    date={item.value.metaData.date.created}
                    href={"/" + props.itemType + "/" + item.id}
                  />
                </Fragment>
              );
            })}
        </>
      }
      sortDirection={{ value: sortDirection, set: setSortDirection }}
    >
      <>
        {itemArray &&
          itemArray.map((item, index) => {
            return (
              <Fragment key={index}>
                <GridItem
                  slug={item.id}
                  item={item.value}
                  href={props.itemType}
                  hasThumbnail={hasThumbnail}
                />
              </Fragment>
            );
          })}
      </>
    </Carousel>
  );
}
