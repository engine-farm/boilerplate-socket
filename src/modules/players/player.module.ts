import * as EngineFarm from "@engine-farm/sdk-types";
import { PlayerController } from "./player.controller";
import { PlayerEntity } from "./player.entity";
import { PlayerSelectCharacterEvent } from "./events/player-select-character.event";

@EngineFarm.GBModule({
  controllers: [PlayerController],
  entity: PlayerEntity,
  events: [new PlayerSelectCharacterEvent()],
  update: {
    inNetwork: null,
    inServer: null,
  },
})
export class PlayerModule {
}
