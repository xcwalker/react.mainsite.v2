import { useEffect, useState } from "react";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import AccountPage from "../../components/Security/AccountPage";
import { VehicleItemType } from "../../types";
import css from "../../styles/pages/vehiclePage/enroll.module.css";
import Button from "../../components/Button";
import { checkIfDocExists } from "../../functions/firebase/storage/checkIfDocExists";
import toast from "react-hot-toast";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { useNavigate } from "react-router-dom";

export default function VehicleEnrollPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleItemType>({
    data: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      description: "",
      history: [
        {
          // fleet service enrollment entry
          date: new Date().toJSON(),
          location: "",
          milage_miles: 0,
          work: [],
          technicianRef: "",
          isFleetEnrollment: true,
          isFleetService: false,
          notes: "",
        },
      ],
    },
    metaData: {
      date: {
        created: new Date().toJSON(),
        modified: new Date().toJSON(),
      },
      vin: "",
      key: "",
    },
  });
  const [vrn, setVrn] = useState("");
  const [vrnAvailable, setVrnAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkIfDocExists("vehicles", vrn).then((exists) => {
      if (exists) {
        toast.error("A vehicle with this VRN already exists.");
        setVrnAvailable(false);
      } else {
        // VRN is available
        setVrnAvailable(true);
      }
    });
  }, [vrn]);

  return (
    <AccountPage id="vehicle-enroll">
      <h1>Vehicle Enrollment</h1>

      <Input
        label={vrnAvailable === false ? "VRN (Unavailable)" : "VRN"}
        value={vrn}
        onChange={(e) => setVrn(e.target.value.toUpperCase())}
        id="vehicle-vrn"
        required
        isInvalid={vrnAvailable === false}
      />
      <InputGroup direction="row" fullWidth>
        <Input
          label="Make"
          value={vehicle.data.make}
          onChange={(e) =>
            setVehicle({
              ...vehicle,
              data: { ...vehicle.data, make: e.target.value },
            })
          }
          required
          id="vehicle-make"
          className={css.input}
        />
        <Input
          label="Model"
          value={vehicle.data.model}
          onChange={(e) =>
            setVehicle({
              ...vehicle,
              data: { ...vehicle.data, model: e.target.value },
            })
          }
          required
          id="vehicle-model"
          className={css.input}
        />
      </InputGroup>
      <InputGroup direction="row" fullWidth>
        <Input
          label="Year"
          type="number"
          value={vehicle.data.year}
          onChange={(e) =>
            setVehicle({
              ...vehicle,
              data: { ...vehicle.data, year: e.target.valueAsNumber },
            })
          }
          required
          id="vehicle-year"
          className={css.input}
        />
        <Input
          label="Mileage"
          type="number"
          value={vehicle.data.history[0].milage_miles}
          onChange={(e) =>
            setVehicle({
              ...vehicle,
              data: {
                ...vehicle.data,
                history: [
                  {
                    ...vehicle.data.history[0],
                    milage_miles: e.target.valueAsNumber,
                  },
                ],
              },
            })
          }
          required
          id="vehicle-mileage"
          className={css.input}
        />
      </InputGroup>
      <Input
        label="Description"
        value={vehicle.data.description}
        onChange={(e) =>
          setVehicle({
            ...vehicle,
            data: { ...vehicle.data, description: e.target.value },
          })
        }
        id="vehicle-description"
      />
      <Input
        label="VIN"
        value={vehicle.metaData.vin}
        onChange={(e) =>
          setVehicle({
            ...vehicle,
            metaData: {
              ...vehicle.metaData,
              vin: e.target.value.toUpperCase(),
              key: e.target.value
                .toUpperCase()
                .substring(e.target.value.length - 6),
            },
          })
        }
        required
        id="vehicle-vin"
        className={css.input}
        maxLength={17}
        minLength={11}
      />
      <Button
        onClick={() => {
          firebaseSetData("vehicles", vrn, vehicle)
            .then(() => {
              toast.success("Vehicle enrolled successfully!");
              navigate("/vehicles/" + vrn + "/" + vehicle.metaData.key);
            })
            .catch((error) => {
              toast.error("Error enrolling vehicle: " + error.message);
            });
        }}
        title="Enroll Vehicle"
        style="primary"
        width="14rem"
        centered
      >
        Enroll
      </Button>
    </AccountPage>
  );
}
