import { PositionEntity } from '../../entities/position.entity';
import { RotationEntity } from '../../entities/rotation.entity';
import { DirectionEntity } from '../../entities/direction.entity';
import { MovingEntity } from '../../entities/moving.entity';
import {
  ActualMaxAttribute,
  ActualMaxEntity,
} from '../../entities/actual-max.entity';
import { BuffEntity } from '../../entities/buff.entity';

export class CharacterStats {
  hp = new ActualMaxEntity(ActualMaxAttribute.HP, 500);
  power: number = 0;
  shield = new ActualMaxEntity(ActualMaxAttribute.Shield, 500);
}

export class CharacterEntity {
  metadata?: { [index: string]: any };
  entityName = 'character';
  elementId: string;
  characterId: string;
  name: string;
  position = new PositionEntity();
  rotation = new RotationEntity();
  direction = new DirectionEntity();
  move = new MovingEntity();
  stats = new CharacterStats();
  buffs: BuffEntity[] = [];
  pressedKeys: number[] = [];
  moveToPoint: { x: number; y: number; z: number };
  moveByDirection: boolean = false;

  constructor(partial?: Partial<CharacterEntity>) {
    if (partial) {
      for (let key in partial) {
        this[key] = partial[key];
      }
    }
  }
}
