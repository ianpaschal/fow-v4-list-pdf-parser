export interface FowV4BfForceMetadata {
  Title: string; // e.g. "Leviathans: American Force"
  SubTitle: string; // User's custom title
  TotalPoints: number;
  Book: string; // e.g. "Leviathans"
  UnitCount: number;
  DynamicPoints: boolean;
}

export interface FowV4BfForceData extends FowV4BfForceMetadata {
  Formations: FowV4BfFormation[];
  PickList?: FowV4BfPickListItem[];
  CardList?: FowV4BfCardListItem[];
}

export interface FowV4BfFormation {
  FormationID: number;
  FormationName: string | 'Support';
  FormationCardID: string | null; // 'LU611' (null for support);
  FormationNationality: string; // 'U.S.';
  FormationPoints: number;
  Units: FowV4BfUnit[];
}

export interface FowV4BfUnit {
  UnitID: number;
  UnitName: string; // 'Veteran M4 Easy Eight Tank Company HQ',
  UnitCardID: string; // 'LU611',
  UnitPoints: number;
  UnitNationality: string; // 'U.S.',
  UnitAdditionalCards: string; // jeep unit card ID for eg
  Options: FowV4BfUnitOption[];
}

export interface FowV4BfUnitOption {
  isMainSelection: boolean;
  OptionText: string; // '2x M4 Easy Eight (76mm)' OR "Replace up to one M4 Easy Eight (76mm) with M4 Jumbo (75mm) (LU193) at no cost, or"
  OptionPoints: number;
}

export interface FowV4BfPickListItem {
  Item: string; // 'M26 Assault Pershing (90mm)',
  Quantity: number;  
}

export interface FowV4BfCardListItem {
  Card: string; // 'LU193',
  Name: string; // 'M4 Jumbo',
  IsFormation: boolean;
}
