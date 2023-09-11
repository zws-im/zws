import { openapiService } from '@/app/api/_lib/openapi/openapi.service';
import Link from 'next/link';
import { H1, SwaggerUi } from '../components';

const schema = openapiService.getOpenapi();

const openapiSchemaPath = '/api/openapi.json';

export default function ApiSchemaPage() {
	return (
		<main className='flex flex-col gap-y-4 items-center justify-center'>
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
