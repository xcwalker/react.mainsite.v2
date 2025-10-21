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

export default function Game_Nomination() {
  const { gameID } = useParams();
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
  const [JsonObject, setJsonObject] = useState<{
    JSON?: string;
    currentRound?: number;
  }>({});
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState(false);
  const [currentRound, setCurrentRound] = useState(-1);

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
            roundScore: 0,
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

    firebaseSetData("games", gameID, {
      JSON: JSON.stringify(scores),
      currentRound,
    }, {
      toast: false,
    });
  }, [scores, gameID, currentRound]);

  if (!gameStarted) {
    return (
      <AccountPage id="nomination">
        <h1>Nomination Game</h1>
        <p>Welcome to the Nomination Game! Click the button below to start.</p>

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
    );
  }

  if (error) return <ErrorPage code={404} error="Game not found" />;

  const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];

  return (
    <Section id="nomination">
      <div className={css.controls}>
        {!gameID && (
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
          </>
        )}
      </div>
      <ul className={css.scoreboard}>
        <li className={css.cardCount}>
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
        <li className={css.trumpSuit}>
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
                        prevScores.map((p, pIdx) =>
                          pIdx === index
                            ? {
                                ...p,
                                scores: p.scores.map((score, sIdx) => ({
                                  ...score,
                                  guess: sIdx === idx ? newGuess : score.guess,
                                })),
                              }
                            : p
                        )
                      );
                    }}
                  />
                  <input
                    type="number"
                    name={`score-${index}-${idx}`}
                    id={`score-${index}-${idx}`}
                    min={0}
                    value={s.roundScore}
                    className={css.roundScoreInput}
                    onChange={(e) => {
                      const newScore = parseInt(e.target.value, 10) || 0;
                      setScores((prevScores) =>
                        prevScores.map((p, pIdx) =>
                          pIdx === index
                            ? {
                                ...p,
                                scores: p.scores.map((score, sIdx) => ({
                                  ...score,
                                  roundScore:
                                    sIdx === idx ? newScore : score.roundScore,
                                  runningTotal:
                                    sIdx >= idx
                                      ? p.scores
                                          .slice(0, sIdx + 1)
                                          .map((s, i) =>
                                            i === idx ? newScore : s.roundScore
                                          )
                                          .reduce(
                                            (sum, currentScore, i) =>
                                              sum +
                                              (p.scores[i].guess !== 0 &&
                                              currentScore === p.scores[i].guess
                                                ? currentScore + 10
                                                : currentScore),
                                            0
                                          )
                                      : score.runningTotal,
                                })),
                              }
                            : p
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
  );
}
