import {
  FowV4BfForceMetadata,
  FowV4BfFormation,
  FowV4BfUnitOption,
} from '../types';
import { checkIsEndOfList } from '../utils/checkIsEndOfList';
import { extractNationality, extractNationalityFromSourceId } from '../utils/extractNationality';
import { extractPoints } from '../utils/extractPoints';
import { extractSourceId } from '../utils/extractSourceId';

export function build(data: string[][]) {
  const metadata: Partial<FowV4BfForceMetadata> = {};
  const formations: FowV4BfFormation[] = [];
  
  let formationIndex: number = -1;
  let unitIndex: number = -1;

  let firstFormationLineIndex: number = 0;

  // Walk through the file contents, line by line:
  for (let i = 0; i < data.length; i++) {
    const line = data[i];

    const cardId = extractSourceId(line);
    const nationality = extractNationality(line);
    const points = extractPoints(line);

    // End the process if we've reached the bottom of the list data:
    if (checkIsEndOfList(line)) {
      break;
    }

    // Otherwise build up the list by adding formations, units, and options:
    const isFormation = !!nationality;
    const isUnit = !!cardId && !nationality;
    const isSelection = !cardId && !nationality && i > 2;

    // Is formation:
    if (isFormation) {
      formationIndex++;
      unitIndex = -1;
      formations.push({
        FormationID: formationIndex + 1,
        FormationCardID: cardId,
        FormationName: line[0] ?? '',
        FormationNationality: nationality,
        FormationPoints: points,
        Units: [],
      });
      if (!firstFormationLineIndex) {
        firstFormationLineIndex = i;
      }
    }

    // Is unit:
    if (isUnit) {
      unitIndex++;
      formations[formationIndex].Units.push({
        UnitID: unitIndex + 1,
        UnitCardID: cardId,
        UnitName: line[0] ?? '',
        UnitNationality: extractNationalityFromSourceId(cardId),
        UnitPoints: points,
        UnitAdditionalCards: '',
        Options: [],
      });
    }

    if (isSelection) {
      formations[formationIndex].Units[unitIndex].Options.push({
        isMainSelection: /^\d{1,2}x\s.+$/.test(line[0]),
        OptionPoints: points, // TODO: This doesn't work for non-main options (such as PF)...
        OptionText: line[0],
      });
    }
  }

  // Extract title:
  if (firstFormationLineIndex === 2) {
    metadata.SubTitle = data[0][0];
    metadata.Title = data[1][0];
  } else {
    metadata.SubTitle = '';
    metadata.Title = data[0][0];
  }

  // Combine main options:
  for (const formation of formations) {
    for (const unit of formation.Units) {
      const { mainOptions, otherOptions } = unit.Options.reduce((acc, option) => {
        if (option.isMainSelection) {
          return {
            ...acc,
            mainOptions: [
              ...acc.mainOptions,
              option,
            ],
          };
        } else {
          return {
            ...acc,
            otherOptions: [
              ...acc.otherOptions,
              option,
            ],
          };
        }
      }, {
        mainOptions: [],
        otherOptions: [],
      } as { mainOptions: FowV4BfUnitOption[], otherOptions: FowV4BfUnitOption[] });
      unit.Options = [
        mainOptions.reduce((acc, option) => ({
          isMainSelection: true,
          OptionPoints: acc.OptionPoints + option.OptionPoints,
          OptionText: acc.OptionText.length ? `${acc.OptionText}, ${option.OptionText}` : option.OptionText,
        }), {
          isMainSelection: true,
          OptionPoints: 0,
          OptionText: '',
        }),
        ...otherOptions,
      ];
    }
  }

  return {
    ...metadata,
    Formations: formations,
  };
}
