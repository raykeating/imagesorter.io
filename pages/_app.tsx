import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>ImageSorter.io - A free tool for sorting and organizing your images</title>
				<meta name="title" content="ImageSorter.io" />
				<meta
					name="description"
					content="A drag and drop interface for sorting, tagging, and organizing your images (with AI)!  No sign up required."
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
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
