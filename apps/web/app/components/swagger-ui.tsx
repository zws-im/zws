'use client';
// biome-ignore lint/style/useNamingConvention: This is a React component
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
	schemaUrl: string;
};

export function SwaggerUi({ schemaUrl }: Props) {
	return (
		<div className='w-full rounded bg-purple-50 p-4'>
			<SwaggerUI url={schemaUrl} />
		</div>
	);
}
