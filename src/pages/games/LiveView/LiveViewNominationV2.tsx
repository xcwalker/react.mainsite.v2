import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebaseGetRealtimeData from "../../../functions/firebase/storage/useRealtimeData";
import ErrorPage from "../../../ErrorPage";
import Section from "../../../components/Section";
import css from "../../../styles/pages/games/LiveViewNominationV2.module.css";
import Button from "../../../components/Button";
import devConsole from "../../../functions/devConsole";
import PageSeoWrapper from "../../../components/PageSeoWrapper";
import { separator, title } from "../../../App";
import SideBySide from "../../../components/SideBySide";
import { InputRange } from "../../../components/InputRange";
import { SuitRenderer } from "./LiveViewNomination";
import { SidebarContainer } from "../../../components/Sidebar/SidebarContainer";
import GFIcon from "../../../components/GFIcon";

export default function LiveView_Nomination() {
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
  const [startDealer, setStartDealer] = useState(0);
  const [modifiers, setModifiers] = useState<
    {
      label: string;
      icon: string;
      round: number;
    }[]
  >([]);

  useEffect(() => {
    if (!gameID) {
      setError(true);
      return;
    }
    firebaseGetRealtimeData(
      "games",
      gameID,
      setJsonObject as React.Dispatch<React.SetStateAction<unknown>>,
      setError
    );
  }, [gameID]);

  useEffect(() => {
    if (!JsonObject) return;

    if (JsonObject.JSON) {
      setScores(
        JSON.parse(JsonObject.JSON) as {
          player: string;
          scores: { roundScore: number; guess: number; runningTotal: number }[];
        }[]
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
        container={{ className: css.nominationContainer }}
      >
        <SideBySide leftWidth="350px" className={css.sideBySide}>
          {scores && (
            <Sidebar
              scores={scores}
              currentRound={currentRound}
              startDealerIndex={startDealer}
              modifiers={modifiers}
              fullscreen={fullscreen}
              setFullscreen={setFullscreen}
              textScaleFactor={textScaleFactor}
              setTextScaleFactor={setTextScaleFactor}
            />
          )}
          <main>
            <div
              className={css.scoresContainer}
              style={{ fontSize: `${textScaleFactor}rem` }}
            >
              {scores && scores.length > 0 ? (
                scores.map((player, index) => (
                  <PlayerRenderer
                    key={index}
                    player={player}
                    currentRound={currentRound}
                  />
                ))
              ) : (
                <p>No players found.</p>
              )}
            </div>
          </main>
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}

function Sidebar(props: {
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
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  textScaleFactor: number;
  setTextScaleFactor: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    modifiers,
    currentRound,
    fullscreen,
    setFullscreen,
    textScaleFactor,
    setTextScaleFactor,
    scores,
  } = props;

  const activeModifiers = modifiers?.filter(
    (mod) => mod.round === currentRound
  );

  return (
    <SidebarContainer className={css.sidebar}>
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
            (props.startDealerIndex + props.currentRound) % props.scores.length
          ]?.player
        }
      />
      <InfoLine header="Trump" info={suits[props.currentRound % suits.length]}>
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
      <InfoLine
        header="Total Round Guess"
        info={
          scores
            ?.reduce((total, player) => {
              return total + (player.scores[currentRound]?.guess || 0);
            }, 0)
            .toString() +
          " / " +
          NumberOfCardsForRoundNomination({
            roundIndex: currentRound,
            numberOfPlayers: scores.length,
          })
        }
      />
      <div className={css.controls}>
        <Button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
              document.documentElement.classList.add(css.nominationFullscreen);
              setFullscreen(true);
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
                document.documentElement.classList.remove(
                  css.nominationFullscreen
                );
                setFullscreen(false);
              }
            }
          }}
          style="primary"
          title="Fullscreen"
          icon={{ gficon: fullscreen ? "fullscreen_exit" : "fullscreen" }}
        >
          {fullscreen ? "Exit" : "Enter"} Fullscreen
        </Button>
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
      </div>
    </SidebarContainer>
  );
}

function PlayerRenderer(props: {
  player: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  };
  currentRound: number;
  startDealerIndex?: number;
}) {
  const { player, currentRound: currentRoundIndex } = props;

  return (
    <div key={currentRoundIndex} className={css.player}>
      <InfoLine header="Player" info={player.player} />
      <InfoLine
        header="Guess"
        info={player.scores[currentRoundIndex]?.guess.toString()}
      />
      <InfoLine
        header="Round Score"
        info={player.scores[currentRoundIndex]?.roundScore.toString()}
      />
      <InfoLine
        header="Running Total"
        info={player.scores[currentRoundIndex]?.runningTotal.toString()}
      />
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
