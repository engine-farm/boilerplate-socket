export namespace EventsGame {
  export enum PacketClientTypes {
    Connect = "connect",
    Authorize = "auth",
    IsALive = "is-alive",
    Data = "data",
    GameEvent = "player",
  }
  export type PacketClient =
    | [PacketClientTypes.GameEvent, GeneratedEvents]
    | [PacketClientTypes.Authorize, { token: string }]
    | [PacketClientTypes];
  export enum PacketServerTypes {
    Connected = "connected",
    Authorized = "authorized",
    AuthorizedUserNotFound = "authorization-user-not-found",
    AuthorizationFailed = "authorization-failed",
    Alive = "alive",
    DataUpdate = "d-u",
    Disconnect = "disconnect",
  }
  export type PacketServer = [PacketServerTypes, any?];

  export enum GeneratedEventsTypesGame {
    PlayerSelectCharacter = 0,
    CharacterChangeDirection = 2,
    CharacterMovement = 1,
    CharacterShooting = 5,
  }

  export interface GeneratedEventsBody {
    [GeneratedEventsTypesGame.PlayerSelectCharacter]: {
      data: { characterId: string };
    };
    [GeneratedEventsTypesGame.CharacterChangeDirection]: {
      data: { x: number; y: number; z: number };
    };
    [GeneratedEventsTypesGame.CharacterMovement]: {
      data: {
        state: boolean;
        directions: GeneratedEnumCharacterMovementDirections[];
      };
    };
    [GeneratedEventsTypesGame.CharacterShooting]: {
      data: { mouse: GeneratedEnumCharacterShootingMouseEvent };
    };
  }

  export enum GeneratedActions {
    CharacterChangeDirection = 1,
    CharacterShooting = 2,
    CharacterMovement = 3,
  }

  export type GeneratedEvents =
    | {
        type: GeneratedEventsTypesGame.PlayerSelectCharacter;
        data: GeneratedEventsBody[GeneratedEventsTypesGame.PlayerSelectCharacter]["data"];
      }
    | {
        type: GeneratedEventsTypesGame.CharacterChangeDirection;
        data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterChangeDirection]["data"];
      }
    | {
        type: GeneratedEventsTypesGame.CharacterMovement;
        data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterMovement]["data"];
      }
    | {
        type: GeneratedEventsTypesGame.CharacterShooting;
        data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterShooting]["data"];
      };

  export enum GeneratedEnumCharacterMovementDirections {
    Forward,
    Backward,
    Left,
    Right,
    Up,
    Down,
  }

  export enum GeneratedEnumCharacterShootingMouseEvent {
    LBMDown,
    LBMUp,
    RBMDown,
    RBMUp,
  }
}
