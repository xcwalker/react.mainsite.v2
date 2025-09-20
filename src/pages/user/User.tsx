import Section from "../../components/Section";
import { useEffect, useState } from "react";
// import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/user/index.module.css";
import Sidebar from "./Sidebar";
import ItemCarousel from "../../components/ItemCarousel";
import firebaseSetupUserData from "../../functions/firebase/user/setupUserData";
import ErrorPage from "../../ErrorPage";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function UserPage(props: { id?: string }) {
  const { uuid } = useParams<string>();
  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const currentUser = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.id === undefined && uuid === undefined) return;

    if (error) return;

    let id = "";

    if (props.id) {
      id = props.id;
      setUserID(props.id);
    } else if (uuid) {
      id = uuid;
      setUserID(uuid);
    } else return;

    firebaseGetRealtimeUserData(
      id,
      setUserData as React.Dispatch<React.SetStateAction<unknown>>,
      setError
    );

    // .then((res) => {
    //   setUserData(res);

    //   if (res === undefined && props.id) {
    //     firebaseSetupUserData(props.id).then(() => {
    //       firebaseGetUserData(id).then((res) => {
    //         setUserData(res);
    //       });
    //     });
    //   } else if (res === undefined) {
    //     setError(true);
    //   }
    // });
  }, [props.id, uuid, error]);

  useEffect(() => {
    if ((props.id !== undefined && props.id?.length === 0) || !error) return;

    firebaseSetupUserData(props.id as string).then(() => {
      setError(false);
    });
  }, [error, props.id]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    if (currentUser?.uid === userID) {
      navigate("/me", { replace: true });
    }
  }, [currentUser?.uid, navigate, userID]);

  return (
    <Section id="user">
      {userData && (
        <SideBySide leftWidth="350px">
          <Sidebar user={userData} id={props.id ? props.id : (uuid ? uuid : "")} />
          <main className={css.main}>
            {userData.images.header && (
              <img src={userData.images.header} alt="" className={css.header} />
            )}
            {userID && (
              <>
                <ItemCarousel
                  userID={userID}
                  itemType="projects"
                  title={userData.about.firstName + "'s Projects"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="recipes"
                  title={userData.about.firstName + "'s Recipes"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="blog"
                  title={userData.about.firstName + "'s Blog Posts"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="albums"
                  title={userData.about.firstName + "'s Albums"}
                  slug=""
                  sameCollection={false}
                />
              </>
            )}
          </main>
        </SideBySide>
      )}
      {error && <ErrorPage code={404} error="User Not Found" />}
    </Section>
  );
}
