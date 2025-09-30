import {
  ForceMetadata,
  Formation,
  UnitOption,
} from '../types';
import { checkIsEndOfList } from '../utils/checkIsEndOfList';
import { extractNationality, extractNationalityFromSourceId } from '../utils/extractNationality';
import { extractPoints } from '../utils/extractPoints';
import { extractSourceId } from '../utils/extractSourceId';

export function build(data: string[][]) {
  const metadata: Partial<ForceMetadata> = {
    _createdBy: 'fow-v4-list-parser@v1.0.0',
    _createdAt: new Date().toISOString(),
  };
  const formations: Formation[] = [];
  
  let formationIndex: number = -1;
  let unitIndex: number = -1;

  let firstFormationLineIndex: number = 0;

  // Walk through the file contents, line by line:
  for (let i = 0; i < data.length; i++) {
    const line = data[i];

    const cardId = extractSourceId(line);
    const nationality = extractNationality(line);
    const points = extractPoints(line);

    const currentFormation = formations[formationIndex];
    const currentUnit = currentFormation?.Units[unitIndex];

    // End the process if we've reached the bottom of the list data:
    if (checkIsEndOfList(line)) {
      const units = line[1].match(/(\d{1,3})$/);
      metadata.UnitCount = units ? parseInt(units[1], 10) : 0;
      
      const points = line[2].match(/(\d{1,3})$/);
      metadata.TotalPoints = points ? parseInt(points[1], 10) : 0;
      
      break;
    }

    // Otherwise build up the list by adding formations, units, and options:
    const isFormation = !!nationality;
    const isUnit = !!cardId && !nationality;

    // Counterintuitive, but command cards do not contain "Command Card" in their name, their selections do:
    const isCommandCard = !cardId && !nationality && !line[0].toLowerCase().includes('command card') && !line[0].toLowerCase().includes('selected)');
    const isOption = !cardId && !nationality && i > 2 && !isCommandCard;

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
      // Only process units if we have a valid formation
      if (currentFormation) {
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
    }

    // Is command card:
    if (isCommandCard) {
      // Only process command cards if we have a valid formation
      if (currentFormation) {
        unitIndex++;
        formations[formationIndex].Units.push({
          UnitID: unitIndex + 1,
          UnitCardID: cardId,
          UnitName: line[0] ?? '',
          UnitNationality: formations[formationIndex].FormationNationality,
          UnitPoints: points,
          Options: [],
        });
      }
    }

    if (isOption) {
      console.log('option', line[0]);
      // Only process selections if we have a valid formation and unit
      if (currentFormation && currentUnit) {
        formations[formationIndex].Units[unitIndex].Options.push({
          isMainSelection: /^\d{1,2}x\s.+$/.test(line[0]),
          OptionPoints: points, // TODO: This doesn't work for non-main options (such as PF)...
          OptionText: line[0],
        });
      }
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
      } as { mainOptions: UnitOption[], otherOptions: UnitOption[] });
      unit.Options = [
        ...(mainOptions.length ? [
          mainOptions.reduce((acc, option) => ({
            isMainSelection: true,
            OptionPoints: acc.OptionPoints + option.OptionPoints,
            OptionText: acc.OptionText.length ? `${acc.OptionText}, ${option.OptionText}` : option.OptionText,
          }), {
            isMainSelection: true,
            OptionPoints: 0,
            OptionText: 'ff',
          }),
        ] : []),
        ...otherOptions,
      ];
    }
  }

  return {
    ...metadata,
    Formations: formations,
  };
}
