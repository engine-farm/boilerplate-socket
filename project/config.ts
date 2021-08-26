
import * as EngineFarm from "@engine-farm/sdk-types";
export interface ConfigWorldSettings {
  length: { x: number; y: number };
  size: { x: number; y: number };
}

export const DefaultObjectSettings = {
  platform: {
    cell: {
      maxLvl: 4,
      maxHP: 5000,
    },
    building: {
      maxLvl: 3,
      maxHP: 1000,
    },
  },
};

export interface ConfigWorld {
  id: string;
  name: string;
  sector: ConfigWorldSettings;
  memoryPositioningInstance: {
    host: string;
    port: 3001;
  };
  requiresToStart: {
    sectors: number;
    workers: number;
  };
}

export const FullGameConfig: EngineFarm.GameConfig = {
  worlds: [
    {
      worldId: "world-1",
      name: "World #1",
      sector: {
        length: { x: 2, y: 1 },
        size: { x: 200, y: 200 },
      },
      requireToInit: {
        sectors: 2,
        workers: 1,
      },
    },
  ],
  engineSettings: {
    framesPerSecond: 1000 / 16,
  },
};
