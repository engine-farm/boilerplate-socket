import * as EngineFarm from "@engine-farm/sdk-types";
import { PlayerEventType } from "../../player-events.game";
import { PlayerController } from "./player.controller";
import { PlayerEntity } from "./player.entity";

console.log('dupa');
console.log('dupa');
console.log('dupa');
console.log('dupa');
console.log('dupa');
@EngineFarm.GBModule({
  controllers: [PlayerController],
  entity: PlayerEntity,
  events: [
    {
      name: "PlayerSelectCharacter",
      type: PlayerEventType.PlayerSelectCharacter,
      data: {
        characterId: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      },
    },
  ],
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
