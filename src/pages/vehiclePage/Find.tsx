import { useState } from "react";
import Input from "../../components/Input";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/vehicles/find.module.css";
import Button from "../../components/Button";
import { separator, title } from "../../App";
import { RoleProtect } from "../../components/Security/Protect";
import PageSeoWrapper from "../../components/PageSeoWrapper";

export function FindVehiclePage() {
  const [vrn, setVRN] = useState("");
  const [vin6, setVIN6] = useState("");

  return (
    <PageSeoWrapper
      title={`Fleet ${separator} ${title}`}
      description={`Find your fleet vehicle history on ${title}`}
    >
      <AccountPage id="accountLogin">
        <h2 className={css.title}>Find Fleet Vehicle History</h2>
        <Input
          type="text"
          name="text"
          id="vrn"
          label="Registration Number (VRN)"
          required
          placeholder="AV66ENP"
          value={vrn}
          onChange={(e) => setVRN(e.currentTarget.value.toUpperCase())}
        />
        <Input
          label="Last 6 Digits of VIN"
          type="text"
          name="text"
          id="vin6"
          required
          placeholder="●●●●●●"
          value={vin6}
          onChange={(e) => setVIN6(e.currentTarget.value.toUpperCase())}
          maxLength={6}
          minLength={6}
        />
        <Button
          style="primary"
          title="Login"
          width="14rem"
          href={"./" + vrn + "/" + vin6}
          loading={vin6.length !== 6}
          centered
        >
          View Vehicle History
        </Button>

        <RoleProtect>
          <div className={css.divider}>
            <span>OR</span>
          </div>
          <Button
            style="secondary"
            href="./enroll"
            title="Search Vehicles"
            width="14rem"
            centered
          >
            Enroll A Vehicle
          </Button>
        </RoleProtect>
      </AccountPage>
    </PageSeoWrapper>
  );
}
