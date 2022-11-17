import * as EngineFarm from "@engine-farm/sdk-types";
import { EndpointLayer } from "@engine-farm/sdk-types";
import { CharacterController } from "./character.controller";
// import { CharacterUpdateServer } from './character-update.server';
// import { CharacterUpdateNetwork } from './character-update.network';
import { CharacterEntity } from "./character.entity";
import { CharacterChangeDirectionAction } from "./actions/character-change-direction.action";
import { CharacterShootingAction } from "./actions/character-shooting.action";
import { CharacterMovementAction } from "./actions/character-movement.action";
import { CharacterMovementEvent } from "./events/character-movement.event";
import { CharacterChangeDirectionEvent } from "./events/character-change-direction.event";
import { CharacterShootingEvent } from "./events/character-shooting.event";

@EngineFarm.GBModule({
  controllers: [CharacterController],
  entity: CharacterEntity,
  events: [
    new CharacterChangeDirectionEvent(),
    new CharacterMovementEvent(),
    new CharacterShootingEvent(),
  ],
  objectActions: [
    new CharacterChangeDirectionAction(),
    new CharacterShootingAction(),
    new CharacterMovementAction(),
  ],
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
