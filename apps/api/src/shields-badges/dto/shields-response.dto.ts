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
		this.color = options.color;
		this.labelColor = options.labelColor;
		this.isError = options.isError;
		this.namedLogo = options.namedLogo;
		this.logoSvg = options.logoSvg;
		this.logoColor = options.logoColor;
		this.logoWidth = options.logoWidth;
		this.logoPosition = options.logoPosition;
		this.style = options.style;
		this.cacheSeconds = options.cacheSeconds;
	}
}
