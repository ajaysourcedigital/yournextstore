import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	return (
		<nav className="hidden md:flex items-center gap-7">
			<YnsLink
				prefetch={"eager"}
				href="/"
				className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
			>
				Shop
			</YnsLink>
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
			>
				New arrivals
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink
				prefetch={"eager"}
				href="#story"
				className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
			>
				Journal
			</YnsLink>
		</nav>
	);
}
