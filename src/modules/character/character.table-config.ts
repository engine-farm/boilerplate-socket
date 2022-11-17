import { TableInitInterface } from "@engine-farm/sdk-types";
import { CharacterModel } from './character.repository';

export const CharacterTableConfig: TableInitInterface<CharacterModel> = {
  tableName: "characters",
  primaryKey: "characterId",
  index: [
    {
      indexName: "name",
      properties: (row) => row("name"),
    },
  ],
};
