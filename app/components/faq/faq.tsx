import FaqEntry from './faq-entry';
import FaqSelector from './faq-selector';

export default function Faq() {
	return (
		<div>
			<FaqSelector>
				{[
					{ content: 'How does this tool work?' },
					{ content: 'Why can I see some characters at the end of the link?' },
					{ content: "Why doesn't ZWS work on [chat service]?" },
				]}
			</FaqSelector>

			<FaqEntry>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>

				<p>
					Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Adipiscing at in tellus integer feugiat.
					Ultrices tincidunt arcu non sodales neque sodales. Quisque sagittis purus sit amet volutpat consequat mauris
					nunc. A pellentesque sit amet porttitor eget dolor. Tempor orci dapibus ultrices in iaculis nunc. At auctor
					urna nunc id cursus metus aliquam. Amet consectetur adipiscing elit ut. Orci dapibus ultrices in iaculis nunc.
					Mauris cursus mattis molestie a iaculis at. Pellentesque habitant morbi tristique senectus et netus et
					malesuada fames. Elementum integer enim neque volutpat ac tincidunt vitae semper. Sed euismod nisi porta lorem
					mollis aliquam ut porttitor leo. Aliquet lectus proin nibh nisl condimentum id venenatis.
				</p>

				<p>
					Mauris nunc congue nisi vitae suscipit tellus. Netus et malesuada fames ac turpis egestas. Massa sapien
					faucibus et molestie ac feugiat sed. Viverra accumsan in nisl nisi scelerisque eu ultrices. Habitant morbi
					tristique senectus et netus et malesuada fames. Est velit egestas dui id ornare arcu odio ut sem. Amet cursus
					sit amet dictum sit amet justo. Accumsan in nisl nisi scelerisque eu ultrices vitae. Enim neque volutpat ac
					tincidunt vitae. Lacus sed viverra tellus in. Massa placerat duis ultricies lacus sed turpis.
				</p>
			</FaqEntry>
		</div>
	);
}
