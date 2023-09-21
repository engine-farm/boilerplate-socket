import { GameModule } from '../modules/game.module';
import { GameDatabase } from '@engine-farm/sdk-types';

GameDatabase.initConnection().then(() => {
  GameModule.bootstrapWorld();
});
