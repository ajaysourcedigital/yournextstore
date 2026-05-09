import { Search } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductsPagination } from "@/app/products/products-pagination";
import { ProductCard } from "@/components/product-card";
import { FilterSidebar, SORT_OPTIONS, type SortValue } from "@/components/sections/filter-sidebar";
import { commerce } from "@/lib/commerce";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q} — Your Next Store` : "Search — Your Next Store",
		description: q ? `Search results for "${q}"` : "Search our store",
	};
}

function SearchHeader({ q, count }: { q?: string; count?: number }) {
	return (
		<section className="bg-[var(--color-primary-container)] border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
				<div>
					<span className="label-caps text-[var(--color-on-primary-container)]">Search</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] leading-[1.05] mt-3 text-[var(--color-on-primary-container)]">
						{q ? `“${q}”` : "Search the store"}
					</h1>
				</div>
				{typeof count === "number" && (
					<div className="label-caps neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)]">
						{count} {count === 1 ? "result" : "results"}
					</div>
				)}
			</div>
		</section>
	);
}

async function SearchResults({
	q,
	page,
	sort,
	category,
}: {
	q?: string;
	page?: string;
	sort?: string;
	category?: string;
}) {
	"use cache";
	cacheLife("minutes");

	const trimmed = q?.trim();
	if (!trimmed) {
		return (
			<div className="neo-border bg-[var(--color-surface-container-lowest)] py-20 text-center">
				<Search className="mx-auto h-10 w-10 text-[var(--color-on-surface-variant)]" />
				<p className="mt-4 font-serif text-2xl">Search our store</p>
				<p className="mt-2 text-[var(--color-on-surface-variant)]">
					Type a query above to discover products.
				</p>
			</div>
		);
	}

	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = SORT_OPTIONS.find((s) => s.value === (sort as SortValue)) ?? SORT_OPTIONS[0];

	const result = await commerce.productBrowse({
		query: trimmed,
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		...(category ? { category } : {}),
	});

	if (result.data.length === 0) {
		return (
			<div className="neo-border bg-[var(--color-surface-container-lowest)] py-20 text-center">
				<Search className="mx-auto h-10 w-10 text-[var(--color-on-surface-variant)]" />
				<p className="mt-4 font-serif text-2xl">No results</p>
				<p className="mt-2 text-[var(--color-on-surface-variant)]">
					Nothing matched “{trimmed}”. Try a different term.
				</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			<ProductsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				basePath="/search"
				extraParams={{ q: trimmed, category }}
				sort={sort}
			/>
		</>
	);
}

async function SearchCount({ q, category }: { q?: string; category?: string }) {
	const trimmed = q?.trim();
	if (!trimmed) return <SearchHeader q={undefined} />;
	const r = await commerce.productBrowse({
		query: trimmed,
		active: true,
		limit: 1,
		...(category ? { category } : {}),
	});
	return <SearchHeader q={trimmed} count={r.meta.count} />;
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string; sort?: string; category?: string }>;
}) {
	const { q, page, sort, category } = await searchParams;

	return (
		<>
			<Suspense fallback={<SearchHeader q={q} />}>
				<SearchCount q={q} category={category} />
			</Suspense>
			<section className="px-5 md:px-20 py-12 md:py-16 border-b border-foreground">
				<div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-8">
					<FilterSidebar
						basePath="/search"
						currentSort={sort}
						currentCategory={category}
						keepParams={{ q }}
					/>
					<div className="flex-1 min-w-0">
						<Suspense fallback={<div className="h-96" />}>
							<SearchResults q={q} page={page} sort={sort} category={category} />
						</Suspense>
					</div>
				</div>
			</section>
		</>
	);
}
