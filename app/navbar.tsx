import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	return (
		<nav className="hidden sm:flex items-center gap-7">
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors"
			>
				Shop
			</YnsLink>
			{collections.data.slice(0, 2).map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="/faq"
				className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors hidden lg:inline-flex"
			>
				Journal
			</YnsLink>
		</nav>
	);
}
