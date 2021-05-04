import {
  epoch0Pools,
  epoch2Pools,
  epoch3Pools,
  epoch4Pools,
  epoch5Pools,
  epoch6Pools,
  epoch7Pools,
  epoch8Pools,
  epoch9Pools,
  epoch10Pools,
  epoch11Pools,
  epoch12Pools,
  epoch13Pools,
  strategy0,
  strategy2,
  strategy3,
  strategy4,
  strategy5,
  strategy6,
  strategy7,
  strategy8,
  strategy9,
  strategy10,
  strategy11,
  strategy12,
  strategy13,
} from "lib/config/pools";

export const allPools = [
  [...epoch0Pools],
  [],
  [...epoch2Pools],
  [...epoch3Pools],
  [...epoch4Pools],
  [...epoch5Pools],
  [...epoch6Pools],
  [...epoch7Pools],
  [...epoch8Pools],
  [...epoch9Pools],
  [...epoch10Pools],
  [...epoch11Pools],
  [...epoch12Pools],
  [...epoch13Pools],
];

export const allStrategies = [
  strategy0,
  "",
  strategy2,
  strategy3,
  strategy4,
  strategy5,
  strategy6,
  strategy7,
  strategy8,
  strategy9,
  strategy10,
  strategy11,
  strategy12,
  strategy13,
];

export const currentEpoch = 13;

export const currentPools = allPools[currentEpoch];
export const currentStrategy = allStrategies[currentEpoch];
