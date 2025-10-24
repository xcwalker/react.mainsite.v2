import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrganizationType, UserType } from "../../types";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import Section from "../../components/Section";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import LoadingPage from "../../components/Loading";
import SidebarUser from "../../components/Sidebar/SidebarUser";
import FirebaseGetRealtimeUsersByLastOnlineOfAnOrgByID from "../../functions/firebase/storage/FirebaseGetRealtimeUsersByLastOnlineOfAnOrgByID";
import SideBySide from "../../components/SideBySide";
import AutoGrid from "../../components/AutoGrid";

export default function OrganizationDetails() {
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<OrganizationType | null>(
    null
  );

  useEffect(() => {
    firebaseGetRealtimeData(
      "organizations",
      organizationId || "",
      setOrganization as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [organizationId]);

  if (!organization) {
    return <LoadingPage />;
  }

  return (
    <Section id="organizationDetails">
      <SideBySide leftWidth="350px">
        <Sidebar organization={organization} />
        <main>
          <Members />
        </main>
      </SideBySide>
    </Section>
  );
}

function Sidebar(props: { organization: OrganizationType }) {
  const { organization } = props;

  return (
    <SidebarContainer>
      <img src={organization.logoUrl} alt="" />
      <h2>Organization Details</h2>
      <p>Name: {organization.name}</p>
      <p>Description: {organization.description}</p>
    </SidebarContainer>
  );
}

function Members() {
  const { organizationId } = useParams();
  const [users, setUsers] = useState<{ userData: UserType; userID: string }[]>(
    []
  );
  const [owners, setOwners] = useState<
    { userData: UserType; userID: string }[]
  >([]);
  const [admins, setAdmins] = useState<
    { userData: UserType; userID: string }[]
  >([]);
  const [members, setMembers] = useState<
    { userData: UserType; userID: string }[]
  >([]);

  useEffect(() => {
    // Fetch members logic here
    FirebaseGetRealtimeUsersByLastOnlineOfAnOrgByID(
      organizationId || "",
      setUsers as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [organizationId]);

  useEffect(() => {
    setOwners(
      users.filter((user) => user.userData.organization?.role === "owner")
    );
    setAdmins(
      users.filter((user) => user.userData.organization?.role === "admin")
    );
    setMembers(
      users.filter((user) => user.userData.organization?.role === "member")
    );
  }, [users]);

  return (
    <div>
      <h2>Members</h2>
      <h3>Owner{owners.length > 1 ? "s" : ""}</h3>
      <AutoGrid width="250px">
        {owners.map((owner, index) => (
          <Fragment key={index}>
            <SidebarUser userData={owner.userData} userId={owner.userID} />
          </Fragment>
        ))}
      </AutoGrid>
      {admins.length > 0 && (
        <>
          <h3>Admin{admins.length > 1 ? "s" : ""}</h3>
          <AutoGrid width="250px">
            {admins.map((admin, index) => (
              <Fragment key={index}>
                <SidebarUser userData={admin.userData} userId={admin.userID} />
              </Fragment>
            ))}
          </AutoGrid>
        </>
      )}
      {members.length > 0 && (
        <>
          <h3>Member{members.length > 1 ? "s" : ""}</h3>
          <AutoGrid width="250px">
            {members.map((member, index) => (
              <Fragment key={index}>
                <SidebarUser
                  userData={member.userData}
                  userId={member.userID}
                />
              </Fragment>
            ))}
          </AutoGrid>
        </>
      )}
    </div>
  );
}
