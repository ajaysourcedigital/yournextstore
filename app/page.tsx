import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background border-b border-foreground py-20 md:py-28 px-5 md:px-20">
			<div className="max-w-[1280px] mx-auto">
				<div className="text-center mb-14">
					<div className="h-3 w-24 bg-[var(--color-surface-variant)] mx-auto animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-[var(--color-surface-variant)] mx-auto animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="neo-border bg-[var(--color-surface-container-lowest)]">
							<div className="aspect-square bg-[var(--color-surface-variant)] border-b border-foreground animate-pulse" />
							<div className="p-4 space-y-3">
								<div className="h-5 w-3/4 bg-[var(--color-surface-variant)] animate-pulse" />
								<div className="h-4 w-1/3 bg-[var(--color-surface-variant)] animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Selection" limit={8} />
			</Suspense>
			<About />
		</main>
	);
}
