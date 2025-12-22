import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import HomeIndex from "./pages/home/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ItemPage from "./pages/itemPage/Index";
import { Helmet } from "react-helmet";
import ErrorPage from "./ErrorPage";
import ViewAllPage from "./pages/ViewAll";
import SettingsPage from "./pages/Settings/Index";
import LoginPage from "./pages/account/Login";
import RegisterPage from "./pages/account/Register";
import ForgotPasswordPage from "./pages/account/ForgotPassword";
import { Toaster } from "react-hot-toast";
import UserIndex from "./pages/user/Index";
import UserPage from "./pages/user/User";
import DashboardIndex from "./pages/dashboard/Index";
import ItemCreate from "./pages/itemPage/Create";
import Protect, {
  DevModeProtect,
  RoleProtect,
} from "./components/Security/Protect";
import { atomWithStorage } from "jotai/utils";
import BannerContainer from "./components/Banners/BannerContainer";
import NewTab from "./pages/newTab/Index";
import { useAuth } from "./functions/firebase/authentication/useAuth";
import firebaseUpdateUserLastSeen from "./functions/firebase/user/updateUserLastSeen";
import ItemEdit from "./pages/itemPage/Edit";
import VehiclePage from "./pages/vehiclePage/Index";
import { FindVehiclePage } from "./pages/vehiclePage/Find";
import UserEdit from "./pages/user/UserEdit";
import { NewTabLinks } from "./types";
import OverlayCreate from "./pages/overlay/Create";
import OverlayIndex from "./pages/overlay/Index";
import { OverlayViewAll } from "./pages/overlay/ViewAll";
import { UserViewAll } from "./pages/user/ViewAll";
import TicketDashboard from "./pages/ticket/Dashboard";
import TicketCreate from "./pages/ticket/Create";
import TicketView from "./pages/ticket/View";
import GameNavigation from "./pages/games/Navigation";
import Game_Nomination from "./pages/games/Nomination";
import Game_Monopoly from "./pages/games/Monopoly";
import LiveView_Nomination from "./pages/games/LiveView/LiveViewNomination";
import LoadingPage from "./components/Loading";
import { DeveloperView } from "./pages/Developer";
import VehicleEnrollPage from "./pages/vehiclePage/Enroll";
import devConsole from "./functions/devConsole";
import OrganizationNavigation from "./pages/organizations/Navigation";
import OrganizationCreate from "./pages/organizations/Create";
import OrganizationJoin from "./pages/organizations/Join";
import OrganizationDetails from "./pages/organizations/Details";
import OrganizationEdit from "./pages/organizations/Edit";
import { v4 as uuidv4 } from "uuid";
import { useAtomValue } from "jotai";
import ModularDashboardIndex from "./pages/modularDashboard/Index";
import ReAuthenticatePage from "./pages/account/ReAuthenticate";
import ActionCodePage from "./pages/account/ActionCode";
import DeleteAccountPage from "./pages/account/Delete";

export default function App() {
  const currentUser = useAuth();
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [focusTime, setFocusTime] = useState(new Date());
  const radio = useAtomValue(RadioAtom);
  const [radioID, setRadioID] = useState("unset");

  const handlePageClose = useCallback(() => {
    if (currentUser === null || currentUser === undefined) return;

    firebaseUpdateUserLastSeen(currentUser.uid);
  }, [currentUser]);

  useEffect(() => {
    window.addEventListener("onMouseOver", () => {
      setFocusTime(new Date());
    });

    window.addEventListener("onScroll", () => {
      setFocusTime(new Date());
    });

    window.addEventListener("onKeyDown", () => {
      setFocusTime(new Date());
    });

    window.addEventListener("focus", () => {
      setFocusTime(new Date());
    });

    return () => {
      handlePageClose();
    };
  }, [handlePageClose]);

  useEffect(() => {
    if (currentUser === null || currentUser === undefined) return;

    if (count % 5 !== 0) return; // Update every 5 minutes

    firebaseUpdateUserLastSeen(currentUser.uid, focusTime);
  }, [currentUser, count, focusTime]);

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), 60000);
    // triggers every minute

    return () => {
      clearTimeout(timer);
    };
  }, [count, ticking]);

  useEffect(() => {
    if (radio.tabID === "unset") {
      setTimeout(() => {
        setRadioID(tabID);
      }, 1000);
    } else {
      setRadioID(radio.tabID);
    }
  }, [radio.tabID]);

  return (
    <>
      {radio.tabID && radioID === tabID && (
        <audio
          id="audioPlayer"
          src={
            radio.state === "playing"
              ? "https://stream.simulatorradio.com/320"
              : ""
          }
          autoPlay
          hidden
          muted
        />
      )}
      <BrowserRouter>
        <ScrollToTop />
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Toaster
          position="top-right"
          reverseOrder={true}
          containerStyle={{
            top: "1rem",
            right: "1rem",
          }}
        />

        <Header />

        <Main>
          <BannerContainer />
          <Routes>
            <Route path="/" element={<HomeIndex />} />

            {/* blog */}
            <Route path="blog">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="blog"
                    title="All Blog Posts"
                    hasThumbnail={false}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemCreate itemType="blog" />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="blog" />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="blog" />
                    </RoleProtect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="blog" admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* projects */}
            <Route path="projects">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="projects"
                    title="All Projects"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemCreate itemType="projects" />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="projects" />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="projects" />
                    </RoleProtect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="projects" admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* recipes */}
            <Route path="recipes">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="recipes"
                    title="All Recipes"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemCreate itemType="recipes" />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="recipes" />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="recipes" />
                    </RoleProtect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="recipes" admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* recipes */}
            <Route path="overlay">
              <Route
                index
                element={
                  <RoleProtect
                    redirect={<Navigate to={"/account"} replace />}
                    loading={<LoadingPage />}
                  >
                    <OverlayViewAll />
                  </RoleProtect>
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <OverlayCreate />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":id">
                <Route index element={<OverlayIndex />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <OverlayCreate />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* vehicles */}
            <Route path="vehicles">
              <Route index element={<FindVehiclePage />} />
              <Route
                path="enroll"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <VehicleEnrollPage />
                  </Protect>
                }
              />
              <Route path=":vrn/:vin6">
                <Route index element={<VehiclePage itemType="vehicles" />} />
                <Route path="edit" element={<ItemEdit itemType="vehicles" />} />
              </Route>
            </Route>

            {/* album */}
            <Route path="albums">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="albums"
                    title="All Albums"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemCreate itemType="albums" />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="albums" />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="albums" />
                    </RoleProtect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="albums" admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* videos */}
            <Route path="videos">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="videos"
                    title="All Videos"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemCreate itemType="videos" />
                    </RoleProtect>
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="videos" />} />
                <Route
                  path="edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="videos" />
                    </RoleProtect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <ItemEdit itemType="videos" admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* accounts */}
            <Route path="account">
              <Route index element={<Navigate to={"/settings"} replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot" element={<ForgotPasswordPage />} />
              <Route path="reauthenticate" element={<ReAuthenticatePage />} />
              <Route path="action" element={<ActionCodePage />} />
              <Route path="delete" element={<DeleteAccountPage />} />
            </Route>

            <Route path="settings">
              <Route index element={<SettingsPage />} />
              <Route path=":page" element={<SettingsPage />} />
            </Route>

            {/* user */}
            <Route path="me">
              <Route
                index
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <UserIndex />
                  </Protect>
                }
              />
              <Route
                path="edit"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <UserEdit />
                  </Protect>
                }
              />
            </Route>

            {/* user */}
            <Route path="users">
              <Route
                index
                element={
                  <RoleProtect
                    staffOnly
                    redirect={<UserViewAll staff={false} />}
                    loading={<LoadingPage />}
                  >
                    <UserViewAll staff={true} />
                  </RoleProtect>
                }
              />

              <Route path=":uuid">
                <Route index element={<UserPage />} />
                <Route
                  path="edit"
                  element={
                    <Protect redirect={<Navigate to={"/account"} />}>
                      <UserEdit />
                    </Protect>
                  }
                />
                <Route
                  path="admin-edit"
                  element={
                    <RoleProtect
                      redirect={
                        <ErrorPage code={403} error={"Access Denied"} />
                      }
                      loading={<LoadingPage />}
                    >
                      <UserEdit admin />
                    </RoleProtect>
                  }
                />
              </Route>
            </Route>

            {/* dashboard */}
            <Route
              path="dashboard"
              element={
                <Protect redirect={<Navigate to={"/account"} replace />}>
                  <DashboardIndex />
                </Protect>
              }
            />

            {/* dashboard-new */}
            <Route
              path="dashboard-new"
              element={
                <Protect redirect={<Navigate to={"/account"} replace />}>
                  <ModularDashboardIndex />
                </Protect>
              }
            />

            {/* new tab */}
            <Route path="newtab">
              <Route
                index
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <NewTab />
                  </Protect>
                }
              />
              <Route
                path="edit"
                element={<Navigate to={"/settings/newtab"} replace />}
              />
            </Route>

            <Route path="ticket">
              <Route
                index
                element={
                  <RoleProtect
                    redirect={<TicketCreate />}
                    staffOnly
                    loading={<LoadingPage />}
                  >
                    <TicketDashboard />
                  </RoleProtect>
                }
              />
              <Route path=":ticketId" element={<TicketView />} />
            </Route>

            <Route path="developer">
              <Route
                index
                element={
                  <DevModeProtect>
                    <DeveloperView />
                  </DevModeProtect>
                }
              />
              <Route
                path=":pageID"
                element={
                  <DevModeProtect>
                    <DeveloperView />
                  </DevModeProtect>
                }
              >
                <Route
                  path=":sectionID"
                  element={
                    <DevModeProtect>
                      <DeveloperView />
                    </DevModeProtect>
                  }
                />
              </Route>
            </Route>

            {/* organizations */}
            <Route path="organizations">
              <Route
                index
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <OrganizationNavigation />
                  </Protect>
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <OrganizationCreate />
                  </Protect>
                }
              />
              <Route
                path="join"
                element={
                  <Protect redirect={<Navigate to={"/account"} replace />}>
                    <OrganizationJoin />
                  </Protect>
                }
              />
              <Route path=":organizationId">
                <Route
                  index
                  element={
                    <Protect redirect={<Navigate to={"/account"} replace />}>
                      <OrganizationDetails />
                    </Protect>
                  }
                />
                <Route
                  path="edit"
                  element={
                    <Protect redirect={<Navigate to={"/account"} replace />}>
                      <OrganizationEdit />
                    </Protect>
                  }
                />
              </Route>
            </Route>

            {/* games */}
            <Route path="games">
              <Route index element={<GameNavigation />} />
              <Route path="nomination">
                <Route index element={<Game_Nomination />} />
                <Route path=":gameID">
                  <Route index element={<Game_Nomination />} />
                  <Route path="live" element={<LiveView_Nomination />} />
                </Route>
              </Route>
              <Route path="monopoly">
                <Route
                  index
                  element={
                    <DevModeProtect>
                      <Game_Monopoly />
                    </DevModeProtect>
                  }
                />
                <Route
                  path=":gameId"
                  element={
                    <DevModeProtect>
                      <Game_Monopoly />
                    </DevModeProtect>
                  }
                />
              </Route>
              {/* <Route path=":gameId" element={<GamePage />} /> */}
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={<ErrorPage code={404} error="Page not found" />}
            />
          </Routes>
        </Main>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export const tabID = uuidv4();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    devConsole.log(pathname);
    // window.scrollTo(0,0);
    setTimeout(() => window.scrollTo(0, 0), 10);
  }, [pathname]);

  return null;
}

export const title = "xcwalker";
export const separator = "|";
export const shortURL = import.meta.env.VITE_SHORT_URL || "xcw.one";

export const RadioAtom = atomWithStorage(
  "radioSettings",
  {
    tabID: "",
    volume: 50,
    inSidebar: false,
    showDJ: true,
    state: "paused",
    nowPlaying: {
      title: "Steve’s Going to London",
      artist: "AJR",
      artwork:
        "https://i.scdn.co/image/ab67616d00001e0204a3ca0d3bf91c88f969f905",
    },
    dj: {
      name: "MadMatt",
      show: "Retro Requests",
      image:
        "https://simulatorradio.com/processor/avatar?size=256&name=1726140003584.png",
    },
  },
  undefined,
  { getOnInit: true }
);

export const NewTabLinksAtom = atomWithStorage<NewTabLinks | undefined>(
  "newTabLinks",
  undefined
);
