import { useEffect, useState } from "react";
import PageSeoWrapper from "../../../components/PageSeoWrapper";
import Section from "../../../components/Section";
import { SidebarContainer } from "../../../components/Sidebar/SidebarContainer";
import SidebarTitle from "../../../components/Sidebar/SidebarTitle";
import SideBySide from "../../../components/SideBySide";
import firebaseGetRealtimeData from "../../../functions/firebase/storage/useRealtimeData";
import Input from "../../../components/Input";
import css from "../../../styles/pages/games/SimpleViewNomination.module.css";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";
import firebaseSetData from "../../../functions/firebase/storage/setData";
import InputDropdown from "../../../components/InputDropdown";
import {
  calculateNewScoreOrGuessNomination,
  predefinedModifiers,
} from "../Nomination";
import GFIcon from "../../../components/GFIcon";
import ErrorPage from "../../../ErrorPage";
import InputGroup from "../../../components/InputGroup";
import {
  NumberOfCardsForRoundNomination,
  suits,
} from "../LiveView/LiveViewNominationV2";
import InputToggle from "../../../components/InputToggle";

export default function SimpleView_Nomination() {
  const { gameID } = useParams<{ gameID: string }>();
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
  const [startDealer, setStartDealer] = useState(0);
  const [modifiers, setModifiers] = useState<
    {
      label: string;
      icon: string;
      round: number;
    }[]
  >([]);
  const [showToast, setShowToast] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

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
    // update live game scores
    if (!gameID || scores === undefined || !(scores[0].scores.length > 0))
      return;

    firebaseSetData(
      "games",
      gameID,
      {
        JSON: JSON.stringify(scores),
        currentRound,
        startDealer,
        modifiers: JSON.stringify(modifiers),
      },
      {
        toast: showToast
          ? {
              success: "Game updated successfully.",
              error: "Error updating game.",
              loading: "Updating game...",
            }
          : {
              noToast: true,
            },
      }
    );
  }, [scores, gameID, currentRound, startDealer, modifiers, showToast]);

  if (error) {
    return <ErrorPage code={404} error="Error fetching game data" />;
  }

  return (
    <PageSeoWrapper title={`Simple View Nomination`}>
      <Section id="simpleview-nomination">
        <SideBySide leftWidth="350px">
          <Sidebar
            setCurrentRound={setCurrentRound}
            currentRound={currentRound}
            maxRounds={scores ? scores[0].scores.length - 1 : 0}
            setModifiers={setModifiers}
            modifiers={modifiers}
            scores={scores || []}
            showToast={showToast}
            setShowToast={setShowToast}
            startDealerIndex={startDealer}
          />
          <main className={css.main}>
            {scores && scores.length > 0 ? (
              scores.map((player, index) => (
                <PlayerRenderer
                  key={index}
                  player={player}
                  currentRound={currentRound}
                  setScores={setScores}
                  numberOfPlayers={scores.length}
                  isCurrentDealer={
                    (startDealer + currentRound) % scores.length === index
                  }
                />
              ))
            ) : (
              <p>No players found.</p>
            )}
          </main>
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}

function Sidebar(props: {
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  currentRound: number;
  maxRounds: number;
  setModifiers: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        icon: string;
        round: number;
      }[]
    >
  >;
  modifiers: {
    label: string;
    icon: string;
    round: number;
  }[];
  scores: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  }[];
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  startDealerIndex: number;
}) {
  const {
    setCurrentRound,
    currentRound,
    setModifiers,
    modifiers,
    scores,
    showToast,
    setShowToast,
    startDealerIndex,
  } = props;
  const activeModifiers = modifiers.filter((mod) => mod.round === currentRound);

  return (
    <SidebarContainer>
      <SidebarTitle title="Simple View" subtitle="Nomination" />
      <Button title="Back To Table View" href="../" style="secondary" centered>
        Back To Table View
      </Button>
      <InputToggle
        label="Show Toast Updates"
        id="show-toast-toggle"
        checked={showToast}
        onChange={(checked) => {
          setShowToast(checked);
        }}
      />
      <InputGroup>
        <Input
          id="input-round"
          label="Round"
          type="number"
          min={1}
          max={props.maxRounds + 1}
          value={currentRound + 1}
          onChange={(e) => setCurrentRound(Number(e.target.value) - 1)}
        />
        <div className={css.buttons}>
          <Button
            onClick={() => setCurrentRound((prev) => Math.max(prev - 1, 0))}
            title="Previous Round"
            style="secondary"
            centered
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentRound((prev) => Math.min(prev + 1, props.maxRounds))
            }
            title="Next Round"
            style="primary"
            centered
          >
            Next
          </Button>
        </div>
      </InputGroup>

      <InputDropdown
        id="modifier-quick-add-dropdown"
        placeholder="Modifier Quick Add"
        values={predefinedModifiers}
        value={""}
        onChange={(value) =>
          setModifiers((prev) => [
            ...prev,
            {
              label:
                predefinedModifiers.find((v) => v.value === value)?.label ||
                "Custom Modifier",
              icon:
                predefinedModifiers.find((v) => v.value === value)?.icon ||
                "person_edit",
              round: currentRound,
            },
          ])
        }
        label="Quick Add"
      />

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
        header="Cards"
        info={NumberOfCardsForRoundNomination({
          roundIndex: currentRound,
          numberOfPlayers: scores.length,
        }).toString()}
      />
      <InfoLine
        header="Dealer"
        info={
          scores[
            (startDealerIndex + currentRound) % scores.length
          ]?.player
        }
      />
      <InfoLine
        header="Trump"
        info={suits[currentRound % suits.length]}
      />
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
    </SidebarContainer>
  );
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

function PlayerRenderer(props: {
  player: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  };
  currentRound: number;
  startDealerIndex?: number;
  setScores: React.Dispatch<
    React.SetStateAction<
      | {
          player: string;
          scores: { roundScore: number; guess: number; runningTotal: number }[];
        }[]
      | undefined
    >
  >;
  numberOfPlayers: number;
  isCurrentDealer: boolean;
}) {
  const {
    player,
    currentRound: currentRoundIndex,
    setScores,
    numberOfPlayers,
    isCurrentDealer,
  } = props;

  if (setScores === undefined) {
    return null;
  }

  return (
    <div
      key={currentRoundIndex}
      className={css.player + (isCurrentDealer ? ` ${css.currentDealer}` : "")}
    >
      <InfoLine header="Player" info={player.player} />
      <Input
        id={`player-${player.player}-guess`}
        label="Guess"
        type="number"
        value={player.scores[currentRoundIndex]?.guess || 0}
        onChange={(e) => {
          setScores((prevScores) => {
            if (!prevScores) return prevScores;

            const playerIndex = prevScores.findIndex(
              (p) => p.player === player.player
            );
            if (playerIndex !== -1) {
              return calculateNewScoreOrGuessNomination(
                prevScores,
                playerIndex,
                currentRoundIndex,
                {
                  guess: parseInt(e.target.value, 10),
                }
              );
            }
            return prevScores;
          });
        }}
        min={0}
        max={NumberOfCardsForRoundNomination({
          roundIndex: currentRoundIndex,
          numberOfPlayers: numberOfPlayers,
        })}
      />
      <Input
        id={`player-${player.player}-round-score`}
        label="Round Score"
        type="number"
        value={player.scores[currentRoundIndex]?.roundScore || 0}
        onChange={(e) => {
          setScores((prevScores) => {
            if (!prevScores) return prevScores;
            
            const playerIndex = prevScores.findIndex(
              (p) => p.player === player.player
            );
            if (playerIndex !== -1) {
              return calculateNewScoreOrGuessNomination(
                prevScores,
                playerIndex,
                currentRoundIndex,
                {
                  score: parseInt(e.target.value, 10),
                }
              );
            }
            return prevScores;
          });
        }}
        min={-1}
        max={NumberOfCardsForRoundNomination({
          roundIndex: currentRoundIndex,
          numberOfPlayers: numberOfPlayers,
        })}
      />
      <InfoLine
        header="Running Total"
        info={player.scores[currentRoundIndex]?.runningTotal.toString()}
      />
    </div>
  );
}
