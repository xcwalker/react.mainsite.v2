import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import ErrorPage from "../../ErrorPage";
import LoadingPage from "../../components/Loading";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import AccountPage from "../../components/Security/AccountPage";
import SidebarUser from "../../components/Sidebar/SidebarUser";
import { QRModal } from "../../components/QRModal";
import Button from "../../components/Button";
import css from "../../styles/pages/games/monopoly.module.css";
import firebaseSetData from "../../functions/firebase/storage/setData";
import Section from "../../components/Section";
import toast from "react-hot-toast";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";

export default function Game_Monopoly() {
  const { gameId } = useParams();
  const [game, setGame] = useState<
    | {
        data: MonopolyGame;
        metaData: {
          authorID: string;
        };
      }
    | undefined
  >(undefined);
  const [error, setError] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const currentUser = useAuth();
  const [tradeModal, setTradeModal] = useState<{
    visible: boolean;
    propertyId: number | null;
  }>({ visible: false, propertyId: null });

  useEffect(() => {
    if (!currentUser) return;

    if (gameId) {
      // fetch game data
      firebaseGetRealtimeData(
        "games",
        gameId,
        setGame as React.Dispatch<React.SetStateAction<unknown>>,
        setError
      );
    } else {
      // initialize new game
      firebaseCreateData("games", {
        data: {
          title: "New Monopoly Game",
          players: [
            {
              id: currentUser.uid,
              money: 1500,
              properties: [],
            },
          ],
          trades: [],
          properties: properties,
          currentPlayer: null,
          status: "waiting", // waiting, in-progress, finished
        },
        metaData: {
          authorID: currentUser?.uid, //
        },
      }).then((newGameId) => {
        // Redirect to the new game page
        navigate(`./${newGameId?.id}`);
      });
    }
    // initialize
  }, [gameId, navigate, currentUser]);

  if (!currentUser) {
    return (
      <ErrorPage code={401} error="You must be logged in to play Monopoly" />
    );
  }

  if (error) {
    return <ErrorPage code={404} error="Game not found" />;
  }

  if (!game) {
    return <LoadingPage />;
  }

  if (game.data?.status === "finished") {
    return <ErrorPage code={410} error="This game has finished" />;
  }

  if (
    currentUser &&
    game.data?.status === "in-progress" &&
    game.data.players.find((player) => player.id === currentUser.uid) ===
      undefined
  ) {
    return <ErrorPage code={409} error="This game is in progress" />;
  }

  if (game.data && game.data?.status === "in-progress") {
    return (
      <PageSeoWrapper
        title={`Monopoly Game ${separator} ${title}`}
        description={`Monopoly Game ${separator} ${title}`}
      >
        <Section id="game_monopoly_in_progress">
          <h1>Monopoly - In Progress</h1>
          <div className={css.players}>
            {game.data?.players.map((player) => (
              <div key={player.id}>
                <SidebarUser userId={player.id} />
                <p>Money: ${player.money}</p>
                <p>
                  Properties:{" "}
                  {player.properties.length > 0
                    ? player.properties
                        .map(
                          (propId) =>
                            game.data?.properties.find(
                              (property) => property.id === propId
                            )?.name
                        )
                        .join(", ")
                    : "None"}
                </p>
                <div className={css.playerActions}>
                  {game.metaData.authorID === currentUser.uid && (
                    <Button
                      style="secondary"
                      onClick={() =>
                        firebaseSetData("games", gameId!, {
                          ...game,
                          data: {
                            ...game.data!,
                            // add 200 to current player
                            players: game.data!.players.map((p) =>
                              p.id === player.id
                                ? { ...p, money: p.money + 200 }
                                : p
                            ),
                          },
                        })
                      }
                      title="Pass Go"
                      icon={{ gficon: "360" }}
                    >
                      Pass Go
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ul className={css.properties}>
            {game.data?.properties.map((property) => (
              <Fragment key={property.id}>
                <PropertyCard
                  property={property}
                  game={game}
                  gameId={gameId}
                  setTradeModal={setTradeModal}
                />
              </Fragment>
            ))}
          </ul>
        </Section>
        <TradeModal
          tradeModal={tradeModal}
          game={game}
          gameId={gameId}
          close={() => setTradeModal({ visible: false, propertyId: null })}
        />
      </PageSeoWrapper>
    );
  }

  return (
    <PageSeoWrapper
      title={`Monopoly Game ${separator} ${title}`}
      description={`Monopoly Game ${separator} ${title}`}
    >
      <AccountPage id="game_monopoly">
        <h1>Monopoly</h1>
        <div className={css.players}>
          {game.data?.players.map((player) => (
            <Fragment key={player.id}>
              <SidebarUser userId={player.id} />
            </Fragment>
          ))}
        </div>
        {!game.data?.players.find((player) => player.id === currentUser.uid) ? (
          <Button
            style="primary"
            onClick={() =>
              firebaseSetData("games", gameId!, {
                ...game,
                data: {
                  ...game.data!,
                  players: [
                    ...game.data!.players,
                    {
                      id: currentUser.uid,
                      money: 1500,
                      properties: [],
                    },
                  ],
                },
              })
            }
            title="Join Game"
            icon={{ gficon: "group" }}
          >
            Join Game
          </Button>
        ) : (
          <></>
        )}
        <Button
          style="primary"
          onClick={() => setShowQR(true)}
          title="Show QR Code"
          icon={{ gficon: "qr_code" }}
        >
          Show QR Code
        </Button>
        <Button
          style="secondary"
          onClick={() =>
            firebaseSetData("games", gameId!, {
              ...game,
              data: {
                ...game.data!,
                status: "in-progress",
              },
            })
          }
          title="Begin Game"
          icon={{ gficon: "play_arrow" }}
        >
          Begin Game
        </Button>
      </AccountPage>
      <QRModal
        link={import.meta.env.VITE_SHORT_URL + "/" + gameId}
        visible={showQR}
        close={() => setShowQR(false)}
      />
    </PageSeoWrapper>
  );
}

function TradeModal(props: {
  tradeModal: {
    visible: boolean;
    propertyId: number | null;
  };
  game: {
    data: MonopolyGame;
    metaData: {
      authorID: string;
    };
  };
  gameId: string | undefined;
  close: () => void;
}) {
  const { game, gameId, close, tradeModal } = props;
  const currentUser = useAuth();
  const [moneyRequested, setMoneyRequested] = useState(0);
  const [propertyOfferedTo, setPropertyOfferedTo] = useState<string | null>(
    null
  );
  const trade =
    game.data.trades.filter(
      (trade) => trade.status === "pending" && trade.to === currentUser?.uid
    )[0] || null;

  useEffect(() => {
    devConsole.log(tradeModal);
    devConsole.log(trade);
    devConsole.log(game.data.trades);
    devConsole.log(currentUser?.uid);
  }, [tradeModal, trade, game.data.trades, currentUser]);

  if (!currentUser) return null;

  if (tradeModal.visible && tradeModal.propertyId && !trade) {
    // New trade proposal
    return (
      <>
        <div className={css.tradeModalBackdrop} onClick={close} />
        <div className={css.tradeModal}>
          <div>
            <p>Propose a trade to another player.</p>

            <PropertyCard
              property={
                game.data.properties.find(
                  (p) => p.id === tradeModal.propertyId
                )!
              }
              game={game}
              gameId={gameId}
              setTradeModal={() => {}}
              hideControls
            />
          </div>
          <div className={css.tradeForm}>
            <select
              id="toPlayer"
              value={propertyOfferedTo || ""}
              onChange={(e) => setPropertyOfferedTo(e.target.value)}
            >
              <option value="" disabled>
                Select Player
              </option>
              {game.data.players
                .filter((p) => p.id !== currentUser.uid)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id}
                  </option>
                ))}
            </select>
            <label>
              Money Requested:
              <input
                type="number"
                id="money"
                defaultValue={0}
                min={0}
                value={moneyRequested}
                onChange={(e) => setMoneyRequested(parseInt(e.target.value))}
              />
            </label>
            <div className={css.tradeActions}>
              <Button
                style="primary"
                onClick={() => {
                  if (!propertyOfferedTo) {
                    toast.error("Please select a player to trade with");
                    return;
                  }
                  if (moneyRequested < 0) {
                    toast.error("Please enter a valid amount of money");
                    return;
                  }
                  if (
                    moneyRequested >
                    (game.data.players.find((p) => p.id === propertyOfferedTo)
                      ?.money ?? 0)
                  ) {
                    toast.error(
                      "You cannot request more money than the player has"
                    );
                    return;
                  }
                  if (tradeModal.propertyId === null) {
                    toast.error("Please select a property to trade");
                    return;
                  }
                  // Propose trade
                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      trades: [
                        ...game.data!.trades,
                        {
                          from: currentUser.uid,
                          to: propertyOfferedTo!,
                          propertyId: tradeModal.propertyId!,
                          money: moneyRequested,
                          status: "pending",
                        },
                      ],
                    },
                  });
                  close();
                }}
                title="Propose Trade"
                icon={{ gficon: "send" }}
              >
                Propose Trade
              </Button>
              <Button
                style="remove"
                onClick={close}
                title="Cancel"
                icon={{ gficon: "close" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!trade) return null;

  const fromPlayer = game.data.players.find((p) => p.id === trade.from);
  const toPlayer = game.data.players.find((p) => p.id === trade.to);
  const property = game.data.properties.find((p) => p.id === trade.propertyId);

  if (!fromPlayer || !toPlayer || !property) return null;

  return (
    <>
      <div
        className={css.tradeModalBackdrop}
        onClick={
          // decline trade on backdrop click
          () => {
            firebaseSetData("games", gameId!, {
              ...game,
              data: {
                ...game.data!,
                trades: game.data!.trades.map((t) =>
                  t === trade ? { ...t, status: "declined" } : t
                ),
              },
            });
          }
        }
      />
      <div className={css.tradeModal}>
        <PropertyCard
          property={property}
          game={game}
          gameId={gameId}
          setTradeModal={() => {}}
          hideControls
          showFullRent
        />
        {toPlayer.id === currentUser.uid && trade.status === "pending" && (
          <div className={css.tradeActions}>
            <SidebarUser userId={fromPlayer.id} />
            <div className={css.price}>
              <span>${trade.money}</span>
            </div>

            <Button
              style="primary"
              onClick={() => {
                // Accept trade
                firebaseSetData("games", gameId!, {
                  ...game,
                  data: {
                    ...game.data!,
                    players: game.data!.players.map((p) => {
                      if (p.id === fromPlayer.id) {
                        return {
                          ...p,
                          money: p.money + trade.money,
                          properties: p.properties.filter(
                            (propId) => propId !== property.id
                          ),
                        };
                      } else if (p.id === toPlayer.id) {
                        return {
                          ...p,
                          money: p.money - trade.money,
                          properties: [...p.properties, property.id],
                        };
                      } else {
                        return p;
                      }
                    }),
                    trades: game.data!.trades.map((t) =>
                      t === trade ? { ...t, status: "accepted" } : t
                    ),
                  },
                });
                close();
              }}
              title="Accept Trade"
              icon={{ gficon: "check" }}
            >
              Accept
            </Button>
            <Button
              style="secondary"
              onClick={() => {
                // Decline trade
                firebaseSetData("games", gameId!, {
                  ...game,
                  data: {
                    ...game.data!,
                    trades: game.data!.trades.map((t) =>
                      t === trade ? { ...t, status: "declined" } : t
                    ),
                  },
                });
                close();
              }}
              title="Decline Trade"
              icon={{ gficon: "close" }}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function PropertyCard(props: {
  property: MonopolyProperty;
  game: {
    data: MonopolyGame;
    metaData: {
      authorID: string;
    };
  };
  gameId: string | undefined;
  setTradeModal: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      propertyId: number | null;
    }>
  >;
  hideControls?: boolean | undefined;
  showFullRent?: boolean | undefined;
}) {
  const { property, game, gameId, setTradeModal, hideControls, showFullRent } =
    props;
  const currentUser = useAuth();

  if (!currentUser) return null;

  return (
    <div className={css.propertyCard}>
      <span
        className={css.name}
        style={{ "--_background": property.set } as React.CSSProperties}
      >
        {property.name}
      </span>
      <div className={css.propertyDetails}>
        {(!game.data.players.some((p) => p.properties.includes(property.id)) ||
          showFullRent) && (
          <>
            <div className={css.prices}>
              {property.rent.map((rent, index) => (
                <div key={index} className={css.rentRow}>
                  <span key={index}>
                    {index === 0
                      ? "No Houses"
                      : index === 5
                        ? "Hotel"
                        : `${index} House${index > 1 ? "s" : ""}`}{" "}
                    :
                  </span>
                  <span>${rent}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {!game.data.players.some((p) => p.properties.includes(property.id)) && (
          <p>Price: ${property.price}</p>
        )}
        {game.data.players.some((p) => p.properties.includes(property.id)) && (
          <>
            <p>Rent: ${property.rent[property.numHouses]}</p>
            <p>Houses: {property.numHouses}</p>
          </>
        )}
      </div>
      {!hideControls && (
        <div className={css.propertyActions}>
          {!game.data.players.some((p) =>
            p.properties.includes(property.id)
          ) && (
            <Button
              style="primary"
              onClick={() => {
                // Buy property
                firebaseSetData("games", gameId!, {
                  ...game,
                  data: {
                    ...game.data!,
                    players: game.data!.players.map((p) =>
                      p.id === currentUser.uid
                        ? {
                            ...p,
                            money: p.money - property.price,
                            properties: [...p.properties, property.id],
                          }
                        : p
                    ),
                  },
                });
              }}
              disabled={
                (game.data.players.find((p) => p.id === currentUser.uid)
                  ?.money ?? 0) < property.price
              }
              title="Buy Property"
              icon={{ gficon: "shopping_cart" }}
            >
              Buy Property
            </Button>
          )}
          {/* Pay Rent */}
          {game.data.players.some((p) => p.properties.includes(property.id)) &&
            !game.data.players
              .find((p) => p.id === currentUser.uid)
              ?.properties.includes(property.id) && (
              <Button
                style="primary"
                onClick={() => {
                  // Pay rent
                  const owner = game.data.players.find((p) =>
                    p.properties.includes(property.id)
                  );
                  if (!owner) return;

                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      players: game.data!.players.map((p) => {
                        if (p.id === currentUser.uid) {
                          return {
                            ...p,
                            money: p.money - property.rent[property.numHouses],
                          };
                        } else if (p.id === owner.id) {
                          return {
                            ...p,
                            money: p.money + property.rent[property.numHouses],
                          };
                        } else {
                          return p;
                        }
                      }),
                    },
                  });
                }}
                disabled={
                  (game.data.players.find((p) => p.id === currentUser.uid)
                    ?.money ?? 0) < property.rent[property.numHouses]
                }
                title="Pay Rent"
                icon={{ gficon: "payment" }}
              >
                Pay Rent
              </Button>
            )}
          {/* Buy House | 5 = Hotel */}
          {game.data.players
            .find((p) => p.id === currentUser.uid)
            ?.properties.includes(property.id) &&
            property.numHouses < 5 && (
              <Button
                style="secondary"
                onClick={() => {
                  // Buy house
                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      players: game.data!.players.map((p) =>
                        p.id === currentUser.uid
                          ? {
                              ...p,
                              money: p.money - property.housePrice,
                            }
                          : p
                      ),
                      properties: game.data!.properties.map((prop) =>
                        prop.id === property.id
                          ? { ...prop, numHouses: prop.numHouses + 1 }
                          : prop
                      ),
                    },
                  });
                }}
                disabled={
                  (game.data.players.find((p) => p.id === currentUser.uid)
                    ?.money ?? 0) < property.housePrice ||
                  !game.data.properties
                    .filter((p) => p.set === property.set)
                    .every((p) =>
                      game.data.players
                        .find((player) => player.id === currentUser.uid)
                        ?.properties.includes(p.id)
                    ) ||
                  Math.max(
                    ...game.data.properties
                      .filter((p) => p.set === property.set)
                      .map((p) => p.numHouses)
                  ) -
                    Math.min(
                      ...game.data.properties
                        .filter((p) => p.set === property.set)
                        .map((p) =>
                          p.id === property.id ? p.numHouses + 1 : p.numHouses
                        )
                    ) >
                    0
                }
                title="Buy House"
                icon={{ gficon: "home" }}
              >
                Buy House
              </Button>
            )}
          {/* Sell House */}
          {game.data.players
            .find((p) => p.id === currentUser.uid)
            ?.properties.includes(property.id) &&
            property.numHouses > 0 && (
              <Button
                style="secondary"
                onClick={() => {
                  // Sell house
                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      players: game.data!.players.map((p) =>
                        p.id === currentUser.uid
                          ? {
                              ...p,
                              money: p.money + property.housePrice / 2,
                            }
                          : p
                      ),
                      properties: game.data!.properties.map((prop) =>
                        prop.id === property.id
                          ? { ...prop, numHouses: prop.numHouses - 1 }
                          : prop
                      ),
                    },
                  });
                }}
                title="Sell House"
                icon={{ gficon: "store" }}
                disabled={
                  Math.min(
                    ...game.data.properties
                      .filter((p) => p.set === property.set)
                      .map((p) =>
                        p.id === property.id ? p.numHouses - 1 : p.numHouses
                      )
                  ) -
                    Math.max(
                      ...game.data.properties
                        .filter((p) => p.set === property.set)
                        .map((p) =>
                          p.id === property.id ? p.numHouses - 1 : p.numHouses
                        )
                    ) <
                  -1
                }
              >
                Sell House
              </Button>
            )}
          {/* Trade Property (No Houses on Property Set) */}
          {game.data.players
            .find((p) => p.id === currentUser.uid)
            ?.properties.includes(property.id) &&
            game.data.properties
              .filter((p) => p.set === property.set)
              .every((p) => p.numHouses === 0) && (
              <Button
                style="secondary"
                onClick={() => {
                  if (setTradeModal) {
                    setTradeModal({ visible: true, propertyId: property.id });
                  }
                }}
                title="Trade Property"
                icon={{ gficon: "swap_horiz" }}
              >
                Trade Property
              </Button>
            )}
          {/* Mortgage Property */}
          {game.data.players
            .find((p) => p.id === currentUser.uid)
            ?.properties.includes(property.id) &&
            !property.mortgaged &&
            property.numHouses === 0 && (
              <Button
                style="secondary"
                onClick={() => {
                  // Mortgage property
                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      players: game.data!.players.map((p) =>
                        p.id === currentUser.uid
                          ? {
                              ...p,
                              money: p.money + property.mortgageValue,
                            }
                          : p
                      ),
                      properties: game.data!.properties.map((prop) =>
                        prop.id === property.id
                          ? { ...prop, mortgaged: true }
                          : prop
                      ),
                    },
                  });
                }}
                title="Mortgage Property"
                icon={{ gficon: "money_off" }}
              >
                Mortgage Property
              </Button>
            )}
          {/* Unmortgage Property */}
          {game.data.players
            .find((p) => p.id === currentUser.uid)
            ?.properties.includes(property.id) &&
            property.mortgaged && (
              <Button
                style="secondary"
                onClick={() => {
                  // Unmortgage property
                  firebaseSetData("games", gameId!, {
                    ...game,
                    data: {
                      ...game.data!,
                      players: game.data!.players.map((p) =>
                        p.id === currentUser.uid
                          ? {
                              ...p,
                              money: p.money - property.mortgageValue * 1.1, // 10% interest
                            }
                          : p
                      ),
                      properties: game.data!.properties.map((prop) =>
                        prop.id === property.id
                          ? { ...prop, mortgaged: false }
                          : prop
                      ),
                    },
                  });
                }}
                disabled={
                  (game.data.players.find((p) => p.id === currentUser.uid)
                    ?.money ?? 0) <
                  property.mortgageValue * 1.1
                }
                title="Unmortgage Property"
                icon={{ gficon: "money" }}
              >
                Unmortgage Property
              </Button>
            )}
        </div>
      )}
    </div>
  );
}

type MonopolyGame = {
  title: string;
  players: MonopolyPlayer[];
  properties: MonopolyProperty[];
  trades: MonopolyTrade[];
  currentPlayer: string | null;
  status: "waiting" | "in-progress" | "finished";
};

type MonopolyTrade = {
  from: string;
  to: string;
  propertyId: number;
  money: number;
  status: "pending" | "accepted" | "declined";
};

type MonopolyProperty = {
  id: number;
  name: string;
  price: number;
  housePrice: number;
  rent: number[];
  numHouses: number;
  set: string;
  mortgageValue: number;
  mortgaged: boolean;
};

type MonopolyPlayer = {
  id: string;
  money: number;
  properties: number[];
};

const properties = [
  {
    id: 1,
    name: "Mediterranean Avenue",
    price: 60,
    housePrice: 50,
    mortgageValue: 30,
    mortgaged: false,
    rent: [2, 10, 30, 90, 160, 250],
    numHouses: 0,
    set: "Brown",
  },
  {
    id: 2,
    name: "Baltic Avenue",
    price: 60,
    housePrice: 50,
    mortgageValue: 30,
    mortgaged: false,
    rent: [4, 20, 60, 180, 320, 450],
    numHouses: 0,
    set: "Brown",
  },
  {
    id: 3,
    name: "Oriental Avenue",
    price: 100,
    housePrice: 50,
    mortgageValue: 50,
    mortgaged: false,
    rent: [6, 30, 90, 270, 400, 550],
    numHouses: 0,
    set: "lightblue",
  },
  {
    id: 4,
    name: "Vermont Avenue",
    price: 100,
    housePrice: 50,
    mortgageValue: 50,
    mortgaged: false,
    rent: [6, 30, 90, 270, 400, 550],
    numHouses: 0,
    set: "lightblue",
  },
  {
    id: 5,
    name: "Connecticut Avenue",
    price: 120,
    housePrice: 50,
    mortgageValue: 60,
    mortgaged: false,
    rent: [8, 40, 100, 300, 450, 600],
    numHouses: 0,
    set: "lightblue",
  },
  {
    id: 6,
    name: "St. Charles Place",
    price: 140,
    housePrice: 100,
    mortgageValue: 70,
    mortgaged: false,
    rent: [10, 50, 150, 450, 625, 750],
    numHouses: 0,
    set: "Pink",
  },
  {
    id: 7,
    name: "States Avenue",
    price: 140,
    housePrice: 100,
    mortgageValue: 70,
    mortgaged: false,
    rent: [10, 50, 150, 450, 625, 750],
    numHouses: 0,
    set: "Pink",
  },
  {
    id: 8,
    name: "Virginia Avenue",
    price: 160,
    housePrice: 100,
    mortgageValue: 80,
    mortgaged: false,
    rent: [12, 60, 180, 500, 700, 900],
    numHouses: 0,
    set: "Pink",
  },
  {
    id: 9,
    name: "St. James Place",
    price: 180,
    housePrice: 100,
    mortgageValue: 90,
    mortgaged: false,
    rent: [14, 70, 200, 550, 750, 950],
    numHouses: 0,
    set: "Orange",
  },
  {
    id: 10,
    name: "Tennessee Avenue",
    price: 180,
    housePrice: 100,
    mortgageValue: 90,
    mortgaged: false,
    rent: [14, 70, 200, 550, 750, 950],
    numHouses: 0,
    set: "Orange",
  },
  {
    id: 11,
    name: "New York Avenue",
    price: 200,
    housePrice: 100,
    mortgageValue: 100,
    mortgaged: false,
    rent: [16, 80, 220, 600, 800, 1000],
    numHouses: 0,
    set: "Orange",
  },
  {
    id: 12,
    name: "Kentucky Avenue",
    price: 220,
    housePrice: 100,
    mortgageValue: 110,
    mortgaged: false,
    rent: [18, 90, 250, 700, 875, 1050],
    numHouses: 0,
    set: "Red",
  },
  {
    id: 13,
    name: "Indiana Avenue",
    price: 220,
    housePrice: 100,
    mortgageValue: 110,
    mortgaged: false,
    rent: [18, 90, 250, 700, 875, 1050],
    numHouses: 0,
    set: "Red",
  },
  {
    id: 14,
    name: "Illinois Avenue",
    price: 240,
    housePrice: 100,
    mortgageValue: 120,
    mortgaged: false,
    rent: [20, 100, 300, 750, 925, 1100],
    numHouses: 0,
    set: "Red",
  },
  {
    id: 15,
    name: "Atlantic Avenue",
    price: 260,
    housePrice: 100,
    mortgageValue: 130,
    mortgaged: false,
    rent: [22, 110, 330, 800, 975, 1150],
    numHouses: 0,
    set: "Yellow",
  },
  {
    id: 16,
    name: "Ventnor Avenue",
    price: 260,
    housePrice: 100,
    mortgageValue: 130,
    mortgaged: false,
    rent: [22, 110, 330, 800, 975, 1150],
    numHouses: 0,
    set: "Yellow",
  },
  {
    id: 17,
    name: "Marvin Gardens",
    price: 280,
    housePrice: 100,
    mortgageValue: 140,
    mortgaged: false,
    rent: [24, 120, 360, 850, 1025, 1200],
    numHouses: 0,
    set: "Yellow",
  },
  {
    id: 18,
    name: "Pacific Avenue",
    price: 300,
    housePrice: 100,
    mortgageValue: 150,
    mortgaged: false,
    rent: [26, 130, 390, 900, 1100, 1275],
    numHouses: 0,
    set: "Green",
  },
  {
    id: 19,
    name: "North Carolina Avenue",
    price: 300,
    housePrice: 100,
    mortgageValue: 150,
    mortgaged: false,
    rent: [26, 130, 390, 900, 1100, 1275],
    numHouses: 0,
    set: "Green",
  },
  {
    id: 20,
    name: "Pennsylvania Avenue",
    price: 320,
    housePrice: 100,
    mortgageValue: 160,
    mortgaged: false,
    rent: [28, 150, 450, 1000, 1200, 1400],
    numHouses: 0,
    set: "Green",
  },
  {
    id: 21,
    name: "Park Place",
    price: 350,
    housePrice: 100,
    mortgageValue: 175,
    mortgaged: false,
    rent: [35, 175, 500, 1100, 1300, 1500],
    numHouses: 0,
    set: "Blue",
  },
  {
    id: 22,
    name: "Boardwalk",
    price: 400,
    housePrice: 100,
    mortgageValue: 200,
    mortgaged: false,
    rent: [50, 200, 600, 1400, 1700, 2000],
    numHouses: 0,
    set: "Blue",
  },
];
