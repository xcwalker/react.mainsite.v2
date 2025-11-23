import IconButton from "../../components/IconButton";
import { CreateTile } from "./Create";
import { UserTile } from "./User";
import { WeatherTile } from "./Weather";

export const TileMap = {
  weather: {
    node: <WeatherTile />,
    title: "Weather Tile",
    toolbarControls: <div>Weather Controls</div>,
    icon: "cloud",
  },
  create: {
    node: <CreateTile />,
    title: "Create Tile",
    icon: "create",
    toolbarControls: <></>,
  },
  user: {
    node: <UserTile />,
    title: "User Tile",
    toolbarControls: <IconButton icon={{gficon: "edit"}} href="/me/edit" title="Edit Account" />,
    icon: "person",
  },
};
