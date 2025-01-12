import { useEffect, useState } from "react";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import css from "../../styles/pages/dashboard/index.module.css";
import DashboardAccount from "./Account";
import DashboardBanner from "./Banner";
import DashboardCreate from "./Create";
import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import DashboardWeather from "./Weather";

export default function DashboardIndex() {
  const user = useAuth(null);
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    if (user) {
      firebaseGetUserData(user.uid).then((data) => {

        setUserData(data as UserType);
      })

    }
  }, [user])

  return (
    <section className={css.dashboard}>
      <div className={css.container}>
        <DashboardBanner />
        <DashboardAccount userData={userData} />
        <DashboardCreate />
        <DashboardWeather />
      </div>
    </section>
  );
}
