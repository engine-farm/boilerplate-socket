import * as EngineFarm from "@engine-farm/sdk-types";
import { GameState } from "../game-state";
import { PlayerEntity } from "./player.entity";
import { CharacterController } from "../character/character.controller";
import { EventsGame } from "../../generated-types";

export class PlayerController
  implements EngineFarm.Controller<PlayerEntity, GameState>
{
  private _objectType: EngineFarm.EngineLayer.EngineObjectType;
  objectType(): EngineFarm.EngineLayer.EngineObjectType {
    if (this._objectType) {
      return this._objectType;
    }
    return (this._objectType =
      EngineFarm.EngineLayer.ObjectTypeManager.getByEntity(PlayerEntity));
  }

  constructor() {
    console.log("[PlayerController::constructor]");
  }

  onSectorEventFromWorld(
    event: EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld,
    gameState: GameState,
    gameEngine: EngineFarm.EngineLayer.EngineStateManager
  ) {}

  onClientEvent(
    gameEvent: EventsGame.GeneratedEvents,
    gameState: GameState,
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface
  ) {
    switch (gameEvent.type) {
      case EventsGame.GeneratedEventsTypesGame.PlayerSelectCharacter:
        console.log(
          "[PlayerController::onClientEvent] PlayerSelectCharacter",
          gameEvent.data
        );
        break;
    }
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
    console.log("[PlayerController::onInit]");
  }

  async onJoinWorld(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState,
    parentEventSource?: { controller: string }
  ): Promise<null | EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld> {
    console.log("[PlayerController::onJoinWorld] parent?", {
      parentEventSource,
      connectionInfo,
    });
    if (gameState.players.has(connectionInfo.userId)) {
      // already exists
      console.log("=============== player join, send to children");
      return {
        type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent.Reference,
        data: [
          [CharacterController, "onJoinWorld", [connectionInfo, gameState]],
        ],
      };
    } else {
      try {
        const user = await EngineFarm.UserManage.get(connectionInfo.userId);
        if (user?.metadata?.characterId) {
          console.log(
            "=============== player join, create new + send to children"
          );
          console.log("user", user);
          const player = new PlayerEntity({
            elementId: connectionInfo.userId,
            characterId: user?.metadata?.characterId,
          });
          gameState.players.set(connectionInfo.userId, player);
          console.log("gameState.players", gameState.players);
          return {
            type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent
              .Reference,
            data: [
              [CharacterController, "onJoinWorld", [connectionInfo, gameState]],
            ],
          };
        } else {
          return null;
        }
      } catch (e) {
        console.error(e);
        return {
          type: EngineFarm.NetworkLayer.Events.SectorEvents.SectorEvent
            .Reference,
          data: [
            [CharacterController, "onJoinWorld", [connectionInfo, gameState]],
          ],
        };
      }
    }
  }

  async onDisconnectWorld(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState
  ): Promise<null | EngineFarm.NetworkLayer.Events.SectorEvents.FromWorld> {
    const user = await EngineFarm.UserManage.get(connectionInfo.userId);
    if (gameState.characters.has(user.metadata.characterId)) {
      gameState.characters.delete(user.metadata.characterId);
      // return {
      //     type: NetworkLayer.Events.SectorEvents.SectorEvent.ObjectRemove,
      //     engineObject: {
      //         type: this.objectType,
      //         elementId: user.selectedIds.characterId,
      //     },
      // };
    } else {
      // not found, search referenced?
      return null;
    }
  }

  async onJoinSector(
    connectionInfo: EngineFarm.EndpointLayer.NetworkConnectionInterface,
    gameState: GameState,
    sectorId
  ): Promise<EngineFarm.EngineObject<PlayerEntity> | null> {
    // const user = await UserManage.get(connectionInfo.userId);
    // if (gameState.characters.has(user.selectedIds.characterId)) {
    return null;
    // } else {
    //     const obj = new EngineObject<CharacterEntity>(
    //         this.objectType,
    //         user.selectedIds.characterId
    //     );
    //     obj.metadata = {
    //         userId: user.userId,
    //     };
    //     return obj;
    // }
  }
}
