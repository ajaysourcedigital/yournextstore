import "@/app/globals.css";

import type { Metadata } from "next";
import { Bodoni_Moda, Work_Sans } from "next/font/google";
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

const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
	display: "swap",
});

const bodoniModa = Bodoni_Moda({
	variable: "--font-bodoni-moda",
	subsets: ["latin"],
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description: me.store.settings?.storeDescription || "Your next e-commerce store",
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
	return (
		<div className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] label-caps border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-2 flex justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="hidden sm:inline">Customer service</span>
					<span className="sm:hidden">Help</span>
				</div>
				<div className="text-center hidden md:block">Free US shipping on orders over $40</div>
				<div className="flex items-center gap-2">
					<span>$ USD</span>
				</div>
			</div>
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();
	const me = await meGetCached();
	const storeName = (me.store.settings?.storeName || "Your Next Store").toLowerCase();

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 bg-[var(--color-surface-container-lowest)] border-b border-foreground">
					<AnnouncementBar />
					{/* Desktop nav */}
					<nav className="hidden md:flex max-w-[1280px] mx-auto px-20 py-4 items-center justify-between gap-8">
						<div className="flex items-center gap-8">
							<Suspense
								fallback={
									<div className="flex items-center gap-8">
										<YnsLink
											prefetch={"eager"}
											href="/"
											className="font-sans text-sm uppercase tracking-widest font-semibold border-b border-foreground pb-1"
										>
											Shop
										</YnsLink>
									</div>
								}
							>
								<Navbar />
							</Suspense>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif text-3xl lg:text-[40px] uppercase tracking-tight leading-none font-semibold"
						>
							{storeName}
						</YnsLink>
						<div className="flex items-center gap-6">
							<Suspense>
								<SearchInput />
							</Suspense>
							<CartButton />
						</div>
					</nav>
					{/* Mobile nav */}
					<nav className="flex md:hidden max-w-[1280px] mx-auto px-5 py-4 items-center justify-between">
						<Suspense>
							<SearchInput />
						</Suspense>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif text-2xl uppercase tracking-tight leading-none font-semibold"
						>
							{storeName}
						</YnsLink>
						<CartButton />
					</nav>
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
			<body className={`${workSans.variable} ${bodoniModa.variable} antialiased`}>
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
