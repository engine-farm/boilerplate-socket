import * as EngineFarm from "@engine-farm/sdk-types";
import { PlatformModel } from "./platform.manager";
import { CharacterModel } from "../modules/character/character.repository";

interface FakePosition {
  x: number;
  y: number;
  z: number;
}

export interface FakeUserDB {
  userId: number;
  selectedIds: {
    characterId: number;
    platformId: number;
  };
  character: CharacterModel;
  platform: PlatformModel;
  token: string;
  clientSessions: string[];
}

const FakeDBPlayers: { [index: number]: FakeUserDB } = {
  1: {
    userId: 1,
    token: "token-1",
    character: null,
    platform: null,
    selectedIds: {
      characterId: 1,
      platformId: 1,
    },
    clientSessions: [],
  },
};

// for (let userId = 0; userId < 100; userId++) {
//     console.log('userId', userId)
//     FakeDBPlayers[userId] = {
//         userId: userId,
//         token: 'token-' + userId,
//         // character: {
//         //     id: 123 + userId,
//         //     position: {x: 10, y: 0, z: 10}
//         // },
//         // platform: {
//         //     id: 432 + userId,
//         //     position: {x: 10, y: 0, z: 10}
//         // },
//         clientSessions: []
//     }
// }

console.log("FakeDBPlayers", FakeDBPlayers[0]);
// process.exit()
const ClientToPlayerId: {
  [index: string]: number;
} = {};

export class UserModel {
  userId: number;
  selectedIds: {
    characterId: number;
    platformId: number;
  };
}

export class UserManage {
  private static redisNamespace = "e:user";

  static get(userId: number): Promise<UserModel> {
    console.log("[(" + process.env["CONTEXT"] + ") UserManage::get]", userId);
    return EngineFarm.BaseManager.get(this.redisNamespace, userId);
  }

  static set(userId: number, data: UserModel) {
    console.log("[(" + process.env["CONTEXT"] + ") UserManage::set]", userId, EngineFarm);
    return EngineFarm.BaseManager.set(this.redisNamespace, userId, data);
  }

  static update(userId: number, data: Partial<UserModel>) {
    return EngineFarm.BaseManager.update(this.redisNamespace, userId, data);
  }

  static userByToken(token) {
    return UserManage.findToken(token).then((player) => {
      return UserManage.getPlayerData(player.userId).then((user) => {
        this.set(player.userId, {
          userId: player.userId,
          selectedIds: player.selectedIds,
        });
        return user;
      });
    });
  }

  static findToken(token: string) {
    const f = Object.values(FakeDBPlayers).find((playerData) => {
      return playerData.token === token;
    });
    if (f) {
      return Promise.resolve(f);
    }
    console.warn("USER NOT FOUND", token);
    return Promise.reject();
  }

  static findPlayerBySessionId(sessionId: string) {
    return Promise.resolve(ClientToPlayerId[sessionId]);
  }

  static getPlayerData(playerId: number) {
    return Promise.resolve(FakeDBPlayers[playerId]);
    //     return playerData.token === token
    // }));
  }

  static removeClientSessionFromPlayer(player: FakeUserDB, sessionId: string) {
    const index = player.clientSessions.indexOf(sessionId);
    if (index < 0) {
      return Promise.reject("undefined session");
    }
    return player.clientSessions.splice(index, 1); // save
  }

  static addClientSessionToPlayer(player: FakeUserDB, sessionId: string) {
    player.clientSessions.push(sessionId);
    ClientToPlayerId[sessionId] = player.userId;
    return Promise.resolve(true);
  }
}
