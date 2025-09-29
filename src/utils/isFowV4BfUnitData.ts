import { FowV4BfUnit } from '../types';

export function isFowV4BfUnitData(r: object): r is Omit<FowV4BfUnit, 'UnitID'> {
  return 'UnitName' in r && 'UnitCardID' in r && 'UnitNationality' in r && 'UnitPoints' in r;
}
