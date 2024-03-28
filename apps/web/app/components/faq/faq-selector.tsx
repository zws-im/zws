'use client';

import { useState } from 'react';
import { FaqButton } from './faq-button';
import type { FaqOption } from './types';

type Props = {
	options: Pick<FaqOption, 'title' | 'id'>[];
	initialSelected: string;
	onSelect: (id: string) => void;
};

export function FaqSelector({ options, onSelect, initialSelected }: Props) {
	const [selected, setSelected] = useState(initialSelected);

	const onClickFactory = (id: string) => () => {
		setSelected(id);
		onSelect(id);
	};

	return (
		<div className='flex flex-col justify-start'>
			{options.map((option) => (
				<FaqButton key={option.id} onClick={onClickFactory(option.id)} selected={selected === option.id}>
					{option.title}
				</FaqButton>
			))}
		</div>
	);
}
