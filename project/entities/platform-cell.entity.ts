import { DefaultObjectSettings } from "../config";
import {ActualMaxAttribute, ActualMaxEntity} from "./actual-max.entity";
import {PlatformBuildingEntity} from "./platform-building.entity";

export class PlatformCellEntity {
    positionIndex: number;

    lvl = new ActualMaxEntity(ActualMaxAttribute.HP, DefaultObjectSettings.platform.cell.maxLvl);

    hp = new ActualMaxEntity(ActualMaxAttribute.HP, DefaultObjectSettings.platform.cell.maxHP);

    building = new PlatformBuildingEntity();

}
