import * as EngineFarm from '@engine-farm/sdk-types';

export class PlayerEntity extends EngineFarm.Entity {
    metadata?:  {
        active: {
            characterId: number
        }
    };
    entityName = 'player';
    elementId: number;

    constructor(partial?: Partial<PlayerEntity>) {
        super();
        if (partial) {
            for (let key in partial) {
                this[key] = partial[key];
            }
        }
    }

    userId: number;

    equipment: {
        weapons: [];
    }

    characterId: number | null;
}
