import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import GridItem from "../../components/GridItem";
import { useEffect, useState } from "react";
import { ItemProps, ItemTypes } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useAtomValue } from "jotai";
import { HomeSettingsAtom } from "../../App";

export default function HomeCarousel(props: {
  title: string;
  titleLink?: ItemTypes;
  onHome?: boolean;
  itemType: ItemTypes;
  hasThumbnail: boolean;
}) {
  const currentUser = useAuth();
  const [itemArray, setItemArray] = useState<
    { id: string; value: ItemProps }[] | undefined
  >();
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | "alpha-asc" | "alpha-desc"
  >("desc");
  const homeSettings = useAtomValue(HomeSettingsAtom);

  useEffect(() => {
    if (props.onHome) {
      if (homeSettings?.filter && currentUser) {
        const filter = homeSettings.filter;

        if (filter === "own") {
          getDataByDateFromUser(
            props.itemType,
            currentUser.uid,
            sortDirection
          ).then((data) => {
            setItemArray(data as { id: string; value: ItemProps }[]);
          });
        } else if (filter === "xcwalker") {
          getDataByDateFromUser(
            props.itemType,
            import.meta.env.VITE_MAIN_USER_ID,
            sortDirection
          ).then((data) => {
            setItemArray(data as { id: string; value: ItemProps }[]);
          });
        } else {
          getDataByDate(props.itemType, sortDirection).then((data) => {
            setItemArray(data as { id: string; value: ItemProps }[]);
          });
        }
      } else {
        getDataByDateFromUser(
          props.itemType,
          currentUser ? currentUser.uid : import.meta.env.VITE_MAIN_USER_ID,
          sortDirection
        ).then((data) => {
          setItemArray(data as { id: string; value: ItemProps }[]);
        });
      }
    } else {
      getDataByDate(props.itemType, sortDirection).then((data) => {
        setItemArray(data as { id: string; value: ItemProps }[]);
      });
    }

    return () => {
      setItemArray(undefined);
    };
  }, [
    props.onHome,
    props.itemType,
    currentUser,
    sortDirection,
    homeSettings?.filter,
  ]);

  const titles = [
    {
      value: "own",
      label: "Your " + props.title,
    },
    {
      value: "all",
      label: "All " + props.title,
    },
    {
      value: "xcwalker",
      label: "XCWalker's " + props.title,
    },
  ];

  const title = homeSettings
    ? titles.find((t) => t.value === homeSettings?.filter)?.label || props.title
    : titles[0].label
      ;

  return (
    <Section id={props.itemType} container={{ className: css.container }}>
      <Carousel
        showCreateButton={!props.onHome ? props.itemType : undefined}
        className={css.slider}
        title={currentUser ? title : titles[2].label}
        multipleViews={true}
        defaultView={
          props.onHome
            ? homeSettings && currentUser
              ? homeSettings.defaultView || "column"
              : "column"
            : "grid"
        }
        titleLink={
          props.titleLink
            ? { text: "View All", href: "/" + props.titleLink }
            : undefined
        }
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
                    hasThumbnail={props.hasThumbnail}
                  />
                </Fragment>
              );
            })}
        </>
      </Carousel>
    </Section>
  );
}
