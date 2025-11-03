import { Navigate, useSearchParams } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import Input from "../../components/Input";
import Button from "../../components/Button";
import firebaseSetUserData from "../../functions/firebase/user/setUserData";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { UserType } from "../../types";
import { useEffect, useState } from "react";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import LoadingPage from "../../components/Loading";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";

export default function OrganizationJoin() {
  const currentUser = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const organizationId = searchParams.get("organizationId") || "";
  const inviteCode = searchParams.get("inviteCode") || "";

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserData(null);
      return;
    }

    firebaseGetRealtimeUserData(
      currentUser?.uid,
      setUserData as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [currentUser?.uid]);

  if (!currentUser || !userData) {
    return <LoadingPage />;
  }

  if (userData.organization?.id) {
    return <Navigate to={"/organizations/" + userData.organization.id} />;
  }

  return (
    <PageSeoWrapper
      title={`Join Organization ${separator} ${title}`}
      description={`Join an organization on ${title}`}
    >
      <AccountPage id="organizationJoin">
        <h1>Join Organization</h1>
        <Input
          id="organizationID"
          placeholder="Enter organization ID"
          value={organizationId}
          onChange={(e) => {
            setSearchParams({
              organizationId: e.target.value,
              inviteCode: inviteCode,
            });
          }}
          label="Organization ID"
        />
        <Input
          id="inviteCode"
          placeholder="Enter invite code (if applicable)"
          value={inviteCode}
          onChange={(e) => {
            setSearchParams({
              organizationId: organizationId,
              inviteCode: e.target.value,
            });
          }}
          label="Invite Code"
        />
        <Button
          title="Join Organization"
          centered
          style="primary"
          width="250px"
          onClick={() => {
            firebaseSetUserData(currentUser.uid, {
              ...userData!,
              organization: {
                id: organizationId,
                role: "member",
                inviteCode: inviteCode || undefined,
              },
            });
          }}
        >
          Join Organization
        </Button>
        {/* Form for joining an organization */}
      </AccountPage>
    </PageSeoWrapper>
  );
}
