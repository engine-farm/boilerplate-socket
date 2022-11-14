import io from "socket.io-client";
import { EventsGame } from "../../src/generated-types";

console.log("Connecting to server");
const socket = io("ws://localhost:5101", {
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
});

socket.on("connect", () => {
  console.log("event connect", socket.id);

  socket.emit("message", [
    EventsGame.PacketClientTypes.Authorize,
    {
      token: "6e57884f3e1c542eb6158287285c5cd52eaed38dc9681320c73809bb436b38d1",
    },
  ]);

  setInterval(() => {
    socket.emit("message", [EventsGame.PacketClientTypes.IsALive]);
  }, 1000);
});

socket.on("message", (data) => {
  console.log("event message", typeof data, data);
  if (data) {
    data = JSON.parse(data);
    switch (data[0]) {
      case "authorized":
        console.log("user authorized");
        socket.emit("message", [
          EventsGame.PacketClientTypes.GameEvent,
          {
            type: EventsGame.GeneratedEventsTypesGame.PlayerSelectCharacter,
            data: {
              characterId: 1,
            },
          },
        ]);

        setTimeout(() => {
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
});
