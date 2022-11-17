import { AbstractRepository } from "@engine-farm/sdk-types";
import { PlayerModel } from "./player.model";
import { PlayerTableConfig } from "./player.table-config";

export class PlayerRepository {
  private static tableName = PlayerTableConfig.tableName;

  static getByUserId(userId: string): Promise<PlayerModel> {
    return AbstractRepository.findOne<PlayerModel>(this.tableName, {
      userId,
    });
  }

  static set(userId: string, data: Partial<PlayerModel>) {
    console.log(
      "[(" + process.env["CONTEXT"] + ") UserManage::set]",
      userId,
      data
    );
    return AbstractRepository.insert<PlayerModel>(this.tableName, {
      selectedIds: data.selectedIds,
      userId,
    });
  }

  static update(userId: string, data: Partial<PlayerModel>) {
    return AbstractRepository.update<PlayerModel>(
      this.tableName,
      {
        userId,
      },
      data
    );
    // return EngineFarm.RedisManager.update(this.redisNamespace, userId, data);
  }
}
