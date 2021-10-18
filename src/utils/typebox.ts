import * as TypeBox from '@sinclair/typebox';

export * from '@sinclair/typebox';

export class OpenApiTypeBuilder extends TypeBox.TypeBuilder {
	// This return type is wrong, it doesn't expose a `const` field value
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public EnumList<T extends number | string>(values: readonly T[]): TypeBox.TLiteral<T> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return {enum: values, type: typeof values[0]} as any;
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Type = new OpenApiTypeBuilder();
