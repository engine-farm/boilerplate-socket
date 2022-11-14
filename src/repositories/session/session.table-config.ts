import { TableInitInterface } from "@engine-farm/sdk-types";
import { SessionModel } from "./session.model";

export const SessionTableConfig: TableInitInterface<SessionModel> = {
  tableName: "sessions",
  index: [{ indexName: "tokenIndex", properties: "token" }],
};