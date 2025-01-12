import { Link } from "react-router-dom";
import css from "../../styles/pages/dashboard/account.module.css";
import { UserType } from "../../types";

export default function DashboardAccount(props: { userData: UserType | null }) {
  return (
    <section className={css.account}>
      {props.userData !== null && (
        <div className={css.container}>
          <img
            src={props.userData.images.header}
            alt=""
            className={css.headerImage}
          />
          <img
            src={props.userData.images.profile}
            alt=""
            className={css.profileImage}
          />
          <div className={css.text}>
            <h2>{props.userData.about.displayName}</h2>
            <h3>
              {props.userData.about.firstName} {props.userData.about.lastName}
            </h3>
          </div>
          <Link to={"/account/manage"}>Manage Account</Link>
        </div>
      )}
      {props.userData === null && <span>Loading</span>}
    </section>
  );
}
