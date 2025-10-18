import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { ItemSidebar } from "./Sidebar";
import Markdown from "react-markdown";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import ErrorPage from "../../ErrorPage";
import { useEffect, useState } from "react";
import { ItemTypes, VehicleItemType } from "../../types";
import LoadingPage from "../../components/Loading";

import css from "../../styles/pages/itemPage/index.module.css";
import cssMarkdown from "../../styles/components/markdown.module.css";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import { VehicleHistory } from "./History";
import firebaseGetRealtimeDataForVehicle from "../../functions/firebase/storage/useRealtimeDataForVehicle";

export default function VehiclePage(props: { itemType: ItemTypes }) {
  const { vrn, vin6 } = useParams();
  const [item, setItem] = useState<VehicleItemType | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Fetching data for VRN:", vrn, "VIN6:", vin6);

    firebaseGetRealtimeDataForVehicle(
      props.itemType,
      vrn as string,
      vin6 as string,
      setItem as React.Dispatch<React.SetStateAction<unknown>>,
      setError
    );

    return () => {
      setItem(undefined);
      setError(false);
    };
  }, [vrn, vin6, props.itemType]);

  return (
    <>
      {item && !error && vrn && vin6 && (
        <>
          <Helmet>
            <title>
              {vrn} - {item.data.make} {item.data.model} {separator} Fleet {separator}{" "}
              {title}
            </title>
          </Helmet>
          <Section id="project">
            <SideBySide leftWidth="350px">
              <ItemSidebar itemType={props.itemType} item={item} vrn={vrn} />
              <main className={css.main}>
                <Markdown
                  remarkPlugins={[
                    [remarkGfm, { singleTilde: false }],
                    supersub,
                  ]}
                  className={css.description + " " + cssMarkdown.markdown}
                >
                  {item.data.description}
                  {/* {testData} */}
                </Markdown>
                <VehicleHistory history={item.data.history} vrn={vrn} item={item} />
              </main>
            </SideBySide>
          </Section>
        </>
      )}
      {item === undefined && !error && <LoadingPage />}
      {error && <ErrorPage code={404} error="Vehicle Not Found" />}
    </>
  );
}
