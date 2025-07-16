import { VehicleHistoryType } from "../../types";

export function VehicleHistory(props: { history: VehicleHistoryType }) {
  return (
    <section>
      <h2>Vehicle History</h2>
      <div>
        {props.history.map((entry, index) => {
          console.log("History Entry:", entry);
          console.log("History Entry Technician:", entry.technician);

          return (
            <div key={index} className="history-entry">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(entry.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {entry.location}
              </p>
              {entry.technician && <p>
                <strong>Technician:</strong> {entry.technician.about.firstName}{" "}
                {entry.technician.about.lastName}
              </p>}
              <p>
                <strong>Work:</strong> {entry.work.join(", ")}
              </p>
              <p>
                <strong>Notes:</strong> {entry.notes}
              </p>
              <p>
                <strong>Fleet Service:</strong>{" "}
                {entry.isFleetService ? "Yes" : "No"}
              </p>
              <p>
                <strong>Fleet Enrollment:</strong>{" "}
                {entry.isFleetEnrollment ? "Yes" : "No"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
