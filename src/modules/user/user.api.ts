import * as EngineFarm from "@engine-farm/sdk-types";
import {
  GameDatabase,
  RepositoryManager,
  UserManage,
  UserModel,
} from "@engine-farm/sdk-types";

export class UserApi
  implements EngineFarm.HttpApiLayer.ModuleRoutes<UserModel>
{
  routes: EngineFarm.HttpApiLayer.ModuleRoute[] = [
    {
      path: "/auth/register",
      method: "post",
      callback: (request) => this.register(request),
    },
    {
      path: "/auth/login",
      method: "post",
      callback: (request) => this.login(request),
    },
    {
      path: "/user/me",
      method: "get",
      callback: (request) => this.getUserData(request),
      requirements: {
        authorizedUser: true,
      },
    },
    {
      path: "/user/list",
      method: "get",
      callback: async (request) => {
        return {
          data: await RepositoryManager.getTable("users")
            .getAll()
            .run(GameDatabase.getConnection()),
        };
      },
    },
    {
      path: "/user/:userId",
      method: "get",
      callback: async (request) => {
        return {
          httpStatus: 200,
          data: request.params,
        };
      },
    },
  ];

  async getUserData(
    req: EngineFarm.HttpApiLayer.ModuleRouteRequest
  ): Promise<EngineFarm.HttpApiLayer.ModuleRouteResponse<UserModel>> {
    if (!req.authorizationToken) {
      return {
        httpStatus: 403,
        error: { message: "User token not found" },
      };
    }
    const user = await UserManage.userByToken(req.authorizationToken);
    // const player = user?.userId
    //   ? await PlayerRepository.getByUserId(user?.userId)
    //   : null;
    return {
      data: {
        displayName: user.displayName,
      },
    };
  }

  async register(
    req: EngineFarm.HttpApiLayer.ModuleRouteRequest<Partial<UserModel>>
  ): Promise<EngineFarm.HttpApiLayer.ModuleRouteResponse<UserModel>> {
    console.log("req register", req);
    if (!req.body.displayName) {
      return {
        httpStatus: 400,
        error: { message: "Display name required" },
      };
    }

    return await UserManage.createNewUser({
      displayName: req.body.displayName,
    }).then((inserted) => {
      return {
        httpStatus: 200,
        data: {
          displayName: req.body.displayName,
        },
      };
    });
  }

  async login(
    req: EngineFarm.HttpApiLayer.ModuleRouteRequest<Partial<UserModel>>
  ): Promise<EngineFarm.HttpApiLayer.ModuleRouteResponse<UserModel>> {
    if (!req.body.displayName) {
      return {
        httpStatus: 400,
        error: { message: "Display name required" },
      };
    }
    return UserManage.findByDisplayName(req.body.displayName).then(
      async (user) => {
        if (!user) {
          return {
            httpStatus: 404,
            error: { message: "User not found" },
          };
        }
        const token = await UserManage.createNewToken(user.userId);
        return {
          httpStatus: 200,
          data: <any>{
            token,
          },
        };
      }
    );
  }
}
