'use client';

import { useState } from 'react';
import { faqObject, faq, firstFaqOption } from './content';
import FaqEntry from './faq-entry';
import FaqSelector from './faq-selector';

export default function Faq() {
	const [selectedId, setSelectedId] = useState(firstFaqOption.id);
	const selected = faqObject[selectedId];

	return (
		<div className='flex justify-between w-full max-lg:flex-col max-lg:space-y-4 lg:space-x-28'>
			<div className='max-lg:w-full lg:min-w-fit'>
				<FaqSelector initialSelected={firstFaqOption.id} onSelect={setSelectedId} options={faq} />
			</div>

			<div className='max-lg:w-full'>
				<FaqEntry>{selected.content}</FaqEntry>
			</div>
		</div>
	);
}
