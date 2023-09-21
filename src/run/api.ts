import * as EngineFarm from '@engine-farm/sdk-types';
import { UserApi } from '../modules/user/user.api';
import { GameModule } from '../modules/game.module';
import { PlayerTableConfig } from '../modules/players/player.table-config';
import { CharacterTableConfig } from '../modules/character/character.table-config';
import { CharacterApi } from '../modules/character/character.api';

GameModule.initDatabase({
  tables: [PlayerTableConfig, CharacterTableConfig],
});
const apiHandler = new EngineFarm.HttpApiLayer.ApiHandler([
  new UserApi(),
  new CharacterApi(),
]);

export default apiHandler;
