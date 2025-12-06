import { Fragment, useEffect, useState } from "react";
import {
  Overlay_DirectionType,
  Overlay_PositionType,
  Overlay_StationType,
  Overlay_TransitionType,
  OverlayDefault,
  OverlayDirections,
  OverlayPositions,
  OverlayStations,
  OverlayTransitions,
  overlayType,
} from "../../types";
import firebaseGetData from "../../functions/firebase/storage/getData";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/overlay/Create.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import GFIcon from "../../components/GFIcon";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { Preview } from "./Preview";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import Protect from "../../components/Security/Protect";
import ErrorPage from "../../ErrorPage";
import InputGroup from "../../components/InputGroup";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";
import InputDropdown from "../../components/InputDropdown";
import InputToggle from "../../components/InputToggle";
import { InputDuration } from "../../components/InputDuration";

export default function OverlayCreate(props: { id?: string }) {
  const params = useParams();
  const [overlay, setOverlay] = useState<overlayType>(OverlayDefault);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const currentUser = useAuth();

  useEffect(() => {
    if (props.id) {
      firebaseGetData("overlays", props.id).then((data) => {
        if (data) {
          setOverlay(data as overlayType);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
        }
      });
    } else if (params.id) {
      firebaseGetData("overlays", params.id).then((data) => {
        devConsole.log(data);
        if (data) {
          setOverlay(data as overlayType);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
        }
      });
    } else {
      setLoading(false);
      setError(false);
    }

    return () => {
      setOverlay(OverlayDefault);
      setLoading(true);
      setError(false);
    };
  }, [props.id, params.id]);

  if (error) return <div>Error loading overlay data.</div>;

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return (
      <Protect redirect="/account/login">
        <></>
      </Protect>
    );
  }

  if (
    currentUser.uid !== overlay.metaData.authorID &&
    (props.id || params.id)
  ) {
    return (
      <ErrorPage
        code={403}
        error="You do not have permission to edit this overlay."
      />
    );
  }

  return (
    <PageSeoWrapper
      title={`${props.id || params.id ? "Edit Overlay" : "Create Overlay"} ${separator} ${title}`}
      description="Create and customize overlays for your streams and videos on xcwalker.uk"
    >
      <Section id="OverlayCreate">
        <SideBySide leftWidth="1fr">
          <Sidebar
            overlay={overlay}
            setOverlay={setOverlay}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            id={props.id || params.id}
          />
          <Main overlay={overlay} setOverlay={setOverlay} />
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}

function Sidebar(props: {
  overlay: overlayType;
  setOverlay: (overlay: overlayType) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
  id?: string;
}) {
  const navigate = useNavigate();
  const currentUser = useAuth();

  return (
    <div className={css.sidebar}>
      <Preview overlay={props.overlay} className={css.preview} size="large" />
      <Input
        id="title"
        label="title"
        required
        placeholder="Overlay Title"
        type="text"
        onChange={(e) => {
          props.setOverlay({
            ...props.overlay,
            data: { ...props.overlay.data, title: e.target.value },
          });
        }}
        value={props.overlay.data.title}
      />
      <Button
        href={
          "https://overlay.xcwalker.dev/preview?json=" +
          JSON.stringify(props.overlay)
        }
        external
        style="secondary"
        title="Open Preview In New Tab"
        target="newTab"
        icon={{ gficon: "preview" }}
      >
        Open Preview In New Tab
      </Button>
      {/* Publish Button */}
      <Button
        onClick={() => {
          props.setLoading(true);
          if (!props.id) {
            firebaseCreateData("overlays", {
              ...props.overlay,
              metaData: {
                ...props.overlay.metaData,
                authorID: currentUser?.uid,
              },
            }).then((docref) => {
              if (docref?.id) {
                navigate(`/overlay/${docref.id}`);
                props.setLoading(false);
              } else {
                props.setError(true);
              }
            });
          } else {
            firebaseSetData("overlays", props.id, {
              ...props.overlay,
              metaData: {
                ...props.overlay.metaData,
                date: {
                  ...props.overlay.metaData.date,
                  modified: new Date().toJSON(),
                },
              },
            })
              .then(() => {
                navigate(`/overlay/${props.id}`);
                props.setLoading(false);
              })
              .catch(() => {
                props.setError(true);
                props.setLoading(false);
              });
          }
        }}
        style="primary"
        title="Publish Overlay"
        icon={{ gficon: props.id ? "save" : "publish" }}
      >
        {props.id ? "Update" : "Publish"}
      </Button>
    </div>
  );
}

function Main(props: {
  overlay: overlayType;
  setOverlay: (overlay: overlayType) => void;
}) {
  return (
    <div className={css.main}>
      {/* Headers */}
      <InputGroup>
        <Input
          id="header-text"
          label="header text"
          required
          placeholder="Header Text"
          type="text"
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                header: {
                  ...props.overlay.data.header,
                  main: e.target.value,
                },
              },
            });
          }}
          value={props.overlay.data.header.main}
        />

        <Input
          id="subheader-text"
          label="subheader text"
          required
          placeholder="Subheader Text"
          type="text"
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                header: {
                  ...props.overlay.data.header,
                  sub: e.target.value,
                },
              },
            });
          }}
          value={props.overlay.data.header.sub}
        />
        <InputGroup direction="row">
          <PositionInput
            label="header position"
            id="header-position"
            value={props.overlay.data.header.position}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  header: {
                    ...props.overlay.data.header,
                    position: e.target.value as Overlay_PositionType,
                  },
                },
              });
            }}
          />
          <DirectionInput
            label="header direction"
            id="header-direction"
            value={props.overlay.data.header.direction}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  header: {
                    ...props.overlay.data.header,
                    direction: e.target.value as Overlay_DirectionType,
                  },
                },
              });
            }}
          />
          <PriorityInput
            label="header priority"
            id="header-priority"
            value={props.overlay.data.header.priority}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  header: {
                    ...props.overlay.data.header,
                    priority: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
      </InputGroup>
      {/* Logo */}
      <InputGroup>
        <Input
          id="logo-src"
          label="logo src"
          required
          placeholder="Logo Image URL"
          type="text"
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                logo: {
                  ...props.overlay.data.logo,
                  src: e.target.value,
                },
              },
            });
          }}
          value={props.overlay.data.logo.src}
        />
        <InputGroup direction="row">
          <PositionInput
            label="logo position"
            id="logo-position"
            value={props.overlay.data.logo.position}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  logo: {
                    ...props.overlay.data.logo,
                    position: e.target.value as Overlay_PositionType,
                  },
                },
              });
            }}
          />
          <PriorityInput
            label="logo priority"
            id="logo-priority"
            value={props.overlay.data.logo?.priority || 1}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  logo: {
                    ...props.overlay.data.logo,
                    priority: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
      </InputGroup>
      {/* Socials */}
      <InputGroup>
        <SocialsInput
          label="socials"
          value={props.overlay.data.socials.items}
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                socials: {
                  ...props.overlay.data.socials,
                  items: JSON.parse(e.target.value),
                },
              },
            });
          }}
        />
        <InputGroup direction="row">
          <PositionInput
            label="socials position"
            id="socials-position"
            value={props.overlay.data.socials.position}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  socials: {
                    ...props.overlay.data.socials,
                    position: e.target.value as Overlay_PositionType,
                  },
                },
              });
            }}
          />
          <DirectionInput
            label="socials direction"
            id="socials-direction"
            value={props.overlay.data.socials.direction}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  socials: {
                    ...props.overlay.data.socials,
                    direction: e.target.value as Overlay_DirectionType,
                  },
                },
              });
            }}
          />
          <PriorityInput
            label="socials priority"
            id="socials-priority"
            value={props.overlay.data.socials.priority}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  socials: {
                    ...props.overlay.data.socials,
                    priority: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
      </InputGroup>
      {/* Tags */}
      <InputGroup>
        <TagsInput
          label="tags"
          value={props.overlay.data.tags.items}
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                tags: {
                  ...props.overlay.data.tags,
                  items: JSON.parse(e.target.value),
                },
              },
            });
          }}
        />
        <InputGroup direction="row">
          <PositionInput
            label="tags position"
            id="tags-position"
            value={props.overlay.data.tags.position}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  tags: {
                    ...props.overlay.data.tags,
                    position: e.target.value as Overlay_PositionType | "header",
                  },
                },
              });
            }}
          />
          <DirectionInput
            label="tags direction"
            id="tags-direction"
            value={props.overlay.data.tags.direction}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  tags: {
                    ...props.overlay.data.tags,
                    direction: e.target.value as Overlay_DirectionType,
                  },
                },
              });
            }}
          />
          <PriorityInput
            label="tags priority"
            id="tags-priority"
            value={props.overlay.data.tags.priority}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  tags: {
                    ...props.overlay.data.tags,
                    priority: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
      </InputGroup>
      {/* radio */}
      <InputGroup>
        <InputGroup direction="row">
          {/* visibility */}
          <InputToggle
            label="radio visibility"
            id="radio-visibility"
            checked={props.overlay.data.radio.visibility}
            onChange={(checked) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    visibility: checked,
                  },
                },
              });
            }}
          />
          <InputDropdown
            id="radio-station"
            label="Radio Station"
            value={props.overlay.data.radio.station}
            values={OverlayStations.map((station) => ({
              label: station,
              value: station,
            }))}
            onChange={(value) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    station: value as Overlay_StationType,
                  },
                },
              });
            }}
          />
        </InputGroup>
        <AnimationInput
          id="radio-animation"
          label="Radio Animation"
          duration={props.overlay.data.radio.animation.duration}
          onDurationChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                radio: {
                  ...props.overlay.data.radio,
                  animation: {
                    ...props.overlay.data.radio.animation,
                    duration: parseInt(e.target.value),
                  },
                },
              },
            });
          }}
          value={props.overlay.data.radio.animation.type}
          onChange={(value) => {
            devConsole.log(value);
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                radio: {
                  ...props.overlay.data.radio,
                  animation: {
                    ...props.overlay.data.radio.animation,
                    type: value,
                  },
                },
              },
            });
          }}
        />
        <InputGroup direction="column">
          <InputToggle
            // durationBar
            label="radio duration bar"
            id="radio-duration-bar"
            checked={props.overlay.data.radio.durationBar}
            onChange={(checked) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    durationBar: checked,
                  },
                },
              });
            }}
          />
          <InputDuration
            id="radio-duration"
            label="radio duration (ms)"
            min={-1}
            max={5000}
            step={5}
            value={props.overlay.data.radio.duration}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    duration: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
        <InputGroup direction="row">
          <PositionInput
            label="radio position"
            id="radio-position"
            value={props.overlay.data.radio.position}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    position: e.target.value as Overlay_PositionType,
                  },
                },
              });
            }}
          />
          <PriorityInput
            label="radio priority"
            id="radio-priority"
            value={props.overlay.data.radio.priority}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    priority: parseInt(e.target.value),
                  },
                },
              });
            }}
          />
        </InputGroup>
        <InputToggle
          label="radio show DJ"
          id="radio-show-dj"
          checked={props.overlay.data.radio.showDJ}
          onChange={(checked) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                radio: {
                  ...props.overlay.data.radio,
                  showDJ: checked,
                },
              },
            });
          }}
        />
        <InputToggle
          label="radio show station"
          id="radio-show-station"
          checked={props.overlay.data.radio.showStation}
          onChange={(checked) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                radio: {
                  ...props.overlay.data.radio,
                  showStation: checked,
                },
              },
            });
          }}
        />
      </InputGroup>
    </div>
  );
}

function PositionInput(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.positionInput}>
      <label htmlFor={props.label}>{props.label}</label>
      <div className={css.positions}>
        {OverlayPositions.map((position, index) => (
          <Fragment key={index}>
            <input
              type="radio"
              id={props.id + "-" + position.replace(" ", "-")}
              name={props.label}
              value={position}
              checked={props.value === position}
              onChange={props.onChange}
            />
            <label
              htmlFor={props.id + "-" + position.replace(" ", "-")}
              title={position}
              className={
                css.position + " checked-" + (props.value === position)
              }
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function DirectionInput(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.directionInput}>
      <label htmlFor={props.label}>{props.label}</label>
      <div className={css.directions}>
        {OverlayDirections.map((direction, index) => (
          <Fragment key={index}>
            <input
              key={index}
              type="radio"
              id={props.id + "-" + direction.replace(" ", "-")}
              name={props.label}
              value={direction}
              checked={props.value === direction}
              onChange={props.onChange}
            />
            <label
              htmlFor={props.id + "-" + direction.replace(" ", "-")}
              title={direction}
              className={
                css.direction + " checked-" + (props.value === direction)
              }
            >
              <GFIcon>
                {direction === "row" && "arrow_forward"}
                {direction === "column" && "arrow_downward"}
                {direction === "row-reverse" && "arrow_back"}
                {direction === "column-reverse" && "arrow_upward"}
              </GFIcon>
              {direction}
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function PriorityInput(props: {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.priorityInput}>
      <label htmlFor={props.id + "-priority"}>{props.label}</label>
      <div className={css.priority}>
        <input
          type="number"
          id={props.id + "-priority"}
          name={props.label}
          min={1}
          max={5}
          value={props.value}
          onChange={props.onChange}
        />
        <button
          onClick={() => {
            if (props.value < 5) {
              props.onChange({
                target: { value: (props.value + 1).toString() },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          title="Increase Priority"
        >
          <GFIcon className={css.icon}>keyboard_arrow_up</GFIcon>
        </button>
        <button
          onClick={() => {
            if (props.value > 1) {
              props.onChange({
                target: { value: (props.value - 1).toString() },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          title="Decrease Priority"
        >
          <GFIcon className={css.icon}>keyboard_arrow_down</GFIcon>
        </button>
      </div>
    </div>
  );
}

function SocialsInput(props: {
  label: string;
  value: {
    handle: string;
    platform: string;
  }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.socialsInput}>
      <label htmlFor={props.label}>{props.label}</label>
      {/* list of socials */}
      <div className={css.socials}>
        {props.value.map((social, index) => (
          <div key={index} className={css.social}>
            <Input
              id={`${props.label}-handle-${index}`}
              label="handle"
              required
              placeholder="Social Handle"
              type="text"
              onChange={(e) => {
                const newValue = [...props.value];
                newValue[index].handle = e.target.value;
                props.onChange({
                  target: { value: JSON.stringify(newValue) },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              value={social.handle}
            />
            <Input
              id={`${props.label}-platform-${index}`}
              label="platform"
              required
              placeholder="Social Platform"
              type="text"
              onChange={(e) => {
                const newValue = [...props.value];
                newValue[index].platform = e.target.value;
                props.onChange({
                  target: { value: JSON.stringify(newValue) },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              value={social.platform}
            />
            <Button
              onClick={() => {
                const newValue = [...props.value];
                newValue.splice(index, 1);
                props.onChange({
                  target: { value: JSON.stringify(newValue) },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              title="Remove Social"
              style="remove"
              className={css.removeButton}
            >
              <GFIcon className={css.icon}>delete</GFIcon>
            </Button>
          </div>
        ))}
        <Button
          onClick={() => {
            const newValue = [...props.value, { handle: "", platform: "" }];
            props.onChange({
              target: { value: JSON.stringify(newValue) },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          title="Add Social"
          style="secondary"
          icon={{ gficon: "add" }}
        >
          Add Social
        </Button>
      </div>
    </div>
  );
}

function TagsInput(props: {
  label: string;
  value: (string | { name: string; text: string })[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.tagsInput}>
      <label htmlFor={props.label}>{props.label}</label>
      {/* list of tags */}
      <div className={css.tags}>
        {props.value.map((tag, index) => (
          <div key={index} className={css.tag}>
            {typeof tag !== "string" && (
              <Input
                id={`${props.label}-tag-name-${index}`}
                label="name"
                required
                placeholder="Tag Name"
                type="text"
                onChange={(e) => {
                  const newValue = [...props.value] as {
                    name: string;
                    text: string;
                  }[];
                  newValue[index] = {
                    ...newValue[index],
                    name: e.target.value,
                  };
                  props.onChange({
                    target: { value: JSON.stringify(newValue) },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                value={(tag as { name: string; text: string }).name}
              />
            )}
            <Input
              id={`${props.label}-tag-${index}`}
              label="tag"
              required
              placeholder="Tag Text"
              type="text"
              onChange={(e) => {
                const newValue = [...props.value];
                if (typeof newValue[index] === "string") {
                  newValue[index] = e.target.value;
                } else {
                  newValue[index] = {
                    ...(newValue[index] as { name: string; text: string }),
                    text: e.target.value,
                  };
                }
                props.onChange({
                  target: { value: JSON.stringify(newValue) },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              value={
                typeof tag === "string"
                  ? tag
                  : (tag as { name: string; text: string }).text
              }
            />
            <Button
              onClick={() => {
                const newValue = [...props.value];
                newValue.splice(index, 1);
                props.onChange({
                  target: { value: JSON.stringify(newValue) },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              title="Remove Tag"
              style="remove"
              className={css.removeButton}
            >
              <GFIcon className={css.icon}>delete</GFIcon>
            </Button>
          </div>
        ))}
        <div className={css.addTag}>
          <Button
            onClick={() => {
              const newValue = [...props.value, ""];
              props.onChange({
                target: { value: JSON.stringify(newValue) },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            title="Add Tag"
            style="secondary"
            icon={{ gficon: "add" }}
          >
            Add Tag
          </Button>
          <Button
            onClick={() => {
              const newValue = [...props.value, { name: "", text: "" }];
              props.onChange({
                target: { value: JSON.stringify(newValue) },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            title="Add Tag"
            style="secondary"
            icon={{ gficon: "add" }}
          >
            Add Tag With Name
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnimationInput(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: Overlay_TransitionType) => void;
  duration: number;
  onDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <InputGroup label="Radio Animation" direction="column">
      <InputDropdown
        id={`${props.id}-animation-type`}
        label="Animation Type"
        value={props.value === "none" ? "none" : "transition-" + props.value}
        values={OverlayTransitions.map((transition) => ({
          icon: undefined,
          label: transition,
          value: transition === "none" ? "none" : "transition-" + transition,
        }))}
        onChange={(value) => {
          props.onChange(
            value === "none"
              ? "none"
              : (value.replace("transition-", "") as Overlay_TransitionType)
          );
        }}
      />
      <InputDuration
        id={`${props.id}-animation-duration`}
        label="Animation Duration (ms)"
        value={props.duration}
        min={0}
        max={500}
        step={5}
        onChange={props.onDurationChange}
      />
    </InputGroup>
  );
}
