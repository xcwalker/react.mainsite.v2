import { Fragment, useEffect, useState } from "react";
import {
  Overlay_DirectionType,
  Overlay_PositionType,
  Overlay_StationType,
  OverlayDefault,
  OverlayDirections,
  OverlayPositions,
  OverlayStations,
  OverlayTransitions,
  overlayType,
} from "../../types";
import firebaseGetData from "../../functions/firebase/storage/getData";
import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/overlay/Create.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import GFIcon from "../../components/GFIcon";

export default function OverlayCreate(props: { id?: string }) {
  const params = useParams();
  const [overlay, setOverlay] = useState<overlayType>(OverlayDefault);
  const [loading, setLoading] = useState<boolean>(true);
  const [errpr, setError] = useState<boolean>(false);

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
        if (data) {
          setOverlay(data as overlayType);
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

  if (loading) return <div>Loading...</div>;

  if (errpr) return <div>Error loading overlay data.</div>;

  return (
    <Section id="OverlayCreate">
      <SideBySide leftWidth="1fr">
        <Sidebar overlay={overlay} setOverlay={setOverlay} />
        <Main overlay={overlay} setOverlay={setOverlay} />
      </SideBySide>
    </Section>
  );
}

function Sidebar(props: {
  overlay: overlayType;
  setOverlay: (overlay: overlayType) => void;
}) {
  return (
    <div className={css.sidebar}>
      <Preview overlay={props.overlay} />
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
        style="primary"
        title="Open Preview In New Tab"
        target="newTab"
        icon={{ gficon: "preview" }}
      >
        Open Preview In New Tab
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
          <ToggleInput
            label="radio visibility"
            id="radio-visibility"
            value={props.overlay.data.radio.visibility}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    visibility: e.target.checked,
                  },
                },
              });
            }}
            falseLabel="Hide Radio"
            trueLabel="Show Radio"
            falseIcon="visibility"
            trueIcon="visibility_off"
          />
          <StationSelect
            id="radio-station"
            label="Radio Station"
            value={props.overlay.data.radio.station}
            onChange={(e) => {
              props.setOverlay({
                ...props.overlay,
                data: {
                  ...props.overlay.data,
                  radio: {
                    ...props.overlay.data.radio,
                    station: e.target.value as Overlay_StationType,
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
              }});
            }
          }
          value={props.overlay.data.radio.animation.type}
          onChange={(e) => {
            props.setOverlay({
              ...props.overlay,
              data: {
                ...props.overlay.data,
                radio: {
                  ...props.overlay.data.radio,
                  animation: {
                    ...props.overlay.data.radio.animation,
                    type: e.target.value as typeof OverlayTransitions[number],
                  },
                },
              },
            });
          }}
        />
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
      </InputGroup>
    </div>
  );
}

function Preview(props: { overlay: overlayType }) {
  useEffect(() => {
    // This is to force the iframe to reload when the overlay changes
    const iframe = document.getElementById(
      "overlay-preview"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src =
        "https://overlay.xcwalker.dev/preview?json=" +
        JSON.stringify(props.overlay);
      console.log(iframe.src);
    }
  }, [props.overlay]);

  return (
    <iframe
      src={
        "https://overlay.xcwalker.dev/preview?json=" +
        JSON.stringify(props.overlay)
      }
      className={css.preview}
      id="overlay-preview"
    />
  );
}

function InputGroup(props: { children: React.ReactNode; direction?: string }) {
  return (
    <div className={css.inputGroup + ` direction-${props.direction}`}>
      {props.children}
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

function PriorityInput(props: {
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
                  const newValue = [...props.value];
                  if (typeof newValue[index] === "string") {
                    newValue[index] = { name: e.target.value, text: "" };
                  } else {
                    newValue[index] = {
                      ...newValue[index],
                      name: e.target.value,
                    };
                  }
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
                    ...newValue[index],
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

function ToggleInput(props: {
  id: string;
  label: string;
  value: boolean;
  falseLabel: string;
  trueLabel: string;
  falseIcon: string;
  trueIcon: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.toggleInput}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={css.toggle}>
        <input
          type="checkbox"
          id={props.id}
          checked={props.value}
          onChange={props.onChange}
        />
        <label htmlFor={props.id} className={css.toggleLabels}>
          {props.value ? (
            <>
              <GFIcon>{props.falseIcon}</GFIcon>
              <span className={css.falseLabel}>{props.falseLabel}</span>
            </>
          ) : (
            <>
              <GFIcon>{props.trueIcon}</GFIcon>
              <span className={css.trueLabel}>{props.trueLabel}</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

function StationSelect(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={css.stationSelect}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={css.select}>
        <select id={props.id} value={props.value} onChange={props.onChange}>
          {OverlayStations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
        <GFIcon className={css.icon}>arrow_drop_down</GFIcon>
      </div>
    </div>
  );
}

function AnimationInput(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  duration: number;
  onDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // OverlayTransitions
  // let value be one of OverlayTransitions
  // should include duration input
  return (
    <div className={css.animationInput}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={css.animations}>
        {/* map OverlayTransitions */}
        {OverlayTransitions.map((transition) => (
          <div key={transition} className={css.animation}>
            <input
              type="radio"
              id={`${props.id}-${transition}`}
              name={props.id}
              value={transition}
              checked={props.value === transition}
              onChange={props.onChange}
            />
            <label htmlFor={`${props.id}-${transition}`}>{transition}</label>
          </div>
        ))}
        <div className={css.duration}>
          <label htmlFor={`${props.id}-duration`}>duration (ms)</label>
          <input
            type="number"
            id={`${props.id}-duration`}
            name={`${props.id}-duration`}
            min={0}
            value={props.duration}
            onChange={props.onDurationChange}
          />
        </div>
      </div>
    </div>
  );
}

function DurationInput(props: {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.durationInput}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={css.duration}>
        <input
          type="number"
          id={props.id}
          name={props.label}
          min={-1}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}