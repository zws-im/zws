import { openapiService } from '@/app/api/_lib/openapi/openapi.service';
import Link from 'next/link';
import H1 from '../components/headings/h1';
import SwaggerUi from '../components/swagger-ui';

const openapiSchemaPath = '/api/openapi.json';

export default function ApiSchemaPage() {
	const schema = openapiService.getOpenapi();

	return (
		<main className='flex flex-col items-center justify-center gap-y-4'>
			<div className='text-center'>
				<H1>API Docs</H1>
			</div>

			<p>
				You can access the OpenAPI schema directly at{' '}
				<code className='underline'>
					<Link href={openapiSchemaPath}>{openapiSchemaPath}</Link>
				</code>
				.
			</p>

			<SwaggerUi schema={schema} />
		</main>
	);
}
