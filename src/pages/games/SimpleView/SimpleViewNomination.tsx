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
  findRoundPlayersMaxTotalScore,
  predefinedModifiers,
  updateLiveScoresNomination,
} from "../Nomination";
import GFIcon from "../../../components/GFIcon";
import ErrorPage from "../../../ErrorPage";
import InputGroup from "../../../components/InputGroup";
import {
  NumberOfCardsForRoundNomination,
  suits,
} from "../LiveView/LiveViewNominationV2";
import InputToggle from "../../../components/InputToggle";
import { separator, title } from "../../../App";
import IconButton from "../../../components/IconButton";

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

  // update live game scores
  // useEffect(() => {
  //   if (!gameID || scores === undefined || !(scores[0].scores.length > 0))
  //     return;

  //   firebaseSetData(
  //     "games",
  //     gameID,
  //     {
  //       JSON: JSON.stringify(scores),
  //       currentRound,
  //       startDealer,
  //       modifiers: JSON.stringify(modifiers),
  //     },
  //     {
  //       toast: showToast
  //         ? {
  //             success: "Game updated successfully.",
  //             error: "Error updating game.",
  //             loading: "Updating game...",
  //           }
  //         : {
  //             noToast: true,
  //           },
  //     }
  //   );
  // }, [scores, gameID, currentRound, startDealer, modifiers, showToast]);

  if (error) {
    return <ErrorPage code={404} error="Error fetching game data" />;
  }

  return (
    <PageSeoWrapper
      title={`Simple View Nomination ${separator} ${title}`}
      description={`Simple View Nomination on ${title}`}
    >
      <Section id="simpleview-nomination">
        <SideBySide leftWidth="350px">
          <Sidebar
            gameID={gameID || ""}
            JsonObject={JsonObject}
            currentRound={currentRound}
            maxRounds={scores ? scores[0].scores.length - 1 : 0}
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
                  gameID={gameID || ""}
                  JsonObject={JsonObject}
                  player={player}
                  currentRound={currentRound}
                  scores={scores}
                  numberOfPlayers={scores.length}
                  isCurrentDealer={
                    (startDealer + currentRound) % scores.length === index
                  }
                  showToast={showToast}
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
  gameID: string;
  JsonObject: {
    JSON?: string;
    currentRound?: number;
    startDealer?: number;
    modifiers?: string;
  };
  currentRound: number;
  maxRounds: number;
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
    gameID,
    JsonObject,
    currentRound,
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
          onChange={(e) =>
            firebaseSetData(
              "games",
              gameID,
              {
                ...JsonObject,
                currentRound: parseInt(e.target.value, 10) - 1 || 0,
              },
              {
                toast: showToast
                  ? {
                      success: "Round changed successfully.",
                      error: "Error changing round.",
                      loading: "Changing round...",
                    }
                  : {
                      noToast: true,
                    },
              }
            )
          }
        />
        <div className={css.buttons}>
          <Button
            onClick={() =>
              firebaseSetData(
                "games",
                gameID,
                {
                  ...JsonObject,
                  currentRound: Math.max(currentRound - 1, 0),
                },
                {
                  toast: showToast
                    ? {
                        success: "Round changed successfully.",
                        error: "Error changing round.",
                        loading: "Changing round...",
                      }
                    : {
                        noToast: true,
                      },
                }
              )
            }
            title="Previous Round"
            style="secondary"
            centered
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              firebaseSetData(
                "games",
                gameID,
                {
                  ...JsonObject,
                  currentRound: Math.min(currentRound + 1, props.maxRounds),
                },
                {
                  toast: showToast
                    ? {
                        success: "Round changed successfully.",
                        error: "Error changing round.",
                        loading: "Updating round...",
                      }
                    : {
                        noToast: true,
                      },
                }
              )
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
          firebaseSetData(
            "games",
            gameID,
            {
              ...JsonObject,
              modifiers: JSON.stringify([
                ...modifiers,
                {
                  ...predefinedModifiers.find((mod) => mod.value === value),
                  round: currentRound,
                },
              ]),
            },
            {
              toast: showToast
                ? {
                    success: "Modifier added successfully.",
                    error: "Error adding modifier.",
                    loading: "Adding modifier...",
                  }
                : {
                    noToast: true,
                  },
            }
          )
        }
        label="Quick Add"
      />

      {activeModifiers && activeModifiers.length > 0 && (
        <InfoLine header="Modifiers">
          {activeModifiers.map((mod, index) => (
            <div key={index} className={css.modifier}>
              <GFIcon className={css.icon}>{mod.icon}</GFIcon>
              <span>{mod.label}</span>
              <IconButton
                icon={{ gficon: "delete" }}
                title="Remove Modifier"
                style="danger"
                onClick={() =>
                  firebaseSetData("games", gameID, {
                    ...JsonObject,
                    modifiers: JSON.stringify(
                      modifiers.filter((m) => m !== mod)
                    ),
                  })
                }
              />
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
        info={scores[(startDealerIndex + currentRound) % scores.length]?.player}
      />
      <InfoLine header="Trump" info={suits[currentRound % suits.length]} />
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
        danger={
          scores?.reduce((total, player) => {
            return total + (player.scores[currentRound]?.guess || 0);
          }, 0) ===
          NumberOfCardsForRoundNomination({
            roundIndex: currentRound,
            numberOfPlayers: scores.length,
          })
        }
      />
      <InfoLine
        header="Total Round Score"
        info={
          scores
            ?.reduce((total, player) => {
              return total + (player.scores[currentRound]?.roundScore || 0);
            }, 0)
            .toString() +
          " / " +
          NumberOfCardsForRoundNomination({
            roundIndex: currentRound,
            numberOfPlayers: scores.length,
          })
        }
        danger={
          scores?.reduce((total, player) => {
            return total + (player.scores[currentRound]?.roundScore || 0);
          }, 0) >
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
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={
        css.infoLine +
        (props.accent ? ` ${css.accent}` : "") +
        (props.danger ? ` ${css.danger}` : "")
      }
    >
      <span className={css.header}>{props.header}</span>
      {props.info && <span className={css.info}>{props.info}</span>}
      {props.children}
    </div>
  );
}

function PlayerRenderer(props: {
  gameID: string;
  JsonObject: {
    JSON?: string;
    currentRound?: number;
    startDealer?: number;
    modifiers?: string;
  };
  player: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  };
  currentRound: number;
  startDealerIndex?: number;
  scores: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  }[];
  numberOfPlayers: number;
  isCurrentDealer: boolean;
  showToast: boolean;
}) {
  const {
    player,
    currentRound: currentRoundIndex,
    scores,
    numberOfPlayers,
    isCurrentDealer,
    gameID,
    JsonObject,
    showToast,
  } = props;

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
          updateLiveScoresNomination(
            gameID,
            JsonObject,
            scores,
            scores.findIndex((p) => p.player === player.player),
            currentRoundIndex,
            { guess: parseInt(e.target.value, 10) },
            showToast
          );
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
          updateLiveScoresNomination(
            gameID,
            JsonObject,
            scores,
            scores.findIndex((p) => p.player === player.player),
            currentRoundIndex,
            { score: parseInt(e.target.value, 10) },
            showToast
          );
        }}
        min={-1}
        max={NumberOfCardsForRoundNomination({
          roundIndex: currentRoundIndex,
          numberOfPlayers: numberOfPlayers,
        })}
      />
      <InfoLine
        header="Running Total"
        info={(player.scores[currentRoundIndex]?.runningTotal || 0).toString()}
        accent={
          findRoundPlayersMaxTotalScore(scores, currentRoundIndex) ===
          player.scores[currentRoundIndex]?.runningTotal
        }
      />
    </div>
  );
}
