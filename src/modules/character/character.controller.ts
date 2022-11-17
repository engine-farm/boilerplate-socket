import * as EngineFarm from "@engine-farm/sdk-types";
import { GameDatabase, RepositoryManager, UserManage } from '@engine-farm/sdk-types';
import { CharacterEntity } from "./character.entity";
import { GameState } from "../game-state";
import { PlayerController } from "../players/player.controller";
import { EventsGame } from "../../generated-types";
import { PlayerRepository } from "../players/player.repository";

export class CharacterController
  implements EngineFarm.Controller<CharacterEntity, GameState>
{
  private _objectType: EngineFarm.EngineLayer.EngineObjectType;

  objectType(): EngineFarm.EngineLayer.EngineObjectType {
    if (this._objectType) {
      return this._objectType;
    }
    return (this._objectType =
      EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(CharacterEntity));
  }

  constructor() {
    console.log("[CharacterController::constructor] a");
  }

  onSectorEventFromWorld(
    event: EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld,
    gameState: GameState,
    gameEngine: EngineFarm.EngineLayer.EngineStateManager
  ) {
    console.log("sector event handler", this.objectType, event);
    switch (event.type) {
      case EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent.ObjectCreate:
        this.createCharacterEntity(
          gameState,
          event.engineObject.elementId as string
        );
        const nObj = new EngineFarm.EngineObject(
          event.engineObject.type,
          event.engineObject.elementId
        );
        nObj.inject(event.engineObject);
        gameEngine.add(nObj, event.engineObject.elementId);
        break;
    }
  }

  onClientEvent(
    gameEvent: EventsGame.GeneratedEvents,
    gameState: GameState,
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    runAction?: EngineFarm.EngineLayer.EngineActionCallback
  ) {
    console.log("[CharacterController::onClientEvent]", gameEvent);
    // const player = gameState.players.get(connectionInfo.userId);
    // switch (gameEvent.type) {
    //   case EventsGame.GeneratedEventsTypesGame.CharacterChangeDirection:
    //     console.log(
    //       "gameEvent",
    //       { userId: connectionInfo.userId },
    //       gameEvent.data
    //     );
    //     console.log({ player }, gameState.players);
    //     if (player.characterId) {
    //       runAction({
    //         addActions: [
    //           {
    //             payload: gameEvent.data,
    //             timing: {
    //               type: EngineFarm.NetworkLayer.Events.SectorEvents
    //                 .ObjectActionTimingType.OneTime,
    //             },
    //             action: {
    //               operation: EngineFarm.EngineLayer.EngineActionOperation.Add,
    //               type: EventsGame.GeneratedActions.CharacterChangeDirection,
    //             },
    //             engineObject: {
    //               type: EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(
    //                 CharacterEntity
    //               ),
    //               elementId: player.characterId,
    //             },
    //           },
    //         ],
    //       });
    //     }
    //     break;
    //   case EventsGame.GeneratedEventsTypesGame.CharacterMovement:
    //     console.log(
    //       "gameEvent",
    //       { userId: connectionInfo.userId },
    //       gameEvent.data
    //     );
    //     console.log({ player }, gameState.players);
    //     if (player.characterId) {
    //       runAction({
    //         addActions: [
    //           {
    //             payload: gameEvent.data,
    //             timing: {
    //               type: EngineFarm.NetworkLayer.Events.SectorEvents
    //                 .ObjectActionTimingType.MaxDelay,
    //               ms: 2000,
    //             },
    //             action: {
    //               operation: gameEvent.data.state
    //                 ? EngineFarm.EngineLayer.EngineActionOperation.Add
    //                 : EngineFarm.EngineLayer.EngineActionOperation.Remove,
    //               type: EventsGame.GeneratedActions.CharacterMovement,
    //             },
    //             engineObject: {
    //               type: EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(
    //                 CharacterEntity
    //               ),
    //               elementId: player.characterId,
    //             },
    //           },
    //         ],
    //       });
    //     }
    //     break;
    // }
  }

  onDisconnectSector() {
    throw new Error("Method not implemented.");
  }

  onMoveBetweenSectors() {
    throw new Error("Method not implemented.");
  }

  // onGameData(connectionInfo: EndpointLayer.NetworkConnectionInterface, gameState: GameState) {
  //     throw new Error('Method not implemented.');
  // }

  onInit() {
    // super.onInit();
    console.log("[CharacterController::onInit]");
  }

  async onJoinWorld(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState,
    parentEventSource?: { controller: string }
  ): Promise<null | EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld> {
    if (
      !parentEventSource ||
      (parentEventSource &&
        parentEventSource.controller !==
          EngineFarm.EngineModules.getControllerName(PlayerController))
    ) {
      console.log("*** ignore player controller from root");
      return null;
    }
    console.log("[CharacterController::onJoinWorld] parent?", arguments);
    console.log("[CharacterController::onJoinWorld] parent?", {
      connectionInfo,
      gameState,
    });
    const user = await UserManage.get(connectionInfo.userId);
    if (!user) {
      console.error("user not found");
      return null;
    }
    console.log("[CharacterController::onJoinWorld] user data", user);
    return null;
    // if (gameState.characters.has(user.selectedIds.characterId)) {
    //   // already exists
    //   console.log("already exists");
    //   return {
    //     type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent
    //       .ObjectCreate,
    //     engineObject: {
    //       type: this.objectType(),
    //       elementId: user.selectedIds.characterId,
    //     },
    //   };
    // } else {
    //   this.createCharacterEntity(gameState, user.selectedIds.characterId);
    //   console.log(this);
    //   return {
    //     type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent
    //       .ObjectCreate,
    //     engineObject: {
    //       type: this.objectType(),
    //       elementId: user.selectedIds.characterId,
    //     },
    //   };
    // }
  }

  private createCharacterEntity(gameState: GameState, characterId: string) {
    const character = new CharacterEntity({
      elementId: characterId,
      characterId: characterId,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      moveByDirection: false,
    });
    gameState.characters.set(characterId, character);
  }

  async onJoinSector(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState,
    sectorId
  ): Promise<EngineFarm.EngineObject<CharacterEntity> | null> {
    console.log("[CharacterController::onJoinSector]");
    const user = await UserManage.get(connectionInfo.userId);
    const player = await PlayerRepository.getByUserId(user.userId);
    console.log({user,player})
    return null;
    if (gameState.characters.has(player.selectedIds.characterId)) {
      return null;
    } else {
      const obj = new EngineFarm.EngineObject<CharacterEntity>(
        this.objectType(),
        player.selectedIds.characterId
      );
      // obj.metadata = {
      //   userId: user.userId,
      // };
      return obj;
    }
  }

  async onDisconnectWorld(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState
  ): Promise<null | EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld> {
    const user = await UserManage.get(connectionInfo.userId);
    const player = await PlayerRepository.getByUserId(user.userId);
    if (gameState.characters.has(player.selectedIds.characterId)) {
      gameState.characters.delete(player.selectedIds.characterId);
      return {
        type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent
          .ObjectRemove,
        engineObject: {
          type: this.objectType(),
          elementId: player.selectedIds.characterId,
        },
      };
    } else {
      // not found, search referenced?
      return null;
    }
  }
}
