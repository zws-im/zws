import {ApiProperty} from '@nestjs/swagger';

/**
 * Shields endpoint response.
 */
export class ShieldsResponseDto {
	@ApiProperty({enum: [1]})
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly schemaVersion = 1;

	@ApiProperty({minimum: 300})
	cacheSeconds?: number;

	/**
	 * @example 'urls'
	 */
	label: string;

	/**
	 * @example '3.4M'
	 */
	message: string;

	color?: string;
	labelColor?: string;
	isError?: string;
	namedLogo?: string;
	logoSvg?: string;
	logoColor?: string;
	logoWidth?: string;
	logoPosition?: string;
	style?: string;

	constructor(options: Omit<ShieldsResponseDto, 'schemaVersion'>) {
		this.label = options.label;
		this.message = options.message;

		if (options.color !== undefined) {
			this.color = options.color;
		}

		if (options.labelColor !== undefined) {
			this.labelColor = options.labelColor;
		}

		if (options.isError !== undefined) {
			this.isError = options.isError;
		}

		if (options.namedLogo !== undefined) {
			this.namedLogo = options.namedLogo;
		}

		if (options.logoSvg !== undefined) {
			this.logoSvg = options.logoSvg;
		}

		if (options.logoColor !== undefined) {
			this.logoColor = options.logoColor;
		}

		if (options.logoWidth !== undefined) {
			this.logoWidth = options.logoWidth;
		}

		if (options.logoPosition !== undefined) {
			this.logoPosition = options.logoPosition;
		}

		if (options.style !== undefined) {
			this.style = options.style;
		}

		if (options.cacheSeconds !== undefined) {
			this.cacheSeconds = options.cacheSeconds;
		}
	}
}
