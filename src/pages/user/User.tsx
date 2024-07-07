import Section from "../../components/Section";
import { useEffect, useState } from "react";
import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import { useParams } from "react-router-dom";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/user/index.module.css";
import Sidebar from "./Sidebar";

export default function UserPage(props: { id?: string }) {
  const { uuid } = useParams<string>();
  const [userData, setUserData] = useState<UserType>();

  useEffect(() => {
    if (props.id === undefined && uuid === undefined) return;

    let id = "";

    if (props.id) {
      id = props.id;
    } else if (uuid) {
      id = uuid;
    } else return;

    firebaseGetUserData(id).then((res) => {
      setUserData(res);
      console.log(res);
    });
  }, [props.id, uuid]);
  return (
    <Section id="user">
      {userData && (
        <SideBySide leftWidth="400px">
          <Sidebar user={userData} />
          <main className={css.main}>
            {userData.images.header && (
              <img
                src={userData.images.header}
                alt=""
                className={css.header}
              />
            )}
          </main>
        </SideBySide>
      )}
    </Section>
  );
}
