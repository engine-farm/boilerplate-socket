import * as EngineFarm from '@engine-farm/sdk-types'
import { CharacterEntity } from './character/character.entity';
import { PlayerEntity } from './players/player.entity';

export type GameState = EngineFarm.ServerState & {
    players: Map<number, PlayerEntity>;
    characters: Map<number, CharacterEntity>;
};
