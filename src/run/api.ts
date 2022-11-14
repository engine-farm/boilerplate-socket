import * as EngineFarm from "@engine-farm/sdk-types";
import { UserApi } from "../repositories/user/user.api";
import { GameModule } from "../modules/game.module";
import { SessionTableConfig } from "../repositories/session/session.table-config";
import { PlayerTableConfig } from "../modules/players/player.table-config";

GameModule.initDatabase({
  tables: [SessionTableConfig, PlayerTableConfig],
});

const apiHandler = new EngineFarm.HttpApiLayer.ApiHandler([new UserApi()]);

export default apiHandler;

