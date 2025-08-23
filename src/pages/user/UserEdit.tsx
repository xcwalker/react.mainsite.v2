import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useEffect, useState } from "react";
import firebaseGetUserData from "../../functions/firebase/user/getUserData";
import { UserType } from "../../types";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/user/edit.module.css";
import Input from "../../components/Input";
import { CompactPicker } from "react-color";
import Button from "../../components/Button";
import ErrorPage from "../../ErrorPage";
import firebaseSetUserData from "../../functions/firebase/user/setUserData";

export default function UserEdit(props: {
  admin?: boolean; // Optional prop to indicate if the user is an admin
}) {
  const currentUser = useAuth();
  const { uuid } = useParams();
  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let id = uuid;
    if (id === undefined || id?.length === 0) {
      id = currentUser?.uid;
    }

    if (id !== currentUser?.uid) {
      console.log("User is trying to edit another user's profile:", id, "Current user ID:", currentUser?.uid);
      // If the user is not editing their own profile, check if they are an admin
      if (!props.admin) {
        console.error("Unauthorized access: User is not an admin.");
        setError(true);
        return;
      }
    }

    firebaseGetUserData(id as string).then((userData) => {
      if (userData === undefined) {
        console.error("User data not found for UUID:", uuid);
        setUserData(undefined);
        setError(true)
        return;
      }

      // Handle the fetched user data as needed
      console.log("Fetched user data:", userData);
      setUserData(userData);
      setError(false);
    });
  }, [uuid, currentUser?.uid, props.admin]);

  return (
    <Section id="user-edit">
      {userData !== undefined && !error && (
        <SideBySide leftWidth="350px">
          <Sidebar
            admin={props.admin}
            setError={setError}
            setUserData={setUserData}
            userData={userData}
            userID={uuid ? uuid : currentUser?.uid || ""} // Use uuid or current user's uid
          />
          <main></main>
        </SideBySide>
      )}
      {error && (
        <ErrorPage
          code={500}
          error="An error occurred while fetching user data."
        />
      )}
    </Section>
  );
}

function Sidebar(props: {
  admin?: boolean; // Optional prop to indicate if the user is an admin
  userData: UserType; // Optional prop to pass user data
  setUserData: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>; // Optional prop to handle errors
  userID: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      {props.userData !== undefined && (
        <div className={css.sidebar}>
          <select
            name=""
            id=""
            className={css.select}
            value={props.userData.images.backgroundType}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };

              updatedUserData.images.backgroundType = e.target.value as
                | "color"
                | "image"
                | "video";

              props.setUserData(updatedUserData);
            }}
          >
            <option value="color">Color</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          {props.userData.images.backgroundType !== "color" && (
            <Input
              value={props.userData?.images.background}
              type={"url"}
              id="background"
              label={"background " + props.userData.images.backgroundType}
            />
          )}
          {props.userData.images.backgroundType === "color" && (
            <CompactPicker
              onChange={(e) => {
                const updatedUserData: UserType = { ...props.userData };
                updatedUserData.images.background = e.hex;
                props.setUserData(updatedUserData);
              }}
              color={props.userData.images.background}
              className={css.colorPicker}
            />
          )}
          <Input
            type="url"
            value={props.userData.images.profile}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.images.profile = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="profile"
            label="Profile Image URL"
          />
          <Input
            type="text"
            value={props.userData.about.userName}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.about.userName = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="userName"
            label="Username"
          />
          <Input
            type="text"
            value={props.userData.about.displayName}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.about.displayName = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="displayName"
            label="Display Name"
          />
          <Input
            type="text"
            value={props.userData.about.firstName}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.about.firstName = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="firstName"
            label="First Name"
          />
          <Input
            type="text"
            value={props.userData.about.lastName}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.about.lastName = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="lastName"
            label="Last Name"
          />
          <Input
            type="text"
            value={props.userData.about.statement}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.about.statement = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="statement"
            label="Statement"
          />
          <Input
            type="text"
            value={props.userData.info.gender}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.info.gender = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="gender"
            label="Gender"
          />
          <Input
            type="text"
            value={props.userData.info.pronouns}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.info.pronouns = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="pronouns"
            label="Pronouns"
          />
          <Input
            type="text"
            value={props.userData.info.location}
            onChange={(e) => {
              const updatedUserData: UserType = { ...props.userData };
              updatedUserData.info.location = e.target.value;
              props.setUserData(updatedUserData);
            }}
            id="location"
            label="Location"
          />
          <Button
            title={"Edit"}
            icon={{ gficon: "save" }}
            style="primary"
            onClick={() => {
              firebaseSetUserData(props.userID, props.userData)
                .then(() => {
                  console.log("User data updated successfully.");
                  navigate("../", { replace: true });
                })
                .catch((error) => {
                  console.error("Error updating user data:", error);
                  props.setError(true);
                });
            }}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
}
