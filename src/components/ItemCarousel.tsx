import { Fragment } from "react/jsx-runtime";
import GridItem from "./GridItem";
import css from "../styles/components/itemCarousel.module.css";
import { useEffect, useState } from "react";
import getDataByDateExcludeSlugAndSameCollection from "../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../functions/firebase/storage/getDataByDateExcludeSlug";
import { ItemType, ItemTypes } from "../types";
import Carousel from "./Carousel";
import ListItem from "./ListItem";
import getRealtimeDataByDateFromUser from "../functions/firebase/storage/useRealtimeDataByDateFromUser";

export default function ItemCarousel(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  userID?: string;
  title: string;
  itemType: ItemTypes;
  sortDirection?: {
    value: "asc" | "desc" | "alpha-asc" | "alpha-desc";
    set: React.Dispatch<React.SetStateAction<"asc" | "desc" | "alpha-asc" | "alpha-desc">>;
  };
}) {
  const [carouselItems, setCarouselItems] = useState<
    { id: string; value: ItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.userID) {
      getRealtimeDataByDateFromUser(
        props.itemType,
        props.userID,
        setCarouselItems as React.Dispatch<React.SetStateAction<unknown>>,
        props.sortDirection ? props.sortDirection.value : "desc"
      );
      return;
    } else if (props.collection && props.sameCollection === true) {
      getDataByDateExcludeSlugAndSameCollection(
        props.itemType,
        props.slug,
        props.collection,
        props.sortDirection ? props.sortDirection.value : "desc"
      ).then((data) => {
        setCarouselItems(data as { id: string; value: ItemType }[]);
      });
    } else if (props.collection && props.sameCollection === false) {
      getDataByDateExcludeSlugAndDifferentCollection(
        props.itemType,
        props.slug,
        props.collection,
        props.sortDirection ? props.sortDirection.value : "desc"
      ).then((data) => {
        setCarouselItems(data as { id: string; value: ItemType }[]);
      });
    } else {
      getDataByDateExcludeSlug(
        props.itemType,
        props.slug,
        props.sortDirection ? props.sortDirection.value : "desc"
      ).then((data) => {
        setCarouselItems(data as { id: string; value: ItemType }[]);
      });
    }

    return () => {
      // setCarouselItems(undefined);
    };
  }, [props]);

  return (
    <>
      {carouselItems && carouselItems.length != 0 && (
        <Carousel
          className={css.scroller}
          title={props.title}
          multipleViews={true}
          defaultView="column"
          listView={
            <>
              {carouselItems.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      date={item.value.metaData.date.created}
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      href={"/" + props.itemType + "/" + item.id}
                    />
                  </Fragment>
                );
              })}
            </>
          }
          sortDirection={props.sortDirection}
        >
          {carouselItems.map((item, index) => {
            return (
              <Fragment key={index}>
                <GridItem
                  slug={item.id}
                  item={item.value}
                  href={props.itemType}
                />
              </Fragment>
            );
          })}
        </Carousel>
      )}
    </>
  );
}
