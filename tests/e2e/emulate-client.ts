import io from "socket.io-client";
import { EventsGame } from "../../src/generated-types";

let intervalAliveSendPacket;

console.log("Connecting to server");
const socket = io("ws://localhost:5101/", {
  transports: ["websocket"],
  reconnectionDelayMax: 10000,
  auth: {
    token: "6e57884f3e1c542eb6158287285c5cd52eaed38dc9681320c73809bb436b38d1",
  },
  query: {
    "my-key": "my-value",
  },
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
  clearInterval(intervalAliveSendPacket);
});

socket.on("connect", () => {
  console.log("event connect", socket.id);

  socket.emit("message", [
    EventsGame.PacketClientTypes.Authorize,
    {
      token: "b37c2154b256f2d25630a7089c562f0333b2d515e1f315c03b310e9433e8cb78",
    },
  ]);

  intervalAliveSendPacket = setInterval(() => {
    socket.emit("message", [EventsGame.PacketClientTypes.IsALive]);
  }, 1000);
});

socket.on("message", (packet) => {
  if (packet) {
    const data = JSON.parse(packet);
    switch (data[0]) {
      case "sync":
        console.log(packet);
        break;
      case "authorization-user-not-found":
        console.log("authorization failed - token not found");
        break;
      case "authorization-failed":
        console.log("authorization failed");
        break;
      case "authorized":
        console.log("user authorized");
        socket.emit("message", [
          EventsGame.PacketClientTypes.GameEvent,
          {
            type: EventsGame.GeneratedEventsTypesGame.PlayerSelectCharacter,
            data: {
              characterId: "c4207d5f-c7b5-4b67-89ca-47d808c600b3",
            },
          },
        ]);

        setTimeout(() => {
          console.log("set direction");
          socket.emit("message", [
            EventsGame.PacketClientTypes.GameEvent,
            <
              EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterChangeDirection]
            >{
              type: EventsGame.GeneratedEventsTypesGame
                .CharacterChangeDirection,
              data: {
                x: 1,
                y: 0,
                z: 0,
              },
            },
          ]);
          console.log("set movement");
          socket.emit("message", [
            EventsGame.PacketClientTypes.GameEvent,
            <
              EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterMovement]
            >{
              type: EventsGame.GeneratedEventsTypesGame.CharacterMovement,
              data: {
                state: true,
                directions: [
                  EventsGame.GeneratedEnumCharacterMovementDirections.Forward,
                ],
              },
            },
          ]);

          setTimeout(() => {
            console.log("stop movement");
            socket.emit("message", [
              EventsGame.PacketClientTypes.GameEvent,
              <
                EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterMovement]
              >{
                type: EventsGame.GeneratedEventsTypesGame.CharacterMovement,
                data: {
                  state: false,
                  directions: [],
                },
              },
            ]);
          }, 1000);
        }, 1000);
    }
  }
});

socket.on("disconnect", () => {
  console.log("event disconnect", socket.id);
  // @ts-ignore
  process.exit(0);
});
