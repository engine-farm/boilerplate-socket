export enum PlayerEventType {
  // player
  PlayerSelectCharacter,

  // character
  CharacterMovement,
  CharacterChangeDirection,
  CharacterRotation,
  CharacterSettTarget,
  CharacterShooting,

  // platform

  // bullet
  SpawnObjectBullet,
}

export enum ObjectMovementDirections {
  Forward,
  Backward,
  Left,
  Right,
  Up,
  Down,
}

// export const PlayerEventsGame: EndpointLayer.PlayerEventSchema[] = [
//     {
//         type: PlayerEventType.CharacterChangeDirection,
//         data: {
//             x: EndpointLayer.PlayerEventDataKeyTypes.Number,
//             y: EndpointLayer.PlayerEventDataKeyTypes.Number,
//             z: EndpointLayer.PlayerEventDataKeyTypes.Number,
//         }
//     }
// ]

// { type: PlayerEventType.CharacterRotation, data: { x: number, y: number, z: number } } |
// { type: PlayerEventType.CharacterChangeDirection, data: { x: number, y: number, z: number } } |
// { type: PlayerEventType.CharacterMovement, data: { state: boolean, direction: ObjectMovementDirections[] } };
