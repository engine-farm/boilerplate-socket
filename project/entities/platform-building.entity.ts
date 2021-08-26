import { DefaultObjectSettings } from '../config';
import { ActualMaxAttribute, ActualMaxEntity } from './actual-max.entity';
import { BuffEntity } from './buff.entity';

export enum PlatformBuildingType {
    Turret,
    Shield,
    PowerGenerator,
}

export class PlatformBuildingEntity {
    type: PlatformBuildingType;

    lvl = new ActualMaxEntity(
        ActualMaxAttribute.HP,
        DefaultObjectSettings.platform.building.maxLvl
    );

    hp = new ActualMaxEntity(
        ActualMaxAttribute.HP,
        DefaultObjectSettings.platform.building.maxHP
    );

    buffs: BuffEntity[] = [];
}
