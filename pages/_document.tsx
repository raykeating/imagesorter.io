import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script
					async
					src="https://kit.fontawesome.com/85b9814f97.js"
					crossOrigin="anonymous"
				></script>
				<link
					href="https://fonts.cdnfonts.com/css/montserrat"
					rel="stylesheet"
				></link>
				{/* SEO */}

				<meta name="title" content="ImageSorter.io" />
				<meta
					name="description"
					content="A free tool for sorting and organizing your images"
				/>
				
				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://imagesorter.io/" />
				<meta property="og:title" content="ImageSorter.io" />
				<meta
					property="og:description"
					content="A free tool for sorting and organizing your images"
				/>
				<meta
					property="og:image"
					content="https://imagesorter.io/ImageSorterLogo.png"
				/>
				
				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://imagesorter.io/" />
				<meta property="twitter:title" content="ImageSorter.io" />
				<meta
					property="twitter:description"
					content="A free tool for sorting and organizing your images"
				/>

				<meta
					property="twitter:image"
					content="https://imagesorter.io/ImageSorterLogo.png"
				/>

				{/* Favicon */}
				<link rel="icon" href="/favicon.ico" />

			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
