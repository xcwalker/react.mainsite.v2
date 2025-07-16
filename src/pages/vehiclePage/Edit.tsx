import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";
import firebaseGetData from "../../functions/firebase/storage/getData";
import ItemCreate from "./Create";
import { useParams } from "react-router-dom";
import { CombinedItemProps, ItemTypes } from "../../types";
import ErrorPage from "../../ErrorPage";

export default function ItemEdit(props: { itemType: ItemTypes}) {
  const { slug } = useParams();
  const [data, setData] = useState<CombinedItemProps | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    firebaseGetData(props.itemType, slug as string).then((data) => {
      if (data === undefined) {
        setError(true);
        return;
      }
      setData(data as CombinedItemProps);
    });

    return () => {
      setData(undefined);
      setError(false);
    };
  }, [slug, props.itemType]);

  return (
    <>
      {data && <ItemCreate itemType={props.itemType} dataInput={data} />}
      {!data && <LoadingPage />}
      {error && <ErrorPage error="Item Not Found" code={404} />}
    </>
  );
}
