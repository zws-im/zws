import {Static, Type} from '@sinclair/typebox';

const versionRegExp = /^v\d+\.\d+\.\d+(?:-.+)?$/;

const version = Type.RegEx(versionRegExp, {example: '2.0.0'});
// eslint-disable-next-line @typescript-eslint/naming-convention
const RawStats = Type.Object({
	// TODO: Use Type.Intersect instead of defining version twice
	version,
	urls: Type.Integer({minimum: 0, example: 4321}),
	visits: Type.Integer({minimum: 0, example: 4321}),
});

type RawStats = Static<typeof RawStats>;

const formattedNumberRegExp = /^\d{1,3}(?:,\d{1,3})*$/;

// eslint-disable-next-line @typescript-eslint/naming-convention
const FormattedStats = Type.Object({
	// TODO: Use Type.Intersect instead of defining version twice
	version,
	urls: Type.RegEx(formattedNumberRegExp, {example: '4,321'}),
	visits: Type.RegEx(formattedNumberRegExp, {example: '4,321'}),
});

type FormattedStats = Static<typeof FormattedStats>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Stats = Type.Union([RawStats, FormattedStats], {
	$id: 'Stats',
	title: 'Stats',
	description: 'Usage statistics for this instance',
});
export type Stats = Static<typeof Stats>;

// TODO: Use Type.Intersect
// TypeBox is bugged, see https://github.com/sinclairzx81/typebox/issues/102
// const BaseStats = Type.Object({
// 	version,
// });
// export const Stats = Type.Intersect([BaseStats, Type.Union([RawStats, FormattedStats])], {
// 	$id: 'Stats',
// 	title: 'Stats',
// 	description: 'Usage statistics for this instance',
// });

// export type Stats = Static<typeof Stats>;

// export type Stats = Static<typeof BaseStats> & (RawStats | FormattedStats);
