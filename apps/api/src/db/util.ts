import { MatchLevel } from '../first/enums/match-level.enum';
import { Schema } from './index';

export function matchLevelToDb(level: MatchLevel): Schema.MatchLevel {
	switch (level) {
		case MatchLevel.Playoff:
			return Schema.MatchLevel.Playoff;
		case MatchLevel.Qualification:
			return Schema.MatchLevel.Qualification;
	}
}

export function matchLevelFromDb(level: Schema.MatchLevel): MatchLevel {
	switch (level) {
		case Schema.MatchLevel.Playoff:
			return MatchLevel.Playoff;
		case Schema.MatchLevel.Qualification:
			return MatchLevel.Qualification;
	}
}
