import { VehicleHistoryType } from "../../types";

import css from "../../styles/pages/vehiclePage/history.module.css";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export function VehicleHistory(props: { history: VehicleHistoryType }) {
  return (
    <section>
      <h2 className={css.header}>Vehicle History</h2>
      <ol className={css.historyList}>
        {props.history.map((entry, index) => {
          console.log("History Entry:", entry);
          console.log("History Entry Technician:", entry.technician);

          return (
            <Fragment key={index}>
              {!entry.isFleetEnrollment && (
                <div className={css.entry}>
                  <div className={css.header}>
                    <div className={css.left}>
                      <span className={css.location}>{entry.location}</span>
                      <span className={css.date}>
                        {new Date(entry.date).toLocaleDateString()} |{" "}
                        {entry.milage_miles}mi
                      </span>
                    </div>
                    <div className={css.right}>
                      {entry.technician && (
                        <Link
                          to={"/user/" + entry.technicianRef.id}
                          className={css.technician}
                        >
                          {entry.technician.about.firstName}{" "}
                          {entry.technician.about.lastName}
                        </Link>
                      )}
                      {entry.isFleetService && (
                        <div className={css.fleetService}>
                          {/* <GFIcon>home_repair_service</GFIcon> */}
                          <Logo type="x" className={css.logo} />
                        </div>
                      )}
                    </div>
                  </div>
                  <ul className={css.fieldDataList}>
                    {entry.work.map((workItem, workIndex) => (
                      <li key={workIndex} className={css.workItem}>
                        {workItem}
                      </li>
                    ))}
                  </ul>
                  {entry.notes && entry.notes !== "" && (
                    <div>
                      <span className={css.fieldName}>Notes:</span>
                      <span className={css.fieldData}>{entry.notes}</span>
                    </div>
                  )}
                </div>
              )}
              {entry.isFleetEnrollment && (
                <div className={css.entry}>
                  <div className={css.header}>
                    <div className={css.left}>
                      <span className={css.location}>
                        Enrolled into Fleet Service Program
                      </span>
                      <span className={css.date}>
                        {new Date(entry.date).toLocaleDateString()} |{" "}
                        {entry.milage_miles}mi
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
