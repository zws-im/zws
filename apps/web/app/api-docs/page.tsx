import Link from 'next/link';
import { H1 } from '../components/headings/h1';
import { SwaggerUi } from '../components/swagger-ui';

const openapiSchemaPath = new URL('/openapi.json', process.env.NEXT_PUBLIC_API_URL);

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function ApiSchemaPage() {
	return (
		<main className='flex flex-col items-center justify-center gap-y-4'>
			<div className='text-center'>
				<H1>API Docs</H1>
			</div>

			<p>
				You can access the OpenAPI schema directly at{' '}
				<code className='underline'>
					<Link href={openapiSchemaPath.toString()}>{openapiSchemaPath.toString()}</Link>
				</code>
				.
			</p>

			<SwaggerUi schemaUrl={openapiSchemaPath.toString()} />
		</main>
	);
}
