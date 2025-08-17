import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";
import firebaseGetData from "../../functions/firebase/storage/getData";
import ItemCreate from "./Create";
import { useParams } from "react-router-dom";
import { CombinedItemProps, ItemTypes } from "../../types";
import ErrorPage from "../../ErrorPage";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { RoleProtect } from "../../components/Security/Protect";

export default function ItemEdit(props: {
  itemType: ItemTypes;
  admin?: boolean;
}) {
  const { slug } = useParams();
  const user = useAuth();
  const [data, setData] = useState<CombinedItemProps | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Fetching data for item edit", props.itemType, slug);
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
      {user && data && user.uid === data.metaData.authorID && (
        <ItemCreate
          itemType={props.itemType}
          dataInput={data}
          slug={slug}
          admin={props.admin}
        />
      )}
      {!data && <LoadingPage />}
      {(!user || error) && <ErrorPage error="Item Not Found" code={404} />}
      {user && data && user.uid !== data.metaData.authorID && (
        <RoleProtect
          staffOnly={props.admin}
          redirect={<ErrorPage error="Access Denied" code={403} />}
        >
          <ItemCreate
            itemType={props.itemType}
            dataInput={data}
            slug={slug}
            admin={props.admin}
          />
        </RoleProtect>
      )}
    </>
  );
}
