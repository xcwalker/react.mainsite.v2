import { Fragment, useEffect, useState } from "react";
import Section from "../../components/Section";
import css from "../../styles/pages/games/Nomination.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AccountPage from "../../components/Security/AccountPage";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../../ErrorPage";
import firebaseSetData from "../../functions/firebase/storage/setData";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import firebaseGetData from "../../functions/firebase/storage/getData";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { InputDropdownPill } from "../../components/InputDropdown";
import Modal from "../../components/Modal";
import GFIcon from "../../components/GFIcon";
import InputToggle from "../../components/InputToggle";

export default function Game_Nomination() {
  const { gameID } = useParams();
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState<
    {
      player: string;
      scores: { roundScore: number; guess: number; runningTotal: number }[];
    }[]
  >([
    {
      player: "",
      scores: [],
    },
  ]);
  const [startDealer, setStartDealer] = useState(0);
  const [modifiers, setModifiers] = useState<
    {
      label: string;
      icon: string;
      round: number;
    }[]
  >([]);
  const [modifierModalOpen, setModifierModalOpen] = useState(false);
  const [JsonObject, setJsonObject] = useState<{
    JSON?: string;
    currentRound?: number;
    startDealer?: number;
    modifiers?: string;
  }>({});
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState(false);
  const [currentRound, setCurrentRound] = useState(-1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Reset scores if the number of players changes
    if (!gameID) return;

    firebaseGetData("games", gameID).then((data) => {
      // @ts-expect-error Will Work Generic Function
      setJsonObject(data);
      setGameStarted(true);
    });
  }, [gameID]);

  useEffect(() => {
    if (JsonObject.JSON) {
      try {
        const parsed = JSON.parse(JsonObject.JSON as string);
        setScores(parsed);
        setCurrentRound(JsonObject.currentRound || 0);
        setStartDealer(JsonObject.startDealer || 0);
        setModifiers(
          JsonObject.modifiers ? JSON.parse(JsonObject.modifiers) : []
        );
      } catch (e) {
        console.error("Error parsing JSON:", e);
        setError(true);
      }
    }
  }, [JsonObject]);

  useEffect(() => {
    // Initialize scores for each player when the game starts
    if (gameID) return;

    if (gameStarted) {
      const numberOfRounds = Math.floor(52 / scores.length) * 2; // Set the number of rounds

      setScores((prevScores) =>
        prevScores.map((player, index) => ({
          player: player.player || "Player " + (index + 1),
          scores: Array.from({ length: numberOfRounds }, () => ({
            roundScore: -1,
            runningTotal: 0,
            guess: 0,
          })),
        }))
      );
    }
  }, [gameStarted, scores.length, gameID]);

  useEffect(() => {
    // update live game scores
    if (!gameID || !(scores[0].scores.length > 0)) return;

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

  if (!gameStarted) {
    return (
      <PageSeoWrapper
        title={`Nomination ${separator} ${title}`}
        description="Welcome to Nomination!"
      >
        <AccountPage id="nomination">
          <h1>Nomination</h1>
          <p>Welcome to Nomination! Click the button below to start.</p>

          {scores.map((playerScore, index) => (
            <Fragment key={index}>
              <Input
                id={`player-name-${index}`}
                value={playerScore.player}
                onChange={(e) =>
                  setScores((prevScores) =>
                    prevScores.map((p, pIdx) =>
                      pIdx === index ? { ...p, player: e.target.value } : p
                    )
                  )
                }
                placeholder="Enter player name"
                label="Player Name"
              />
            </Fragment>
          ))}
          <Button
            onClick={() =>
              setScores((prevScores) => [
                ...prevScores,
                { player: "", scores: [] },
              ])
            }
            style="secondary"
            title="Add Player"
            icon={{ gficon: "person_add" }}
          >
            Add Player
          </Button>

          <Button
            style="primary"
            title="Start Game"
            onClick={() => setGameStarted(true)}
            icon={{ gficon: "play_arrow" }}
          >
            Start Game
          </Button>
        </AccountPage>
      </PageSeoWrapper>
    );
  }

  if (error) return <ErrorPage code={404} error="Game not found" />;

  const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];

  return (
    <PageSeoWrapper
      title={`Nomination ${separator} ${title}`}
      description="Manage your Nomination here."
    >
      <Section id="nomination">
        <div className={css.controls}>
          {!gameID && currentUser && (
            <Button
              onClick={() => {
                devConsole.log(
                  "Creating new game with scores:",
                  scores,
                  JSON.stringify(scores)
                );
                firebaseCreateData("games", {
                  JSON: JSON.stringify(scores),
                  currentRound: 0,
                }).then((res) => {
                  if (res) {
                    navigate(`./${res.id}/`);
                  }
                });
              }}
              style="primary"
              title="Start Live View"
              icon={{ gficon: "live_tv" }}
              width="fit-content"
            >
              Start Live View
            </Button>
          )}
          {gameID && (
            <>
              <Button
                href="./live"
                style="primary"
                title="Open Live View"
                icon={{ gficon: "live_tv" }}
                external
                target="newTab"
                width="fit-content"
              >
                Open Live View
              </Button>
              <input
                type="number"
                min={1}
                max={Math.floor(52 / scores.length) * 2}
                value={currentRound + 1}
                onChange={(e) =>
                  setCurrentRound(parseInt(e.target.value, 10) - 1 || 0)
                }
              />
              <InputToggle
                id="toast-toggle"
                label="Show Update Toasts"
                checked={showToast}
                onChange={(checked) => setShowToast(checked)}
              />
            </>
          )}
          <InputDropdownPill
            id="start-dealer-dropdown"
            values={scores.map((s, index) => {
              return { value: index, label: s.player };
            })}
            value={startDealer}
            onChange={(value) => {
              setStartDealer(value as number);
            }}
          />
          <Button
            onClick={() => setModifierModalOpen(true)}
            style="secondary"
            title="Manage Modifiers"
            icon={{ gficon: "tune" }}
            width="fit-content"
          >
            Manage Modifiers
          </Button>
          {/* Modifier Quick Add To Current Round */}
          <InputDropdownPill
            id="modifier-quick-add-dropdown"
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
            placeholder="Modifier Quick Add"
          />
        </div>
        <ul className={css.scoreboard}>
          <li className={css.infoColumn}>
            <li className={css.header}></li>
            <ol>
              <li className={css.header}>
                <span>Cards</span>
              </li>
              {Array.from(
                { length: Math.floor(52 / scores.length) * 2 },
                (_, i) => {
                  const maxCards = Math.floor(52 / scores.length) * 2;
                  return (
                    <li
                      key={i}
                      className={i === currentRound ? css.currentRound : ""}
                    >
                      {i < maxCards / 2
                        ? (Math.floor(52 / scores.length) * 2) / 2 - i
                        : i - (Math.floor(52 / scores.length) * 2) / 2 + 1}
                    </li>
                  );
                }
              )}
            </ol>
          </li>
          <li className={css.infoColumn}>
            <li className={css.header} />
            <ol>
              <li className={css.header}>
                <span>Trumps</span>
              </li>
              {Array.from(
                { length: Math.floor(52 / scores.length) * 2 },
                (_, i) => (
                  <li
                    key={i}
                    title={suits[i % suits.length]}
                    className={i === currentRound ? css.currentRound : ""}
                  >
                    {suits[i % suits.length].slice(0, 1)}
                  </li>
                )
              )}
            </ol>
          </li>
          <li className={css.infoColumn}>
            <li className={css.header} />
            <ol>
              <li className={css.header}>
                <span>Dealer</span>
              </li>
              {Array.from(
                { length: Math.floor(52 / scores.length) * 2 },
                (_, i) => (
                  <li
                    key={i}
                    className={i === currentRound ? css.currentRound : ""}
                  >
                    {scores[(startDealer + i) % scores.length].player}
                  </li>
                )
              )}
            </ol>
          </li>
          {modifiers.length > 0 && (
            <li className={css.infoColumn}>
              <li className={css.header} />
              <ol>
                <li className={css.header}>
                  <span>Modifiers</span>
                </li>
                {Array.from(
                  { length: Math.floor(52 / scores.length) * 2 },
                  (_, i) => (
                    <li
                      key={i}
                      className={i === currentRound ? css.currentRound : ""}
                    >
                      {modifiers
                        .filter((mod) => mod.round === i)
                        .map((mod, idx) => (
                          <span key={idx} title={mod.label}>
                            <GFIcon>{mod.icon}</GFIcon>
                          </span>
                        ))}
                    </li>
                  )
                )}
              </ol>
            </li>
          )}
          {scores.map((player, index) => (
            <li key={index}>
              <span className={css.playerName}>{player.player}</span>
              <ol>
                <li className={css.header}>
                  <span>Guess</span>
                  <span>Score</span>
                  <span>Total</span>
                </li>
                {player.scores.map((s, idx) => (
                  <li
                    key={idx}
                    className={idx === currentRound ? css.currentRound : ""}
                  >
                    <input
                      type="number"
                      name={`guess-${index}-${idx}`}
                      id={`guess-${index}-${idx}`}
                      min={0}
                      max={
                        idx < (Math.floor(52 / scores.length) * 2) / 2
                          ? (Math.floor(52 / scores.length) * 2) / 2 - idx
                          : idx - (Math.floor(52 / scores.length) * 2) / 2 + 1
                      }
                      value={s.guess}
                      className={css.roundScoreInput}
                      onChange={(e) => {
                        const newGuess = parseInt(e.target.value, 10) || 0;
                        setScores((prevScores) =>
                          calculateNewScoreOrGuess(
                            prevScores,
                            index,
                            idx,
                            { guess: newGuess }
                          )
                        );
                      }}
                    />
                    <input
                      type="number"
                      name={`score-${index}-${idx}`}
                      id={`score-${index}-${idx}`}
                      min={-1}
                      value={s.roundScore}
                      className={css.roundScoreInput}
                      onChange={(e) => {
                        const newScore = parseInt(e.target.value, 10) || 0;
                        setScores((prevScores) =>
                          calculateNewScoreOrGuess(
                            prevScores,
                            index,
                            idx,
                            { score: newScore }
                          )
                        );
                      }}
                    />
                    {/* running total */}
                    <span className={css.total}>{s.runningTotal}</span>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </Section>
      <Modal
        visibility={modifierModalOpen}
        setVisibility={() => setModifierModalOpen(false)}
        title="Manage Modifiers"
        footer={
          <>
            <InputDropdownPill
              id="modifier-add-dropdown"
              values={predefinedModifiers}
              value={""}
              onChange={(value) =>
                setModifiers((prev) => [
                  ...prev,
                  {
                    label:
                      predefinedModifiers.find((v) => v.value === value)
                        ?.label || "Custom Modifier",
                    icon:
                      predefinedModifiers.find((v) => v.value === value)
                        ?.icon || "person_edit",
                    round: 0,
                  },
                ])
              }
              inverted
              placeholder="Add Predefined Modifier"
            />
            <Button
              onClick={() =>
                setModifiers((prev) => [
                  ...prev,
                  { label: "New Modifier", icon: "person_edit", round: 0 },
                ])
              }
              style="primary"
              title="Add Modifier"
              icon={{ gficon: "add" }}
              width="fit-content"
            >
              Add Custom Modifier
            </Button>
            <Button
              onClick={() => setModifierModalOpen(false)}
              style="secondary"
              title="Close"
              icon={{ gficon: "close" }}
              width="fit-content"
            >
              Close
            </Button>
          </>
        }
        fullscreen={true}
      >
        <Section
          id="modifiers-section"
          container={{ className: css.modifierContainer }}
        >
          {modifiers.map((mod, index) => (
            <div key={index} className={css.modifierItem}>
              <Input
                id={`modifier-label-${index}`}
                value={mod.label}
                onChange={(e) =>
                  setModifiers((prev) =>
                    prev.map((m, mIdx) =>
                      mIdx === index ? { ...m, label: e.target.value } : m
                    )
                  )
                }
                label="Modifier Label"
                disabled={mod.icon !== "person_edit"}
              />
              <Input
                id={`modifier-round-${index}`}
                type="number"
                value={mod.round}
                onChange={(e) =>
                  setModifiers((prev) =>
                    prev.map((m, mIdx) =>
                      mIdx === index
                        ? { ...m, round: parseInt(e.target.value, 10) || 0 }
                        : m
                    )
                  )
                }
                label="Round Number"
              />
              <Button
                onClick={() =>
                  setModifiers((prev) =>
                    prev.filter((_, mIdx) => mIdx !== index)
                  )
                }
                style="danger"
                title="Remove Modifier"
                icon={{ gficon: "delete" }}
              >
                Remove Modifier
              </Button>
            </div>
          ))}
        </Section>
      </Modal>
    </PageSeoWrapper>
  );
}

const predefinedModifiers = [
  {
    value: "person_edit",
    label: "Custom Modifier",
    icon: "person_edit",
  },
  { value: "blind", label: "Blind", icon: "blind" },
  {
    value: "no_trumps",
    label: "No Trumps",
    icon: "playing_cards",
  },
  {
    value: "no_suit",
    label: "No suit",
    icon: "colors",
  },
];

function calculateNewScoreOrGuess(
  scores: {
    player: string;
    scores: { roundScore: number; guess: number; runningTotal: number }[];
  }[],
  playerIndex: number,
  roundIndex: number,
  newValue: {
    score?: number;
    guess?: number;
  }
) {
  const { score: newScore, guess: newGuess } = newValue

  return scores.map((p, pIdx) =>
    pIdx === playerIndex
      ? {
          ...p,
          scores: p.scores.map((s, sIdx) => ({
            ...s,
            roundScore:
              sIdx === roundIndex ? (newScore ?? s.roundScore) : s.roundScore,
            guess: sIdx === roundIndex ? (newGuess ?? s.guess) : s.guess,
            runningTotal:
              sIdx >= roundIndex
                ? p.scores
                    .slice(0, sIdx + 1)
                    .map((score, i) =>
                      i === roundIndex
                        ? (newScore ?? score.roundScore)
                        : score.roundScore
                    )
                    .reduce(
                      (sum, currentScore, i) => {
                        if (currentScore === -1) return sum;
                        return sum +
                          (currentScore ===
                          (newGuess !== undefined && i === roundIndex
                            ? newGuess
                            : p.scores[i].guess)
                            ? currentScore + 10
                            : currentScore);
                      },
                      0
                    )
                : s.runningTotal,
          })),
        }
      : p
  );
}
