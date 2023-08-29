'use client';

import { useState } from 'react';

type Props = {
	length: number;
	initial?: string;
};

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateText(length: number) {
	let text = '';

	for (let i = 0; i < length; i++) {
		text += characters[Math.floor(Math.random() * characters.length)];
	}

	return text;
}

export default function RandomText({ length, initial }: Props) {
	const [text, setText] = useState(initial ?? generateText(length));

	const onClick = () => {
		setText(generateText(length));
	};

	return (
		<button className='underline decoration-dotted font-mono pl-1' type='button' onClick={onClick}>
			{text}
		</button>
	);
}
