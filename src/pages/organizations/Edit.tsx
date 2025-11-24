import { useEffect, useState } from "react";
import { OrganizationType, UserType } from "../../types";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import LoadingPage from "../../components/Loading";
import firebaseGetRealtimeUserData from "../../functions/firebase/user/useRealtimeUserData";
import ErrorPage from "../../ErrorPage";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import Input from "../../components/Input";
import firebaseGetData from "../../functions/firebase/storage/getData";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import InputGroup from "../../components/InputGroup";
import InputDropdown from "../../components/InputDropdown";
import InputColor from "../../components/InputColor";
import Button from "../../components/Button";
import firebaseSetData from "../../functions/firebase/storage/setData";
import ReactMde from "react-mde";

export default function OrganizationEdit() {
  const currentUser = useAuth();
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<OrganizationType | null>(
    null
  );
  const [userData, setUserData] = useState<UserType>();
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    firebaseGetData("organizations", organizationId || "").then((data) => {
      setOrganization(data as OrganizationType);
    });
  }, [organizationId]);

  useEffect(() => {
    if (currentUser?.uid) {
      firebaseGetRealtimeUserData(
        currentUser.uid,
        setUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    }
  }, [currentUser]);

  if (!organization || !userData) {
    return <LoadingPage />;
  }

  if (
    currentUser?.uid !== organization.creator &&
    (userData.organization?.id !== organizationId ||
      userData.organization?.role === "member")
  ) {
    return (
      <ErrorPage
        error="You do not have permission to edit this organization."
        code={403}
      />
    );
  }

  if (redirect) {
    return <Navigate to={"../"} />;
  }

  return (
    <PageSeoWrapper
      title={`Edit ${organization.name} - Organizations`}
      description={`Edit the details and settings for the organization ${organization.name}.`}
    >
      <Section id="edit-organization">
        <SideBySide leftWidth="350px">
          <Sidebar
            organization={organization}
            setOrganization={
              setOrganization as React.Dispatch<
                React.SetStateAction<OrganizationType>
              >
            }
            organizationId={organizationId || ""}
            setRedirect={setRedirect}
          />
          <ReactMde value={organization.description || ""} onChange={(value) => {
            setOrganization({
              ...organization,
              description: value,
            });
          }} />
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}

function Sidebar(props: {
  organization: OrganizationType;
  organizationId: string;
  setOrganization: React.Dispatch<React.SetStateAction<OrganizationType>>;
  setRedirect: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { organization, organizationId, setOrganization, setRedirect } = props;

  return (
    <SidebarContainer>
      <SidebarTitle title="Edit Organization" />
      <Input
        id="organization-name"
        label="Organization Name"
        value={organization.name}
        onChange={(event) => {
          setOrganization({
            ...organization,
            name: event.target.value,
          });
        }}
        placeholder="Enter organization name"
      />

      {/* logos */}
      <Input
        id="organization-logo-icon"
        label="Organization Icon Logo URL"
        value={organization.logo.icon || ""}
        onChange={(event) => {
          setOrganization({
            ...organization,
            logo: {
              ...organization.logo,
              icon: event.target.value,
            },
          });
        }}
        placeholder="Enter organization logo URL"
      />
      {/* wide */}
      <Input
        id="organization-logo-wide"
        label="Organization Wide Logo URL"
        value={organization.logo.wide?.src || ""}
        onChange={(event) => {
          setOrganization({
            ...organization,
            logo: {
              ...organization.logo,
              wide: {
                ...organization.logo.wide,
                src: event.target.value,
              },
            },
          });
        }}
        placeholder="Enter organization wide logo URL"
      />
      {/* wide onLight */}
      <Input
        id="organization-logo-wide-onLight"
        label="Organization Wide Logo URL (On Light)"
        value={organization.logo.wide?.onLight || ""}
        onChange={(event) => {
          setOrganization({
            ...organization,
            logo: {
              ...organization.logo,
              wide: {
                ...organization.logo.wide,
                onLight: event.target.value,
              },
            },
          });
        }}
        placeholder="Enter organization wide logo URL for light backgrounds"
      />
      {/* wide onDark */}
      <Input
        id="organization-logo-wide-onDark"
        label="Organization Wide Logo URL (On Dark)"
        value={organization.logo.wide?.onDark || ""}
        onChange={(event) => {
          setOrganization({
            ...organization,
            logo: {
              ...organization.logo,
              wide: {
                ...organization.logo.wide,
                onDark: event.target.value,
              },
            },
          });
        }}
        placeholder="Enter organization wide logo URL for dark backgrounds"
      />
      {/* background */}
      <InputGroup direction="column">
        <InputDropdown
          id="organization-background-type"
          label="Organization Background Type"
          value={organization.logo.background?.type || "color"}
          onChange={(value) => {
            setOrganization({
              ...organization,
              logo: {
                ...organization.logo,
                background: {
                  ...organization.logo.background,
                  type: value as "color" | "image",
                },
              },
            });
          }}
          values={[
            { value: "color", label: "Color" },
            { value: "image", label: "Image" },
          ]}
        />
        {organization.logo.background.type === "image" && (
          <Input
            id="organization-background"
            label="Organization Background Image URL"
            value={organization.logo.background?.imageUrl || ""}
            onChange={(event) => {
              setOrganization({
                ...organization,
                logo: {
                  ...organization.logo,
                  background: {
                  ...organization.logo.background,
                  imageUrl: event.target.value,
                },}
              });
            }}
            placeholder="Enter organization background image URL"
          />
        )}
        {organization.logo.background.type === "color" && (
          <InputColor
            id="organization-background-color"
            label="Organization Background Color"
            value={organization.logo.background?.color || ""}
            onChange={(value) => {
              setOrganization({
                ...organization,
                logo: {
                  ...organization.logo,
                  background: {
                    ...organization.logo.background,
                    color: value,
                  },
                },
              });
            }}
          />
        )}
      </InputGroup>
      <InputColor
      id="organization-color"
      label="Organization Color"
      value={organization.logo.color}
      onChange={(value) => {
        setOrganization({
          ...organization,
          logo: {
            ...organization.logo,
            color: value,
          }
        });
      }}
    />
      <Button
        title="Save"
        style="primary"
        icon={{gficon: "save"}}
        onClick={() => {
          firebaseSetData("organizations", organizationId, organization).then(() => {
            setRedirect(true);
          });
        }}
      >Save</Button>

      {/* Add more input fields as necessary */}
    </SidebarContainer>
  );
}
