import * as EngineFarm from "@engine-farm/sdk-types";
import { EventsGame } from "../../generated-types";
import { GameState } from "modules/game-state";
import { PlayerEventType } from "../../player-events.game";
import { CharacterEntity } from "./character.entity";


export const CharacterEvents: EngineFarm.EndpointLayer.DefinePlayerEvent[] = [
  new EngineFarm.EndpointLayer.CreatePlayerEvent<GameState>(
    "CharacterMovement",
    PlayerEventType.CharacterMovement,
    {
      Directions: ["Forward", "Backward", "Left", "Right", "Up", "Down", "Test"],
    },
    {
      state: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Boolean,
      directions: [
        EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Enum,
        "Directions",
        EngineFarm.EndpointLayer.PlayerEventDataFormat.MultiValues,
      ],
    },
    (connection, sectorState, data, runAction) => {
      const player = sectorState.players.get(connection.userId);
      if (player.characterId) {
        runAction({
          addActions: [
            {
              payload: data,
              timing: {
                type: EngineFarm.NetworkLayer.Events.SectorEvents
                  .ObjectActionTimingType.MaxDelay,
                ms: 2000,
              },
              action: {
                operation: data.state
                  ? EngineFarm.EngineLayer.EngineActionOperation.Add
                  : EngineFarm.EngineLayer.EngineActionOperation.Remove,
                type: EventsGame.GeneratedActions.CharacterMovement,
              },
              engineObject: {
                type: EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(
                  CharacterEntity
                ),
                elementId: player.characterId,
              },
            },
          ],
        });
      }
    }
  ),
  new EngineFarm.EndpointLayer.CreatePlayerEvent<GameState>(
    "CharacterChangeDirection",
    PlayerEventType.CharacterChangeDirection,
    {},
    {
      x: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      y: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      z: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
    },
    (connection, sectorState, data, runAction) => {
      const player = sectorState.players.get(connection.userId);
      if (player.characterId) {
        runAction({
          addActions: [
            {
              payload: data,
              timing: {
                type: EngineFarm.NetworkLayer.Events.SectorEvents
                  .ObjectActionTimingType.OneTime,
              },
              action: {
                operation: EngineFarm.EngineLayer.EngineActionOperation.Add,
                type: EventsGame.GeneratedActions.CharacterChangeDirection,
              },
              engineObject: {
                type: EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(
                  CharacterEntity
                ),
                elementId: player.characterId,
              },
            },
          ],
        });
      }
    }
  ),
  {
    name: "CharacterRotation",
    type: PlayerEventType.CharacterRotation,
    data: {
      x: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      y: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      z: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
    },
  },
  {
    name: "CharacterShooting",
    type: PlayerEventType.CharacterShooting,
    data: {
      weaponIndex: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
    },
  },
];

