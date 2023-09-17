'use client';
import type { oas31 } from 'openapi3-ts';
// biome-ignore lint/style/useNamingConvention: This is a React component
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
	schema: oas31.OpenAPIObject;
};

export default function SwaggerUi({ schema }: Props) {
	return (
		<div className='bg-purple-50 rounded p-4 w-full'>
			<SwaggerUI spec={schema} />
		</div>
	);
}
