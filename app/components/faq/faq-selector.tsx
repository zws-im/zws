import { ReactNode } from 'react';

type FaqOption = {
	content: ReactNode;
};

type Props = {
	children: FaqOption[];
};

export default function FaqSelector(props: Props) {
	return (
		<div>
			<select>
				{props.children.map((option, index) => {
					// eslint-disable-next-line lint/suspicious/noArrayIndexKey
					return <option key={index}>{option.content}</option>;
				})}
			</select>
		</div>
	);
}
