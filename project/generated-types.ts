export namespace EventsGame {
    export enum PacketClientTypes {
        Connect = 'connect',
        Authorize = 'auth',
        IsALive = 'is-alive',
        Data = 'data',
        GameEvent = 'player',
    }
    export type PacketClient =
        | [PacketClientTypes.GameEvent, GeneratedEvents]
        | [PacketClientTypes.Authorize, { token: string }]
        | [PacketClientTypes];
    export enum PacketServerTypes {
        Connected = 'connected',
        Authorized = 'authorized',
        AuthorizedUserNotFound = 'authorization-user-not-found',
        AuthorizationFailed = 'authorization-failed',
        Alive = 'alive',
        DataUpdate = 'd-u',
        Disconnect = 'disconnect',
    }
    export type PacketServer = [PacketServerTypes, any?];

    export enum GeneratedEventsTypesGame {
        CharacterMovement = 1,
        CharacterRotation = 3,
        CharacterChangeDirection = 2,
        CharacterShooting = 5,
        PlayerSelectCharacter = 0,
    }

    export interface GeneratedEventsBody {
        [GeneratedEventsTypesGame.CharacterMovement]: {
            data: {
                state: boolean;
                directions: GeneratedEnumCharacterMovementDirections[];
            };
        };
        [GeneratedEventsTypesGame.CharacterRotation]: {
            data: { x: number; y: number; z: number };
        };
        [GeneratedEventsTypesGame.CharacterChangeDirection]: {
            data: { x: number; y: number; z: number };
        };
        [GeneratedEventsTypesGame.CharacterShooting]: {
            data: { weaponIndex: number };
        };
        [GeneratedEventsTypesGame.PlayerSelectCharacter]: {
            data: { characterId: number };
        };
    }

    export enum GeneratedActions {
        CharacterShooting = 1,
        CharacterChangeDirection = 2,
        CharacterMovement = 3,
    }

    export type GeneratedEvents =
        | {
              type: GeneratedEventsTypesGame.CharacterMovement;
              data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterMovement]['data'];
          }
        | {
              type: GeneratedEventsTypesGame.CharacterRotation;
              data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterRotation]['data'];
          }
        | {
              type: GeneratedEventsTypesGame.CharacterChangeDirection;
              data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterChangeDirection]['data'];
          }
        | {
              type: GeneratedEventsTypesGame.CharacterShooting;
              data: GeneratedEventsBody[GeneratedEventsTypesGame.CharacterShooting]['data'];
          }
        | {
              type: GeneratedEventsTypesGame.PlayerSelectCharacter;
              data: GeneratedEventsBody[GeneratedEventsTypesGame.PlayerSelectCharacter]['data'];
          };

    export enum GeneratedEnumCharacterMovementDirections {
        Forward,
        Backward,
        Left,
        Right,
        Up,
        Down,
    }
}
