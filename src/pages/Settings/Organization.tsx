import SettingSection from "../../components/SettingSection.tsx";
import {SettingsNote} from "../../components/Settings/Note.tsx";
import InputToggle from "../../components/InputToggle.tsx";
import {UserType} from "../../types.tsx"
import firebaseSetData from "../../functions/firebase/storage/setData.tsx";
import {User} from "firebase/auth";

export default function SettingsOrganizations(props: {
    userData: UserType
    currentUser: User
}) {
    const {userData, currentUser} = props;

    return <>
        <SettingSection id="navigationSettings" title="Navigation Settings">

            <SettingsNote>
                When not showing organization it will not appear on your profile, and will you will be hidden on the organizations page.
            </SettingsNote>
            <InputToggle checked={userData.settings.showOrganization} onChange={(checked: boolean) => {
                firebaseSetData("users", currentUser.uid, {
                    ...userData,
                    settings: {
                        ...userData.settings,
                        showOrganization: checked
                    }
                })
            }} id={"showOrganization"} label={"Show Organization"} />

        </SettingSection>
    </>
}