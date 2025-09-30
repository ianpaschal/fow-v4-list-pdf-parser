export interface ForceMetadata {
  Title: string; // e.g. "Leviathans: American Force"
  SubTitle: string; // User's custom title
  TotalPoints: number;
  Book: string; // e.g. "Leviathans"
  UnitCount: number;
  DynamicPoints: boolean;
}

export interface ForceData extends ForceMetadata {
  Formations: Formation[];
  PickList?: PickListItem[];
  CardList?: CardListItem[];
}

export interface Formation {
  FormationID: number;
  FormationName: string; // 'M4 Sherman Tank Company', 'Support', 'Bulge: American Formation Support', etc.
  FormationCardID: string | null; // 'LU611' (null for support)
  FormationNationality: string; // 'U.S.', 'British', etc.
  FormationPoints: number;
  Units: Unit[];
}

export interface Unit {
  UnitID: number;
  UnitName: string; // 'Veteran M4 Easy Eight Tank Company HQ',
  UnitCardID: string; // 'LU611',
  UnitPoints: number;
  UnitNationality: string; // 'U.S.',
  UnitAdditionalCards: string; // jeep unit card ID for eg
  Options: UnitOption[];
}

export interface UnitOption {
  isMainSelection: boolean;
  OptionText: string; // '2x M4 Easy Eight (76mm)' OR "Replace up to one M4 Easy Eight (76mm) with M4 Jumbo (75mm) (LU193) at no cost, or"
  OptionPoints: number;
}

export interface PickListItem {
  Item: string; // 'M26 Assault Pershing (90mm)',
  Quantity: number;  
}

export interface CardListItem {
  Card: string; // 'LU193',
  Name: string; // 'M4 Jumbo',
  IsFormation: boolean;
}
