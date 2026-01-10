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
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";

import css from "../../styles/pages/organization/details.module.css";
import cssMarkdown from "../../styles/components/markdown.module.css";
import Button from "../../components/Button";
import DeleteWarning from "../../components/DeleteWarning";
import SidebarButtonContainer from "../../components/Sidebar/SidebarButtonContainer";
import ShareModal from "../../components/ShareModal";
import { separator, shortURL, title } from "../../App";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { User } from "firebase/auth";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import firebaseSetData from "../../functions/firebase/storage/setData";
import QRCode from "react-qr-code";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import OrganizationsCarousel from "./Carousel";

export default function OrganizationDetails() {
  const currentUser = useAuth();
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<OrganizationType | null>(
    null
  );
  const [users, setUsers] = useState<{ userData: UserType; userId: string }[]>(
    []
  );
  const [userData, setUserData] = useState<UserType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    firebaseGetRealtimeData(
      "organizations",
      organizationId || "",
      setOrganization as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [organizationId]);

  useEffect(() => {
    if (currentUser?.uid) {
      firebaseGetRealtimeUserData(
        currentUser.uid,
        setUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    }
  }, [currentUser]);

  useEffect(() => {
    // Fetch members logic here
    FirebaseGetRealtimeUsersByLastOnlineOfAnOrgByID(
      organizationId || "",
      setUsers as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [organizationId]);

  if (!organization) {
    return <LoadingPage />;
  }

  return (
    <PageSeoWrapper
      title={`${organization.name} ${separator} Organization ${separator} ${title}`}
      description={`View the details of the organization "${organization.name}" on ${title}`}
    >
      <Section id="organizationDetails">
        <SideBySide leftWidth="350px">
          <Sidebar
            currentUser={currentUser}
            userData={userData}
            organization={organization}
            owners={users.filter(
              (user) => user.userData.organization?.role === "owner"
            )}
            organizationId={organizationId || ""}
            setShowDeleteModal={setShowDeleteModal}
            setShowInviteModal={setShowInviteModal}
            setShowShareModal={setShowShareModal}
            setShowLeaveModal={setShowLeaveModal}
          />
          <main className={css.main}>
            <Description organization={organization} />
            <Posts organizationId={organizationId || ""} />
            <Members users={users} />
          </main>
        </SideBySide>
      </Section>
      <DeleteWarning
        visibility={showDeleteModal}
        setVisibility={setShowDeleteModal}
        deleteAction={() => {
          // Handle organization deletion logic here
        }}
      />
      <ShareModal
        setVisibility={setShowShareModal}
        visibility={showShareModal}
        url={"org." + shortURL + "/" + organizationId}
      />
      <InviteModal
        setVisibility={setShowInviteModal}
        visibility={showInviteModal}
        organizationId={organizationId || ""}
        organization={organization}
      />
      <LeaveModal
        setVisibility={setShowLeaveModal}
        visibility={showLeaveModal}
        userData={userData}
        currentUser={currentUser}
      />
    </PageSeoWrapper>
  );
}

function Sidebar(props: {
  organization: OrganizationType;
  currentUser: User | null | undefined;
  userData: UserType | null;
  organizationId: string;
  owners: { userId: string; userData: UserType }[];
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeaveModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    organization,
    organizationId,
    currentUser,
    userData,
    owners,
    setShowDeleteModal,
    setShowInviteModal,
    setShowShareModal,
    setShowLeaveModal,
  } = props;

  return (
    <SidebarContainer>
      {organization.logo.background && (
        <div
          className={css.logo}
          style={
            {
              "--_background-color":
                organization.logo.background.type === "color"
                  ? organization.logo.background.color
                  : "transparent",
            } as React.CSSProperties
          }
        >
          <img src={organization.logo.wide.src} alt="" />
          {organization.logo.background.type === "image" && (
            <img
              src={organization.logo.background.imageUrl}
              alt=""
              className={css.background}
            />
          )}
        </div>
      )}
      {!organization.logo.background && (
        <div className={css.logoNoBackground}>
          <img src={organization.logo.wide.onLight} alt="" />
        </div>
      )}
      <SidebarTitle title={organization.name} />
      <Controls
        organization={organization}
        organizationId={organizationId || ""}
        currentUser={currentUser}
        userData={userData}
        owners={owners}
        setShowDeleteModal={setShowDeleteModal}
        setShowInviteModal={setShowInviteModal}
        setShowShareModal={setShowShareModal}
        setShowLeaveModal={setShowLeaveModal}
      />
    </SidebarContainer>
  );
}

function Controls(props: {
  organization: OrganizationType;
  organizationId: string;
  currentUser: User | null | undefined;
  userData: UserType | null;
  owners: { userId: string; userData: UserType }[];
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeaveModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    organization,
    organizationId,
    currentUser,
    userData,
    owners,
    setShowDeleteModal,
    setShowInviteModal,
    setShowShareModal,
    setShowLeaveModal,
  } = props;
  const [linkCopied, setLinkCopied] = useState(false);

  return (
    <SidebarButtonContainer>
      <Button
        onClick={() => setShowShareModal(true)}
        style="secondary"
        title="Share Organization"
        icon={{ gficon: "qr_code" }}
      >
        Share Via QR
      </Button>

      {navigator.canShare &&
        navigator.canShare({
          title: organization.name,
          text: organization.description,
          url: "https://org." + shortURL + "/" + organizationId,
        }) && (
          <Button
            onClick={async () => {
              await navigator.share({
                title: organization.name,
                text: organization.description,
                url: "https://org." + shortURL + "/" + organizationId,
              });
            }}
            title="Share"
            icon={{ gficon: "share" }}
            style={"secondary"}
          >
            Share
          </Button>
        )}
      {!navigator.canShare && (
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText("https://org." + shortURL + "/" + organizationId)
              .then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              });
          }}
          title="Copy Link"
          icon={{ gficon: linkCopied ? "check" : "link" }}
          style={linkCopied ? "success" : "secondary"}
          disabled={linkCopied}
        >
          {linkCopied ? "Link Copied!" : "Copy Link"}
        </Button>
      )}
      {userData?.organization?.id === organizationId &&
        (userData.organization?.role === "owner" ||
          userData.organization?.role === "admin") && (
          <>
            <Button
              onClick={() => setShowInviteModal(true)}
              style="secondary"
              title="Invite Users"
              icon={{ gficon: "person_add" }}
            >
              Invite
            </Button>
            <Button
              href="./edit"
              style="primary"
              title="Edit Organization"
              icon={{ gficon: "edit" }}
            >
              Edit
            </Button>
          </>
        )}

      {owners.length > 0 &&
        owners.find((owner) => owner.userId === currentUser?.uid) && (
          <Button
            onClick={() => setShowDeleteModal(true)}
            style="danger"
            title="Delete Organization"
            icon={{ gficon: "delete" }}
          >
            Delete
          </Button>
        )}
      <Button
        onClick={() => setShowLeaveModal(true)}
        style="danger"
        title="Leave Organization"
        icon={{ gficon: "logout" }}
      >
        Leave
      </Button>
    </SidebarButtonContainer>
  );
}

function Description(props: { organization: OrganizationType }) {
  const { organization } = props;

  return (
    <Section id="descriptionSection" className={css.descriptionSection}>
      <h2>Description</h2>
      <Markdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }], supersub]}
        className={css.description + " " + cssMarkdown.markdown}
      >
        {organization.description}
      </Markdown>
    </Section>
  );
}

function Posts(props: { organizationId: string }) {
  const { organizationId } = props;

  return (
    <Section id="postsSection" className={css.postsSection}>
      <OrganizationsCarousel
        organizationId={organizationId}
        title="Posts"
        itemType="blog"
        hasThumbnail={true}
      />
      <OrganizationsCarousel
        organizationId={organizationId}
        title="Projects"
        itemType="projects"
        hasThumbnail={true}
      />
      <OrganizationsCarousel
        organizationId={organizationId}
        title="Recipes"
        itemType="recipes"
        hasThumbnail={true}
      />
    </Section>
  );
}

function Members(props: { users: { userData: UserType; userId: string }[] }) {
  const { users } = props;

  const [owners, setOwners] = useState<
    { userData: UserType; userId: string }[]
  >([]);
  const [admins, setAdmins] = useState<
    { userData: UserType; userId: string }[]
  >([]);
  const [members, setMembers] = useState<
    { userData: UserType; userId: string }[]
  >([]);

  useEffect(() => {
    // Categorize users based on their roles
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
    <Section id="membersSection" className={css.membersSection}>
      <h2>Members</h2>
      <MemberGroup title="Owners" users={owners} />
      <MemberGroup title="Admins" users={admins} />
      <MemberGroup title="Members" users={members} />
    </Section>
  );
}

function MemberGroup(props: {
  title: string;
  users: { userData: UserType; userId: string }[];
}) {
  const { title, users } = props;

  // remove the s if only one user
  const computedTitle = users.length === 1 ? title.slice(0, -1) : title;

  return (
    <>
      {users.length > 0 && (
        <div className={css.memberGroup}>
          <h3>{computedTitle}</h3>
          <AutoGrid width="350px">
            {users.map((user, index) => (
              <Fragment key={index}>
                <SidebarUser userData={user.userData} userId={user.userId} />
              </Fragment>
            ))}
          </AutoGrid>
        </div>
      )}
    </>
  );
}

function InviteModal(props: {
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  visibility: boolean;
  organizationId: string;
  organization: OrganizationType;
}) {
  const { setVisibility, visibility, organizationId, organization } = props;
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [codeSaved, setCodeSaved] = useState(false);

  useEffect(() => {
    // Generate a simple invite code (could be more complex in real scenarios)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
  }, []);

  function saveInviteCode() {
    if (codeSaved) return;

    firebaseSetData(
      "organizations",
      organizationId,
      {
        ...organization,
        inviteCodes: [...(organization.inviteCodes || []), inviteCode],
      },
      {
        toast: {
          loading: "Generating Invite Code",
          success: "Invite Code Generated",
          error: "Error Generating Invite Code",
        },
      }
    ).then(() => {
      setCodeSaved(true);
    });
  }

  return (
    <Modal
      height="420px"
      title="Invite Users"
      visibility={visibility}
      setVisibility={() => setVisibility(false)}
      footer={
        <>
          <Button
            onClick={() => setVisibility(false)}
            style="secondary"
            title="Close"
            centered
          >
            Close
          </Button>
          <Button
            href={
              "mailto:" +
              email.toLowerCase() +
              "?subject=Invitation to join organization&body=You have been invited to join the organization. Please click the link below to accept the invitation.%0D%0A%0D%0Ahttps://org." +
              shortURL +
              "/" +
              organizationId +
              "/" +
              inviteCode
            }
            onClick={() => {
              // Handle invite logic here
              saveInviteCode();
              setVisibility(false);
              setTimeout(() => {
                setEmail("");
              }, 100);
            }}
            style="primary"
            title="Invite"
            centered
            disabled={!email}
          >
            Invite By Email
          </Button>
        </>
      }
    >
      <SideBySide>
        <div className={css.inviteQRCode}>
          <p>Join By QR</p>
          {codeSaved && (
            <QRCode
              value={
                "https://org." +
                shortURL +
                "/join?organizationId=" +
                organizationId +
                "&inviteCode=" +
                inviteCode
              }
              bgColor="var(--text-inverse)"
              fgColor="var(--text)"
              className={css.qrCode}
            />
          )}
          {!codeSaved && (
            <Button
              onClick={() => {
                saveInviteCode();
              }}
              title="Generate QR Code"
              style="primary"
              centered
            >
              Generate QR Code
            </Button>
          )}
        </div>
        <div className={css.inviteDetails}>
          <p>Invite By Email</p>
          <Input
            id="invite-email"
            type="email"
            placeholder="email@example.com"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={css.divider}>
            <span>OR</span>
          </div>
          <p>Join By Invite Code</p>
          {codeSaved && (
            <>
              <Input
                id="organization-id"
                type="text"
                placeholder="ORG ID"
                label="Organization ID"
                value={organizationId}
              />
              <Input
                id="invite-code"
                type="text"
                placeholder="Invite Code"
                label="Invite Code"
                value={inviteCode}
              />
            </>
          )}
          {!codeSaved && (
            <Button
              onClick={() => {
                saveInviteCode();
              }}
              title="Generate Invite Code"
              style="primary"
              centered
            >
              Generate Invite Code
            </Button>
          )}
        </div>
      </SideBySide>
    </Modal>
  );
}

function LeaveModal(props: {
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  visibility: boolean;
  userData: UserType | null;
  currentUser: User | null | undefined;
}) {
  const { setVisibility, visibility, userData, currentUser } = props;

  if (!currentUser || !userData) {
    return null;
  }

  return (
    <Modal
      title="Leave Organization"
      visibility={visibility}
      setVisibility={() => setVisibility(false)}
      footer={
        <>
          <Button
            onClick={() => {
              const newUserData = userData;
              newUserData.organization = undefined;

              firebaseSetData("users", currentUser.uid, newUserData, {
                toast: {
                  loading: "Leaving Organization",
                  success: "Left Organization Successfully",
                  error: "Error Leaving Organization",
                },
              }).then(
                () => {
                  setVisibility(false);
                }
              );
            }}
            style="danger"
            title="Leave Organization"
            centered
          >
            Leave Organization
          </Button>
          <Button
            onClick={() => setVisibility(false)}
            style="secondary"
            title="Cancel"
            centered
          >
            Cancel
          </Button>
        </>
      }
    >
      <p>Are you sure you want to leave this organization?</p>
      <p>You will lose access to any organization-only resources.</p>
    </Modal>
  );
}
