import * as EngineFarm from "@engine-farm/sdk-types";
import { PlayerEventType } from "../../player-events.game";
import { PlayerController } from "./player.controller";
import { PlayerEntity } from "./player.entity";
import { PlayerEvents } from "./player.events";

@EngineFarm.GBModule({
  controllers: [PlayerController],
  entity: PlayerEntity,
  events: PlayerEvents,
  update: {
    inNetwork: null,
    inServer: null,
  },
  // engineMicroActions: [
  //   // {
  //   //     name: ''
  //   // }
  // ],
})
export class PlayerModule {}
