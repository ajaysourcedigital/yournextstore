import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	return (
		<nav className="hidden lg:flex items-center gap-8">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-[13px] font-medium tracking-wide text-[var(--olive-deep)]/80 hover:text-[var(--olive-deep)] transition-colors"
			>
				Home
			</YnsLink>
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-[13px] font-medium tracking-wide text-[var(--olive-deep)]/80 hover:text-[var(--olive-deep)] transition-colors"
			>
				Shop All
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-[13px] font-medium tracking-wide text-[var(--olive-deep)]/80 hover:text-[var(--olive-deep)] transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="#mission"
				className="text-[13px] font-medium tracking-wide text-[var(--olive-deep)]/80 hover:text-[var(--olive-deep)] transition-colors"
			>
				Our Mission
			</YnsLink>
		</nav>
	);
}
