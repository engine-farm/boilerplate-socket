import * as EngineFarm from '@engine-farm/sdk-types';

export class PlatformModel {
    platformId: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
}


const FakeDBPlatforms: { [index: number]: PlatformModel } = {
    1: {
        platformId: 1,
        position: {
            x: 5, y: 0, z: 5
        }
    }
}

export class PlatformManager {
    private static redisNamespace = 'e:platform';

    static get(platformId: number): Promise<PlatformModel> {
        return EngineFarm.BaseManager.get(this.redisNamespace, platformId);
    }

    static set(platformId: number, data: PlatformModel) {
        return EngineFarm.BaseManager.set(this.redisNamespace, platformId, data);
    }

    static update(platformId: number, data: Partial<PlatformModel>) {
        return EngineFarm.BaseManager.update(this.redisNamespace, platformId, data);
    }

}

Object.values(FakeDBPlatforms).forEach((platform)=>{
    PlatformManager.set(platform.platformId, platform)
})
