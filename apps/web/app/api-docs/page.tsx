import type { Metadata } from 'next';
import Link from 'next/link';
import { H1 } from '../components/headings/h1';
import { SwaggerUi } from '../components/swagger-ui';

const openapiSchemaPath = new URL('/openapi.json', process.env.NEXT_PUBLIC_API_URL);

export const metadata: Metadata = {
	title: 'مستندات API',
	description: 'مستندات API برای zws.im.',
	alternates: {
		canonical: '/api-docs',
	},
};

export default function ApiSchemaPage() {
	return (
		<main className='flex flex-col items-center justify-center gap-y-4'>
			<div className='text-center'>
				<H1>مستندات API</H1>
			</div>

			<p>
				می‌توانید به شمای OpenAPI از این آدرس دسترسی داشته باشید:{' '}
				<code className='underline'>
					<Link href={openapiSchemaPath.toString()}>{openapiSchemaPath.toString()}</Link>
				</code>
				.
			</p>

			<SwaggerUi schemaUrl={openapiSchemaPath.toString()} />
		</main>
	);
}
