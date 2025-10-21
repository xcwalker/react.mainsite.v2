import { VehicleHistoryType, VehicleItemType } from "../../types";

import css from "../../styles/pages/vehiclePage/history.module.css";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import firebaseSetData from "../../functions/firebase/storage/setData";
import InputDate from "../../components/InputDate";
import IconButton from "../../components/IconButton";
import InputToggle from "../../components/InputToggle";
import toast from "react-hot-toast";
import {
  RoleProtect,
  RoleProtectInline,
} from "../../components/Security/Protect";
import devConsole from "../../functions/devConsole";

export function VehicleHistory(props: {
  history: VehicleHistoryType;
  vrn: string;
  item: VehicleItemType;
}) {
  return (
    <section>
      <h2 className={css.header}>Vehicle History</h2>
      <ol className={css.historyList}>
        <RoleProtect staffOnly>
          <Button
            onClick={() => {
              const newEntry: VehicleHistoryType[number] = {
                date: new Date().toJSON(),
                location: "",
                milage_miles: 0,
                technicianRef: "",
                work: [],
                notes: "",
                isFleetEnrollment: false,
                isFleetService: false,
              };

              firebaseSetData("vehicles", props.vrn, {
                ...props.item,
                data: {
                  ...props.item.data,
                  history: [...props.history, newEntry],
                },
              });
            }}
            style="primary"
            icon={{ gficon: "add" }}
            title="Add New History Entry"
          >
            Add New Entry
          </Button>
        </RoleProtect>
        {props.history
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((entry, index) => {
            devConsole.log("History Entry:", entry);
            devConsole.log("History Entry Technician:", entry.technician);

            return (
              <Fragment key={index}>
                <HistoryEntry
                  entry={entry}
                  vrn={props.vrn}
                  item={props.item}
                  index={index}
                />
              </Fragment>
            );
          })}
      </ol>
    </section>
  );
}

function HistoryEntry(props: {
  entry: VehicleHistoryType[number];
  vrn: string;
  item: VehicleItemType;
  index: number;
}) {
  const { entry, vrn, item } = props;
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const canEdit = !RoleProtectInline(true);

  useEffect(() => {
    setEditedEntry(entry);
  }, [entry]);

  useEffect(() => {
    if (
      entry.location === "" ||
      entry.milage_miles === 0 ||
      (entry.work && entry.work.length === 0) ||
      entry.date === ""
    ) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [entry]);

  return (
    <li className={css.historyEntry}>
      {!entry.isFleetEnrollment && (!editMode || canEdit) && (
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
                  to={"/users/" + entry.technicianRef}
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
              <RoleProtect staffOnly>
                <IconButton
                  onClick={() => setEditMode(true)}
                  style="primary"
                  icon={{ gficon: "edit" }}
                  title="Edit Entry"
                  width="fit-content"
                />
                <IconButton
                  onClick={() => {
                    firebaseSetData("vehicles", vrn, {
                      ...item,
                      data: {
                        ...item.data,
                        history: item.data.history.filter((h) => h !== entry),
                      },
                    });
                  }}
                  style="danger"
                  icon={{ gficon: "delete" }}
                  title="Delete Entry"
                  width="fit-content"
                />
              </RoleProtect>
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
            <div className={css.notesSection}>
              <span className={css.fieldName}>Notes:</span>
              <p className={css.notes}>{entry.notes}</p>
            </div>
          )}
        </div>
      )}
      {!entry.isFleetEnrollment && editMode && !canEdit && (
        <div className={css.entry + " " + css.editMode}>
          <div className={css.header}>
            <div className={css.left}>
              <span className={css.editingLabel}>Editing Entry</span>
            </div>
            <div className={css.right}>
              {/* delete button */}
              <IconButton
                onClick={() => {
                  firebaseSetData("vehicles", vrn, {
                    ...item,
                    data: {
                      ...item.data,
                      history: item.data.history.filter(
                        (_h, index) => index !== props.index
                      ),
                    },
                  });
                }}
                style="danger"
                icon={{ gficon: "delete" }}
                title="Delete Entry"
                width="fit-content"
              />
              {/* Save Button */}
              <Button
                onClick={() => {
                  if (
                    editedEntry.location === "" ||
                    editedEntry.milage_miles === 0 ||
                    (editedEntry.work && editedEntry.work.length === 0) ||
                    editedEntry.date === ""
                  ) {
                    toast.error("Please fill in all required fields.");
                    return;
                  }
                  firebaseSetData("vehicles", vrn, {
                    ...item,
                    data: {
                      ...item.data,
                      history: item.data.history.map((h, index) => {
                        if (index === props.index) {
                          return { ...editedEntry, isFleetEnrollment: false };
                        }
                        return h;
                      }),
                    },
                  });

                  setEditMode(false);
                }}
                style="primary"
                icon={{ gficon: "save" }}
                title="Save Entry"
                width="fit-content"
              >
                Save
              </Button>
            </div>
          </div>
          <div className={css.main}>
            <InputToggle
              id="isFleetService"
              label="Fleet Service"
              checked={editedEntry.isFleetService}
              onChange={(checked) =>
                setEditedEntry({ ...editedEntry, isFleetService: checked })
              }
            />
            <Input
              value={editedEntry.location}
              onChange={(e) =>
                setEditedEntry({
                  ...editedEntry,
                  location: e.currentTarget.value,
                })
              }
              id="location"
              label="Location"
              required
              placeholder="Location of Service"
            />
            <InputDate
              id="date"
              label="Date"
              value={new Date(editedEntry.date).toISOString().split("T")[0]}
              onChange={(e) =>
                setEditedEntry({
                  ...editedEntry,
                  date: new Date(e.currentTarget.value).toJSON(),
                })
              }
              required
            />
            <Input
              type="number"
              value={editedEntry.milage_miles}
              onChange={(e) =>
                setEditedEntry({
                  ...editedEntry,
                  milage_miles: e.currentTarget.valueAsNumber,
                })
              }
              id="milage_miles"
              label="Mileage (Miles)"
              required
            />
            <Input
              type="text"
              name="technician"
              id="technician"
              label="Technician ID"
              placeholder="Technician User ID"
              value={editedEntry.technicianRef}
              onChange={(e) => {
                // update technicianRef
                setEditedEntry({
                  ...editedEntry,
                  technicianRef: e.currentTarget.value,
                });
              }}
            />
            <ul className={css.fieldDataList}>
              {editedEntry.work.map((workItem, workIndex) => (
                <li key={workIndex} className={css.workItem}>
                  <Input
                    type="text"
                    name={"workItem-" + workIndex}
                    id={"workItem-" + workIndex}
                    label={"Work Item " + (workIndex + 1)}
                    required
                    placeholder="Work Item Description"
                    value={workItem}
                    onChange={(e) => {
                      const newWork = [...editedEntry.work];
                      newWork[workIndex] = e.currentTarget.value;
                      setEditedEntry({ ...editedEntry, work: newWork });
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const newWork = [...editedEntry.work];
                      newWork.splice(workIndex, 1);
                      setEditedEntry({ ...editedEntry, work: newWork });
                    }}
                    style="danger"
                    icon={{ gficon: "delete" }}
                    title="Remove Work Item"
                    className={css.removeWorkItemButton}
                  />
                </li>
              ))}
              <li className={css.workItem}>
                <Button
                  onClick={() => {
                    setEditedEntry({
                      ...editedEntry,
                      work: [...editedEntry.work, ""],
                    });
                  }}
                  style="secondary"
                  icon={{ gficon: "add" }}
                  title="Add Work Item"
                >
                  Add Work Item
                </Button>
              </li>
            </ul>
            <Input
              type="textarea"
              id="notes"
              label="Notes"
              value={editedEntry.notes}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, notes: e.currentTarget.value })
              }
            />
          </div>
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
    </li>
  );
}
