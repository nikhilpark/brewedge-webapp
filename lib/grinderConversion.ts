import { GRINDER_MODELS } from './api';

export function convertGrinderSetting(
  fromGrinderId: string,
  fromSetting: number,
  toGrinderId: string
): number | null {
  const fromGrinder = GRINDER_MODELS.find(g => g.id === fromGrinderId);
  const toGrinder = GRINDER_MODELS.find(g => g.id === toGrinderId);

  if (!fromGrinder || !toGrinder) return null;
  if (fromSetting < fromGrinder.minSetting || fromSetting > fromGrinder.maxSetting) return null;

  // Normalize to percentage of the "from" grinder's range
  const fromRange = fromGrinder.maxSetting - fromGrinder.minSetting;
  const normalizedPercentage = (fromSetting - fromGrinder.minSetting) / fromRange;

  // Apply to "to" grinder's range
  const toRange = toGrinder.maxSetting - toGrinder.minSetting;
  const convertedSetting = toGrinder.minSetting + normalizedPercentage * toRange;

  // Round to nearest whole number for clicks, keep decimal precision for dials
  if (toGrinder.settingType === 'clicks') {
    return Math.round(convertedSetting);
  } else {
    return Math.round(convertedSetting * 10) / 10;
  }
}

export function getGrinderInfo(grinderId: string) {
  return GRINDER_MODELS.find(g => g.id === grinderId);
}
