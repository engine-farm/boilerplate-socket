import { TableInitInterface } from "@engine-farm/sdk-types";
import { PlayerModel } from "./player.model";

export const PlayerTableConfig: TableInitInterface<PlayerModel> = {
  tableName: "players",
  primaryKey: "playerId",
  index: [
    {
      indexName: "userIdIndex",
      properties: (row) => row("userId"),
    },
  ],
};
