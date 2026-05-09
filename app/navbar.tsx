import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	return (
		<nav className="flex items-center gap-8">
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="font-sans text-sm font-medium uppercase tracking-widest text-foreground border-b border-foreground pb-1"
			>
				Shop
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="font-sans text-sm font-medium uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/faq"
				className="font-sans text-sm font-medium uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:text-foreground transition-colors"
			>
				FAQ
			</YnsLink>
		</nav>
	);
}
