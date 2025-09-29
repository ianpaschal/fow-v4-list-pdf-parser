import { FowV4BfFormation } from '../types';

export function isFowV4BfFormationData(r: object): r is Omit<FowV4BfFormation, 'FormationID'> {
  return 'FormationName' in r && 'FormationCardID' in r && 'FormationNationality' in r;
}
