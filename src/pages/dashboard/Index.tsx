import {
  Mosaic,
  MosaicWindow,
  getLeaves,
  MosaicBranch,
} from "react-mosaic-component";

import "react-mosaic-component/react-mosaic-component.css";
import css from "../../styles/pages/dashboard/index.module.css";

export default function DashboardIndex() {
  return (
    <section className={css.dashboard}>
      <Mosaic
        renderTile={(count, path) => (
          <ExampleWindow count={count} path={path} totalWindowCount={2} />
        )}
        initialValue={{
          direction: "row",
          first: "a",
          second: {
            direction: "column",
            first: "b",
            second: "c",
          },
          splitPercentage: 40,
        }}
      />
    </section>
  );
}

const ExampleWindow = (props: {
  count: string;
  path: MosaicBranch[];
  totalWindowCount: number;
}) => {
  return (
    <MosaicWindow<number>
      title={`Window ${props.count}`}
      createNode={() => props.totalWindowCount + 1}
      path={props.path}
      onDragStart={() => console.log("MosaicWindow.onDragStart")}
      onDragEnd={(type) => console.log("MosaicWindow.onDragEnd", type)}
      renderToolbar={ null
      }
    >
      <div className="example-window">
        <h1>{`Window ${props.count}`}</h1>
      </div>
    </MosaicWindow>
  );
};
