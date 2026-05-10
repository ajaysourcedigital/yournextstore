import "@/app/globals.css";

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

const cormorant = Cormorant_Garamond({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description: me.store.settings?.storeDescription || "Curated essentials with a conscience.",
		icons: {
			icon: [
				{ url: faviconUrl, sizes: "any", type: "image/svg+xml" },
				{ url: faviconUrl, sizes: "192x192", type: "image/png" },
			],
			apple: [{ url: faviconUrl, sizes: "180x180" }],
			shortcut: faviconUrl,
		},
		manifest: "/manifest.webmanifest",
	};
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

function AnnouncementBar() {
	const items = [
		"Free carbon-neutral shipping on orders over $80",
		"New Spring Edition is here",
		"Members save 15% on first order",
		"Refill, reuse, repeat — our ethos",
	];
	const loop = [...items, ...items];

	return (
		<div className="bg-[var(--olive-deep)] text-[var(--cream)] overflow-hidden text-[11px] tracking-[0.18em] uppercase">
			<div className="flex animate-ticker whitespace-nowrap py-2.5 gap-12">
				{loop.map((text, i) => (
					<span key={`${text}-${i}`} className="flex items-center gap-12 shrink-0">
						<span className="opacity-60">✦</span>
						<span>{text}</span>
					</span>
				))}
			</div>
		</div>
	);
}

function Logo() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2 group">
			<svg
				viewBox="0 0 32 32"
				className="h-7 w-7 text-[var(--olive-deep)] transition-transform group-hover:rotate-12"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				aria-hidden="true"
			>
				<path d="M16 4 C 9 9, 6 16, 16 28 C 26 16, 23 9, 16 4 Z" strokeLinejoin="round" />
				<path d="M16 4 L 16 28" strokeLinecap="round" />
				<path d="M16 12 L 11 9" strokeLinecap="round" />
				<path d="M16 16 L 22 13" strokeLinecap="round" />
				<path d="M16 20 L 11 17" strokeLinecap="round" />
			</svg>
			<span className="font-display text-2xl font-medium tracking-tight text-[var(--olive-deep)]">
				Your Next Store
			</span>
		</YnsLink>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-background">
				<AnnouncementBar />
				<header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
					<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
						<div className="flex items-center justify-between h-20">
							<div className="flex items-center gap-10 flex-1">
								<Logo />
								<Navbar />
							</div>
							<div className="flex items-center gap-2">
								<Suspense>
									<SearchInput />
								</Suspense>
								<CartButton />
							</div>
						</div>
					</div>
				</header>
				<div className="flex-1">{children}</div>
				<Footer />
				<ReferralBadge />
			</div>
			<CartSidebar />
		</CartProvider>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${inter.variable} ${cormorant.variable} antialiased`}>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
			</body>
		</html>
	);
}
