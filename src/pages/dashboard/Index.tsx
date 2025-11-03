import { useEffect, useState } from "react";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import css from "../../styles/pages/dashboard/index.module.css";
import DashboardAccount from "./Account";
import DashboardBanner from "./Banner";
import DashboardCreate from "./Create";
import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import DashboardWeather from "./Weather";
import DashboardRadio from "./Radio";
import DashboardLinks from "./Links";
import DashboardSearch from "./Search";
import { separator, title } from "../../App";
import PageSeoWrapper from "../../components/PageSeoWrapper";

export default function DashboardIndex() {
  const user = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    if (user) {
      firebaseGetUserData(user.uid).then((data) => {
        setUserData(data as UserType);
      });
    }
  }, [user]);

  return (
    <PageSeoWrapper
      title={`Dashboard ${separator} ${title}`}
      description={`Your personal dashboard on ${title}`}
    >
      <section className={css.dashboard}>
        <div className={css.container}>
          <DashboardBanner name={userData?.about.firstName} />
          <DashboardAccount userData={userData} />
          <DashboardSearch />
          <DashboardRadio />
          <DashboardCreate />
          <DashboardWeather />
          <DashboardLinks />
        </div>
      </section>
    </PageSeoWrapper>
  );
}
