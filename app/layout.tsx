import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description: me.store.settings?.storeDescription || "Clean, renewable energy for the next generation.",
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
		<div className="bg-[var(--forest-deep)] text-[var(--lime-soft)] text-xs sm:text-[13px]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
				<p className="hidden sm:flex items-center gap-2">
					<span aria-hidden className="inline-block size-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
					Free shipping on residential systems over $2,500
				</p>
				<p className="sm:hidden flex items-center gap-2">
					<span aria-hidden className="inline-block size-1.5 rounded-full bg-[var(--lime)]" />
					Free shipping over $2,500
				</p>
				<div className="flex items-center gap-4 text-[var(--lime-soft)]/80">
					<span className="hidden md:inline">Federal tax credit available</span>
					<span aria-hidden className="hidden md:inline opacity-30">
						|
					</span>
					<a href="tel:+18005551234" className="hover:text-white transition-colors">
						1-800-555-SOLAR
					</a>
				</div>
			</div>
		</div>
	);
}

function Logo() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2 group">
			<span className="relative flex size-8 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--forest-deep)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					className="size-4"
					aria-hidden
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="4" fill="currentColor" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</svg>
			</span>
			<span className="text-[15px] font-semibold tracking-[0.18em] text-white uppercase">
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
				<header className="sticky top-0 z-50 bg-[var(--forest)] text-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 sm:h-[72px]">
							<div className="flex items-center gap-10">
								<Logo />
								<Navbar />
							</div>
							<div className="flex items-center gap-1.5">
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
			<body className={`${inter.variable} font-sans antialiased`}>
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
