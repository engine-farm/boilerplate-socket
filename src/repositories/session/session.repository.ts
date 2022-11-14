import { SessionTableConfig } from "./session.table-config";
import { AbstractRepository, GameDatabase, RepositoryManager } from '@engine-farm/sdk-types';
import { SessionModel } from "./session.model";

export class SessionRepository {
  private static tableName = SessionTableConfig.tableName;

  static createSession(userId: string, token: string) {
    return AbstractRepository.insert<SessionModel>(this.tableName,{
      token,
      userId
    })
  }

  static getByToken(token: string) {
    return AbstractRepository.findOne<SessionModel>(this.tableName, {
      token
    })
  }
}
