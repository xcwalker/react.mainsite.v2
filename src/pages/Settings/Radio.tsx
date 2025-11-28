import { useAtom } from "jotai";
import { SettingsNote } from "../../components/Settings/Note";
import SettingSection from "../../components/SettingSection";
import { RadioAtom, tabID } from "../../App";
import Button from "../../components/Button";
import ValueStack from "../../components/Settings/ValueStack";
import Value from "../../components/Settings/Value";

export default function SettingsRadio() {
  const [radio, setRadio] = useAtom(RadioAtom);

  return (
    <>
      <SettingSection id="radioSettings" title="Settings to come">
        <SettingsNote>
          Radio settings are not available at this time.
        </SettingsNote>
      </SettingSection>

      <SettingSection id="resetTab" title="Reset Radio Data">
        <SettingsNote>
          This will clear all saved radio stations and reset the radio to its
          default state.
        </SettingsNote>
        <ValueStack>
          <Value label="Tab ID" value={tabID || "Not Available"} canCopy />
          <Value
            label="Set Tab ID"
            value={radio.tabID !== "unset" ? radio.tabID : "Radio Not Active"}
            canCopy
          />
        </ValueStack>
        <Button
          style="primary"
          title="Reset Radio"
          onClick={() => {
            setRadio((radio) => ({
              ...radio,
              tabID: "unset",
              state: "paused",
            }));
          }}
          width="fit-content"
          icon={{ gficon: "restart_alt" }}
        >
          Reset Radio
        </Button>
      </SettingSection>
    </>
  );
}
