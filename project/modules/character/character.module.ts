import * as EngineFarm from "@engine-farm/sdk-types";
import { CharacterController } from "./character.controller";
// import { CharacterUpdateServer } from './character-update.server';
// import { CharacterUpdateNetwork } from './character-update.network';
import { CharacterEntity } from "./character.entity";
import { CharacterEvents } from "./character.events";
import { CharacterActions } from "./character.actions";

@EngineFarm.GBModule({
  controllers: [CharacterController],
  entity: CharacterEntity,
  events: CharacterEvents,
  objectActions: CharacterActions,
  update: {
    inServer: null, //CharacterUpdateServer,
    inNetwork: null, // CharacterUpdateNetwork,
  },
  /**
   * Detect collisions for this engine objects (entity = type).
   * Callback should send events to longLogic or microAction. When
   * @param objects
   * @param cb
   */
  // onColliding: (objects: EngineObject[], cb: () => void) => {},
})
export class CharacterModule {}
