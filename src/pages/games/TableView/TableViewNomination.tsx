import { useEffect, useState } from "react";
import NoSleep from "nosleep.js";
import { useParams } from "react-router-dom";
import firebaseGetRealtimeData from "../../../functions/firebase/storage/useRealtimeData";
import ErrorPage from "../../../ErrorPage";
import Section from "../../../components/Section";
import css from "../../../styles/pages/games/TableViewNomination.module.css";
import devConsole from "../../../functions/devConsole";
import PageSeoWrapper from "../../../components/PageSeoWrapper";
import { separator, title } from "../../../App";
import { InputRange } from "../../../components/InputRange";
import GFIcon from "../../../components/GFIcon";
import Button from "../../../components/Button";

const noSleep = new NoSleep();

export default function TableView_Nomination() {
  const { gameID } = useParams<{ gameID: string }>();
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState<
    | {
        player: string;
        scores: { roundScore: number; guess: number; runningTotal: number }[];
      }[]
    | undefined
  >(undefined);
  const [JsonObject, setJsonObject] = useState<{
    JSON?: string;
    currentRound?: number;
    startDealer?: number;
    modifiers?: string;
  }>({});
  const [error, setError] = useState<boolean>(false);
  const [textScaleFactor, setTextScaleFactor] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [directionCount, setDirectionCount] = useState<1 | 2 | 3 | 4>(1);
  const [startDealer, setStartDealer] = useState(0);
  const [modifiers, setModifiers] = useState<
    {
      label: string;
      icon: string;
      round: number;
    }[]
  >([]);
  const [noSleepEnabled, setNoSleepEnabled] = useState(false);

  useEffect(() => {
    if (!gameID) {
      setError(true);
      return;
    }
    firebaseGetRealtimeData(
      "games",
      gameID,
      setJsonObject as React.Dispatch<React.SetStateAction<unknown>>,
      setError,
    );
  }, [gameID]);

  useEffect(() => {
    if (!JsonObject) return;

    if (JsonObject.JSON) {
      setScores(
        JSON.parse(JsonObject.JSON) as {
          player: string;
          scores: { roundScore: number; guess: number; runningTotal: number }[];
        }[],
      );
    }
    if (JsonObject.currentRound !== undefined) {
      setCurrentRound(JsonObject.currentRound);
    }

    if (JsonObject.startDealer !== undefined) {
      setStartDealer(JsonObject.startDealer);
    }
    if (JsonObject.modifiers) {
      setModifiers(JSON.parse(JsonObject.modifiers));
    }
  }, [JsonObject]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", (e) => {
      devConsole.log("Fullscreen change", e);
      if (!document.fullscreenElement) {
        setFullscreen(false);
        document.documentElement.classList.remove(css.nominationFullscreen);
      }
    });
  }, []);

  if (error || !gameID)
    return <ErrorPage code={404} error="Error fetching game data" />;

  return (
    <PageSeoWrapper
      title={`Live View Nomination ${separator} ${title}`}
      description={`Live View Nomination on ${title}`}
    >
      <Section
        id="liveView-nomination"
        className={css.nomination}
        container={{
          className: css.nominationContainer,
        }}
      >
        <div className={css.controls}>
          <InputRange
            id="directionCount"
            label="Direction Count"
            value={directionCount}
            min={1}
            max={4}
            step={1}
            onChange={(e) =>
              setDirectionCount(parseInt(e.target.value) as 1 | 2 | 3 | 4)
            }
            showValue={false}
          />
          <InputRange
            id="textScaleFactor"
            label="Text Scale Factor"
            value={textScaleFactor}
            min={0.5}
            max={3}
            step={0.1}
            onChange={(e) => setTextScaleFactor(parseFloat(e.target.value))}
            showValue={false}
          />
          <Button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                document.documentElement.classList.add(
                  css.nominationFullscreen,
                );
                setFullscreen(true);
              } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                  document.documentElement.classList.remove(
                    css.nominationFullscreen,
                  );
                  setFullscreen(false);
                }
              }
            }}
            style="primary"
            title="Fullscreen"
            icon={{ gficon: fullscreen ? "fullscreen_exit" : "fullscreen" }}
            width="fit-content"
          >
            {fullscreen ? "Exit" : "Enter"} Fullscreen
          </Button>
          <Button
            onClick={() => {
              if (!noSleepEnabled) {
                noSleep.enable();
                setNoSleepEnabled(true);
              } else {
                noSleep.disable();
                setNoSleepEnabled(false);
              }
            }}
            style="primary"
            title="No Sleep"
            icon={{ gficon: noSleepEnabled ? "power_off" : "power" }}
            width="fit-content"
          >
            {noSleepEnabled ? "Disable" : "Enable"} No Sleep
          </Button>
        </div>
        <div
          className={css.wrapper + " " + css["directionCount" + directionCount]}
          style={{ fontSize: `${textScaleFactor}rem` }}
        >
          {scores &&
            Array.from({ length: directionCount }).map((_, index) => {
              return (
                <Cards
                  key={index}
                  index={index + 1}
                  directionCount={directionCount}
                  scores={scores}
                  currentRound={currentRound}
                  startDealerIndex={startDealer}
                  modifiers={modifiers}
                />
              );
            })}
        </div>
      </Section>
    </PageSeoWrapper>
  );
}

function Cards(props: {
  key: number;
  index: number;
  directionCount: number;
  scores: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  }[];
  currentRound: number;
  startDealerIndex: number;
  modifiers?: {
    label: string;
    icon: string;
    round: number;
  }[];
}) {
  const { modifiers, currentRound, scores, index, directionCount } = props;

  const activeModifiers = modifiers?.filter(
    (mod) => mod.round === currentRound,
  );

  return (
    <div
      className={css.cards}
      style={
        {
          gridArea:
            index === 1
              ? "one"
              : index === 2
                ? "two"
                : index === 3
                  ? "three"
                  : "four",
          writingMode: WritingMode({ directionCount, index }),
          rotate: Rotate({ directionCount, index }),
          "--_svg-rotate":
            WritingMode({ directionCount, index }) === "sideways-lr"
              ? "-90deg"
              : WritingMode({ directionCount, index }) === "sideways-rl"
                ? "90deg"
                : "0deg",
        } as React.CSSProperties
      }
    >
      <div className={css.details}>
        <InfoLine header="Round" info={(props.currentRound + 1).toString()} />
        <InfoLine
          header="Cards"
          info={NumberOfCardsForRoundNomination({
            roundIndex: props.currentRound,
            numberOfPlayers: props.scores.length,
          }).toString()}
        />
        <InfoLine
          header="Dealer"
          info={
            props.scores[
              (props.startDealerIndex + props.currentRound) %
                props.scores.length
            ]?.player
          }
        />
        <InfoLine
          header="Total Round Guess"
          info={
            scores
              ?.reduce((total, player) => {
                return total + (player.scores[currentRound]?.guess ?? 0);
              }, 0)
              .toString() +
            " / " +
            NumberOfCardsForRoundNomination({
              roundIndex: currentRound,
              numberOfPlayers: scores.length,
            })
          }
        />
      </div>
      <InfoLine header="Trump">
        <div className={css.suit}>
          <SuitRenderer index={props.currentRound} />
        </div>
      </InfoLine>
      {activeModifiers && activeModifiers.length > 0 && (
        <InfoLine header="Modifiers">
          {activeModifiers.map((mod, index) => (
            <div key={index} className={css.modifier}>
              <GFIcon className={css.icon}>{mod.icon}</GFIcon>
              <span>{mod.label}</span>
            </div>
          ))}
        </InfoLine>
      )}
    </div>
  );
}

export const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];

export function NumberOfCardsForRoundNomination(props: {
  roundIndex: number;
  numberOfPlayers: number;
}) {
  const { roundIndex, numberOfPlayers } = props;

  const maxCards = Math.floor(52 / numberOfPlayers) * 2; // Assuming 4 players for maxCards calculation

  return roundIndex < maxCards / 2
    ? maxCards / 2 - roundIndex
    : roundIndex - maxCards / 2 + 1;
}

function InfoLine(props: {
  header: string;
  info?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={css.infoLine}>
      <span className={css.header}>{props.header}</span>
      {props.info && <span className={css.info}>{props.info}</span>}
      {props.children}
    </div>
  );
}

function SuitRenderer(props: { index: number }) {
  const { index } = props;

  const suit = suits[index % suits.length];

  if (suit === "Hearts") {
    return <img src="/suit-Hearts.svg" alt="Hearts" loading="lazy" />;
  } else if (suit === "Clubs") {
    return <img src="/suit-Clubs.svg" alt="Clubs" loading="lazy" />;
  } else if (suit === "Diamonds") {
    return <img src="/suit-Diamonds.svg" alt="Diamonds" loading="lazy" />;
  } else if (suit === "Spades") {
    return <img src="/suit-Spades.svg" alt="Spades" loading="lazy" />;
  }
}

function WritingMode(props: { directionCount: number; index: number }) {
  const { directionCount, index } = props;

  if (directionCount === 1 || directionCount === 2) {
    return "unset";
  }

  if (directionCount === 3) {
    if (index === 3) {
      return "sideways-lr";
    } else {
      return "unset";
    }
  }

  if (directionCount === 4) {
    if (index === 1) {
      return "sideways-rl";
    } else if (index === 4) {
      return "sideways-lr";
    } else {
      return "unset";
    }
  }

  return "unset";
}

function Rotate(props: { directionCount: number; index: number }) {
  const { directionCount, index } = props;

  if (directionCount === 1) {
    return "unset";
  }

  if (directionCount === 2) {
    if (index === 1) {
      return "180deg";
    } else {
      return "unset";
    }
  }

  if (directionCount === 3) {
    if (index === 1) {
      return "180deg";
    } else {
      return "unset";
    }
  }

  if (directionCount === 4) {
    if (index === 2) {
      return "180deg";
    } else {
      return "unset";
    }
  }

  return "unset";
}
