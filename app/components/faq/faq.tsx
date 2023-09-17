'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { faq, faqObject, firstFaqOption } from './content';
import FaqSelector from './faq-selector';

export default function Faq() {
	const [selectedId, setSelectedId] = useState(firstFaqOption.id);
	const selected = faqObject[selectedId];

	return (
		<div className='flex w-full justify-between max-lg:flex-col max-lg:space-y-4 lg:space-x-28'>
			<div className='max-lg:w-full lg:min-w-fit'>
				<FaqSelector initialSelected={firstFaqOption.id} onSelect={setSelectedId} options={faq} />
			</div>

			<AnimatePresence initial={false} mode='wait'>
				<motion.div
					className='max-lg:w-full'
					key={selected.id}
					initial={{ opacity: 0, y: '5%' }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: '-5%' }}
				>
					{selected.content}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
