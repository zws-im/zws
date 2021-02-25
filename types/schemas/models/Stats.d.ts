interface RawStats {
	/**
	 * @asType integer
	 * @minimum 0
	 * @example 4321
	 */
	urls: number;
	/**
	 * @asType integer
	 * @minimum 0
	 * @example 4321
	 */
	visits: number;
}

interface FormattedStats {
	/**
	 * @pattern ^\d{1,3}(?:,\d{1,3})*$
	 * @example '4,321'
	 */
	urls: string;
	/**
	 * @pattern ^\d{1,3}(?:,\d{1,3})*$
	 * @example '4,321'
	 */
	visits: string;
}

/**
 * @title Stats
 * @description Usage statistics for this instance
 */
export type Stats = {
	/**
	 * @pattern ^v\d+\.\d+\.\d+(?:\-.+)?$
	 * @example '2.0.0'
	 */
	version: string;
} & (RawStats | FormattedStats);

export default Stats;
