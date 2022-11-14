export class PlayerEntity {
  metadata?: {
    active: {
      characterId: string;
    };
  };
  entityName = "player";
  elementId: string;

  constructor(partial?: Partial<PlayerEntity>) {
    console.log("[PlayerEntity::constructor] ");
    if (partial) {
      for (let key in partial) {
        this[key] = partial[key];
      }
    }
  }

  userId: string;

  equipment: {
    weapons: [];
  };

  characterId: string | null;
}
