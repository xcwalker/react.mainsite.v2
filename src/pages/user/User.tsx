import Section from "../../components/Section";
import { useEffect, useState } from "react";
import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import { useParams } from "react-router-dom";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/user/index.module.css";
import Sidebar from "./Sidebar";
import ItemCarousel from "../../components/ItemCarousel";
import firebaseSetupUserData from "../../functions/firebase/user/setupUserData";
import ErrorPage from "../../ErrorPage";

export default function UserPage(props: { id?: string }) {
  const { uuid } = useParams<string>();
  const [userData, setUserData] = useState<UserType>();
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.id === undefined && uuid === undefined) return;

    let id = "";

    if (props.id) {
      id = props.id;
      setUserID(props.id);
    } else if (uuid) {
      id = uuid;
      setUserID(uuid);
    } else return;

    firebaseGetUserData(id).then((res) => {
      setUserData(res);

      if (res === undefined && props.id) {
        firebaseSetupUserData(props.id).then(() => {
          firebaseGetUserData(id).then((res) => {
            setUserData(res);
          });
        });
      } else if (res === undefined) {
        setError(true);
      }
    });
  }, [props.id, uuid]);

  return (
    <Section id="user">
      {userData && (
        <SideBySide leftWidth="350px">
          <Sidebar user={userData} />
          <main className={css.main}>
            {userData.images.header && (
              <img src={userData.images.header} alt="" className={css.header} />
            )}
            {userID && (
              <>
                <ItemCarousel
                  userID={userID}
                  itemType="projects"
                  title={userData.about.firstName + "'s projects"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="recipes"
                  title={userData.about.firstName + "'s recipes"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="blog"
                  title={userData.about.firstName + "'s blog posts"}
                  slug=""
                  sameCollection={false}
                />
                <ItemCarousel
                  userID={userID}
                  itemType="albums"
                  title={userData.about.firstName + "'s albums"}
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
