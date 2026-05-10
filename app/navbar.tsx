import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	const linkClass =
		"text-[13px] font-medium tracking-wide text-white/80 hover:text-[var(--lime)] transition-colors uppercase";

	return (
		<nav className="hidden md:flex items-center gap-7">
			<YnsLink prefetch={"eager"} href="/" className={linkClass}>
				Home
			</YnsLink>
			<YnsLink prefetch={"eager"} href="/products" className={linkClass}>
				Products
			</YnsLink>
			{collections.data.map((collection) => (
				<YnsLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className={linkClass}
				>
					{collection.name}
				</YnsLink>
			))}
			<YnsLink prefetch={"eager"} href="/faq" className={linkClass}>
				FAQ
			</YnsLink>
		</nav>
	);
}
