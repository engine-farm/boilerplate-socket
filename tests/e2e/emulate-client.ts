import io from "socket.io-client";
import { EventsGame } from "../../project/generated-types";

console.log('Connecting to server')
const socket = io("ws://localhost:5101", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});

socket.on("connect", () => {
  console.log("event connect", socket.id);

  socket.emit("message", [
    EventsGame.PacketClientTypes.Authorize,
    {
      token: "token-1",
    },
  ]);

  setInterval(() => {
    socket.emit("message", [
        EventsGame.PacketClientTypes.IsALive,
    ]);
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
    }
  }
});

socket.on("disconnect", () => {
  console.log("event disconnect", socket.id);
});
