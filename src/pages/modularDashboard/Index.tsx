import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import "react-mosaic-component/react-mosaic-component.css";
import {
  buildSpecFromUpdate,
  createExpandUpdate,
  createRemoveUpdate,
  Mosaic,
  MosaicNode,
  MosaicWindow,
} from "react-mosaic-component";
import css from "../../styles/pages/modularDashboard/index.module.css";
import { useState } from "react";
import { TileMap } from "./TileMap";
import IconButton from "../../components/IconButton";
import update from "immutability-helper";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import SidebarButtonContainer from "../../components/Sidebar/SidebarButtonContainer";
import Button from "../../components/Button";

export type ViewId = keyof typeof TileMap;

export default function ModularDashboardIndex() {
  const [dashboardState, setDashboardState] =
    useState<MosaicNode<ViewId> | null>({
      direction: "row",
      first: "weather",
      second: {
        direction: "column",
        first: "create",
        second: "user",
      },
    });

  return (
    <Section id="dashboard">
      <SideBySide leftWidth="250px" className={css.sideBySide}>
        <Sidebar
          dashboardState={dashboardState}
          setDashboardState={setDashboardState}
         />
        <Mosaic<ViewId>
          renderTile={(id, path) => (
            <MosaicWindow<ViewId>
              path={path}
              createNode={() => id}
              title={TileMap[id].title}
              toolbarControls={
                <div className={css.toolbarControls}>
                  {TileMap[id]?.toolbarControls }
                  <IconButton
                    icon={{ gficon: "fullscreen" }}
                    title="Enlarge Window"
                    style="primary"
                    onClick={() => {
                      // Fullscreen logic here (70% size)
                      // setDashboardState(createExpandUpdate(path, 70).spec);
                      const newState = update(
                        dashboardState as MosaicNode<ViewId>,
                        createExpandUpdate(path, 70).spec
                      );

                      setDashboardState(newState as MosaicNode<ViewId>);
                      console.log(newState);
                    }}
                    width="fit-content"
                  />
                  <IconButton
                    icon={{ gficon: "close" }}
                    title="Close Window"
                    style="danger"
                    onClick={() => {
                      createRemoveUpdate(dashboardState, path);
                      const newState = update(
                        dashboardState as MosaicNode<ViewId>,
                        buildSpecFromUpdate(createRemoveUpdate(dashboardState, path))
                      );

                      setDashboardState(newState as MosaicNode<ViewId>);
                    }}
                    width="fit-content"
                  />
                </div>
              }
            >
              {TileMap[id].node}
            </MosaicWindow>
          )}
          value={dashboardState}
          onChange={setDashboardState}
        />
      </SideBySide>
    </Section>
  );
}

function Sidebar(props: {
  dashboardState: MosaicNode<ViewId> | null;
  setDashboardState: React.Dispatch<
    React.SetStateAction<MosaicNode<ViewId> | null>
  >;
}) {
  return <SidebarContainer>
    <SidebarTitle title="Dashboard" />
    <SidebarButtonContainer>
      {/* create buttons to add / remove windows from TitleMap */}
      {
        Object.keys(TileMap).map((key) => {
          const viewId = key as ViewId;
          return <Button
            key={viewId}
            icon={{ gficon: TileMap[viewId].icon }}
            title={`Add ${TileMap[viewId].title} Tile`}
            style="primary"
            onClick={() => {
              // Logic to add tile to dashboardState
              if (!props.dashboardState) {
                props.setDashboardState(viewId);
              } else {
                // check if viewId already exists in dashboardState
                // if it does, remove it
                // if it doesn't, add it
                if (JSON.stringify(props.dashboardState).includes(`"${viewId}"`)) {
                  // remove it
                  const removeUpdate = (function removeViewIdFromMosaic(
                    node: MosaicNode<ViewId> | ViewId
                  ): unknown {
                    if (typeof node === "string") {
                      if (node === viewId) {
                        return null;
                      } else {
                        return node;
                      }
                    } else {
                      const first = removeViewIdFromMosaic(node.first);
                      const second = removeViewIdFromMosaic(node.second);
                      if (first === null) return second;
                      if (second === null) return first;
                      return {
                        direction: node.direction,
                        first: first,
                        second: second,
                      };
                    }
                  })(props.dashboardState);

                  props.setDashboardState(
                    removeUpdate as MosaicNode<ViewId>
                  );
                  return;
                }

                // add it
                const newState = update(
                  props.dashboardState,
                  {
                    $set: {
                      direction: "row",
                      first: props.dashboardState,
                      second: viewId,
                    },
                  }
                );
                props.setDashboardState(newState as MosaicNode<ViewId>);
              }
            }}
          >
            Add {TileMap[viewId].title} Tile
            </Button>
        })
      }
    </SidebarButtonContainer>
  </SidebarContainer>;
}
