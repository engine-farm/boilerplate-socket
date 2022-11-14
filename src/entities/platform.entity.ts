import {PlatformCellEntity} from "./platform-cell.entity";

export class PlatformPositionEntity {
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

export class PlatformSpawningSettingsSchema {

    allowFriends: number[] = [];

    friendsCanSpawn: boolean;


}

export class PlatformEntity {

    position = new PlatformPositionEntity();

    // @type(ActualMaxSchema)
    // hp = new ActualMaxSchema(ActualMaxAttribute.HP, 5000)

    buffs = []

    cells = new Map<number, PlatformCellEntity>();

    spawningSettings = new PlatformSpawningSettingsSchema();


}
