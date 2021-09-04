export class PlayerEntity {
  metadata?: {
    active: {
      characterId: number;
    };
  };
  entityName = "player";
  elementId: number;

  constructor(partial?: Partial<PlayerEntity>) {
    console.log("[PlayerEntity::constructor] ");
    if (partial) {
      for (let key in partial) {
        this[key] = partial[key];
      }
    }
  }

  userId: number;

  equipment: {
    weapons: [];
  };

  characterId: number | null;
}
