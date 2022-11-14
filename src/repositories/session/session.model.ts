import { PlayerModel } from "../../modules/players/player.model";

export class SessionModel {
  id?: string;
  token: string;
  userId: string;
  selectedIds?: PlayerModel["selectedIds"];
}
