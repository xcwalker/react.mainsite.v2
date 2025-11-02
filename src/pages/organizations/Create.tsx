import { useEffect, useState } from "react";
import AccountPage from "../../components/Security/AccountPage";
import Input from "../../components/Input";
import Button from "../../components/Button";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import LoadingPage from "../../components/Loading";
import firebaseSetUserData from "../../functions/firebase/user/setUserData";
import { UserType } from "../../types";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import { useNavigate } from "react-router-dom";

export default function OrganizationCreate() {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserData(null);
      return;
    }
    
    // Fetch user data if needed
    firebaseGetRealtimeUserData(currentUser.uid, setUserData as React.Dispatch<React.SetStateAction<unknown>> );
  }, [currentUser?.uid]);

  if (!currentUser) {
    return <LoadingPage />
  }

  return (
    <AccountPage id="organizationCreate">
      <h1>Create Organization</h1>
      <Input
        id="organizationName"
        placeholder="Enter organization name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Organization Name"
      />
      <Input
        id="organizationDescription"
        placeholder="Enter organization description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        label="Organization Description"
        type="textarea"
      />
      <Input
        id="organizationLogoUrl"
        placeholder="Enter organization logo URL"
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.target.value)}
        label="Organization Logo URL"
        type="url"
      />
      <Button
        title="Create Organization"
        centered
        style="primary"
        width="250px"
        onClick={() => {
          firebaseCreateData("organizations", {
            name: name,
            description: description,
            logo: {
              wide: logoUrl,
            },
            creator: currentUser.uid,
          }).then((docRef) => {
            if (docRef) {
              console.log("Organization created with ID: ", docRef.id);
              firebaseSetUserData(currentUser.uid, {
                ...userData!,
                organization: {
                  id: docRef.id,
                  role: "owner",
                },
              }).then(() => {
                console.log("User organization updated.");
                navigate(`../${docRef.id}`);
              });
            }
          });
        }}
      >
        Create Organization
      </Button>
      {/* Form for creating an organization */}
    </AccountPage>
  );
}
