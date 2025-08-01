import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script
					async
					src="https://kit.fontawesome.com/c1925a55b2.js"
					crossOrigin="anonymous"
				></script>
				
				<link
					href="https://fonts.cdnfonts.com/css/montserrat"
					rel="stylesheet"
				></link>

			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
