import { cacheLife } from "next/cache";
import { FooterNewsletter } from "@/app/newsletter/footer-newsletter";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<div className="flex flex-col gap-3 md:pl-6">
			<h4 className="label-caps mb-2">Shop</h4>
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
			>
				All Products
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	return (
		<div className="flex flex-col gap-3 md:pl-6">
			<h4 className="label-caps mb-2">Support</h4>
			<YnsLink
				prefetch={"eager"}
				href="/faq"
				className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
			>
				FAQ
			</YnsLink>
			{pages.data.map((page) => (
				<YnsLink
					prefetch={"eager"}
					key={page.id}
					href={`/legal${page.path}`}
					className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
				>
					{page.title}
				</YnsLink>
			))}
		</div>
	);
}

export async function Footer() {
	const me = await meGetCached();
	const storeName = (me.store.settings?.storeName || "Your Next Store").toLowerCase();

	return (
		<footer className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] border-t border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0 md:divide-x md:divide-[var(--color-on-tertiary)]/30">
				<div className="flex flex-col justify-between pr-6">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-serif text-3xl uppercase tracking-tight leading-none mb-8 font-semibold"
					>
						{storeName}
					</YnsLink>
					<p className="text-sm opacity-80 mt-auto">
						&copy; {new Date().getFullYear()} {storeName}. All rights reserved.
					</p>
				</div>

				<FooterCollections />
				<FooterLegalPages />

				<div className="flex flex-col gap-3 md:pl-6">
					<h4 className="label-caps mb-2">Newsletter</h4>
					<p className="text-base opacity-80 mb-2">Join our list for $10 off your first order.</p>
					<FooterNewsletter />
				</div>
			</div>
		</footer>
	);
}
