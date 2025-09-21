import { Fragment, useEffect, useState } from "react";
import Section from "../../components/Section";
import css from "../../styles/pages/games/Nomination.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AccountPage from "../../components/Security/AccountPage";

export default function Game_Nomination() {
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
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Initialize scores for each player when the game starts
    if (gameStarted) {
      const numberOfRounds = Math.floor(52 / scores.length) * 2; // Set the number of rounds

      setScores((prevScores) =>
        prevScores.map((player) => ({
          ...player,
          scores: Array.from({ length: numberOfRounds }, () => ({
            roundScore: 0,
            runningTotal: 0,
            guess: 0,
          })),
        }))
      );
    }
  }, [gameStarted, scores.length]);

  if (!gameStarted) {
    return (
      <AccountPage
       id="nomination">
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

  const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];

  return (
    <Section id="nomination">
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
                  <li key={i}>
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
                <li key={i} title={suits[i % suits.length]}>
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
                <li key={idx}>
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
