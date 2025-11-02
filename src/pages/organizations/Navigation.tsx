import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserType } from "../../types";
import LoadingPage from "../../components/Loading";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import AccountPage from "../../components/Security/AccountPage";
import SideBySide from "../../components/SideBySide";
import Button from "../../components/Button";

export default function OrganizationNavigation() {
  const currentUser = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserData(null);
      return;
    }

    firebaseGetRealtimeUserData(currentUser?.uid, setUserData as React.Dispatch<React.SetStateAction<unknown>> );
  }, [currentUser?.uid]);

  if (!userData) {
    return <LoadingPage />;
  }

  if (userData.organization?.id) {
    return <Navigate to={`/organizations/${userData.organization.id}`} replace />;
  }

  return (
    <AccountPage id="organizationNavigation">
      <h1>Your Path To Organized Collaboration</h1>
      <SideBySide leftWidth="1fr">
        <Button href="./create" style="secondary" title="Create Organization" centered>Create</Button>
        <Button href="./join" style="primary" title="Join Organization" centered>Join</Button>
      </SideBySide>
    </AccountPage>
  );
}
