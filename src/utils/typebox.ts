import * as TypeBox from '@sinclair/typebox';

export * from '@sinclair/typebox';

type IntoStringLiteralUnion<T> = {[K in keyof T]: T[K] extends string | number ? TypeBox.TLiteral<T[K]> : never};

export class OpenApiTypeBuilder extends TypeBox.TypeBuilder {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public EnumList<T extends Array<string | number>>(values: readonly [...T]): TypeBox.TUnion<IntoStringLiteralUnion<T>> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return {enum: values} as any;
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Type = new OpenApiTypeBuilder();
