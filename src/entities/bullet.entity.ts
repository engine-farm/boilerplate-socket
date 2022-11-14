import {DirectionEntity} from "./direction.entity";
import {PositionEntity} from "./position.entity";

export class BulletMetaDataSchema {
    // @type()

}

export class BulletEntity {

    position: PositionEntity = new PositionEntity();

    direction: DirectionEntity = new DirectionEntity();

    dmg: number;

    speed: number;

    metadata: BulletMetaDataSchema = new BulletMetaDataSchema();
}
