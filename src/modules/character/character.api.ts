import { HttpApiLayer } from '@engine-farm/sdk-types';
import { CharacterModel, CharacterRepository } from './character.repository';

export class CharacterApi implements HttpApiLayer.ModuleRoutes<CharacterModel> {
  routes: HttpApiLayer.ModuleRoute[] = [
    {
      path: '/game/character/create',
      method: 'post',
      callback: (request) => this.createCharacter(request),
      requirements: {
        authorizedUser: true,
      },
    },
  ];

  async createCharacter(
    req: HttpApiLayer.ModuleRouteRequest
  ): Promise<HttpApiLayer.ModuleRouteResponse<CharacterModel>> {
    const data = {
      name: req.body?.name,
    };
    if (!data.name) {
      return {
        error: { message: 'character name required' },
        httpStatus: 400,
      };
    }
    return CharacterRepository.create({
      userId: req.user.userId,
      name: data.name,
    }).then((res) => {
      return {
        data: {
          characterId: res.characterId,
          name: res.name,
        },
      };
    });
  }
}
