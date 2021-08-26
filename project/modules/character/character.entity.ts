import * as EngineFarm from '@engine-farm/sdk-types';
import {PositionEntity} from "../../entities/position.entity";
import {RotationEntity} from "../../entities/rotation.entity";
import {DirectionEntity} from "../../entities/direction.entity";
import {MovingEntity} from "../../entities/moving.entity";
import {ActualMaxAttribute, ActualMaxEntity} from "../../entities/actual-max.entity";
import {BuffEntity} from "../../entities/buff.entity";


export class CharacterStats {
    hp = new ActualMaxEntity(ActualMaxAttribute.HP, 500);
    power: number = 0;
    shield = new ActualMaxEntity(ActualMaxAttribute.Shield, 500);
}

export class CharacterEntity extends EngineFarm.Entity {
    metadata?: { [index: string]: any; };
    entityName = 'character';
    elementId: number;

    constructor(partial?: Partial<CharacterEntity>) {
        super();
        if (partial) {
            for (let key in partial) {
                this[key] = partial[key];
            }
        }
    }

    userId: number;
    characterId: number;
    name: string;
    position = new PositionEntity();
    rotation = new RotationEntity();
    direction = new DirectionEntity();
    move = new MovingEntity();
    stats = new CharacterStats();
    buffs: BuffEntity[] = [];
    pressedKeys: number[] = [];
    moveToPoint: { x: number, y: number, z: number };
    moveByDirection: boolean = false;

}

