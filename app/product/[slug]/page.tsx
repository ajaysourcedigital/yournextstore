import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const product = await commerce.productGet({ idOrSlug: slug });

	if (!product) {
		return { title: "Product Not Found — Your Next Store" };
	}

	return {
		title: `${product.name} — Your Next Store`,
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	return <ProductDetails params={props.params} />;
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const [product, reviews] = await Promise.all([
		commerce.productGet({ idOrSlug: slug }),
		commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }),
	]);

	if (!product) {
		notFound();
	}

	const { minPrice, maxPrice } = product.variants.reduce(
		(acc, v) => {
			const price = BigInt(v.price);
			return {
				minPrice: price < acc.minPrice ? price : acc.minPrice,
				maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
			};
		},
		{
			minPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
			maxPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
		},
	);

	const priceDisplay =
		product.variants.length > 1 && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} – ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
			: formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE });

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const stockBadge =
		product.variants.length === 1 && product.variants[0]
			? Number(product.variants[0].stock ?? 0) > 0
				? "In stock"
				: "Sold out"
			: null;

	return (
		<main>
			<JsonLdScript data={buildProductJsonLd(product, reviews)} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />

			{/* Breadcrumb / share strip */}
			<div className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] border-b border-foreground">
				<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-3 flex items-center justify-between gap-4">
					<nav aria-label="Breadcrumb" className="label-caps flex items-center gap-2 truncate">
						<YnsLink href="/" className="hover:underline">
							Home
						</YnsLink>
						<span aria-hidden>/</span>
						{product.category ? (
							<>
								<YnsLink href={`/products?category=${product.category.slug}`} className="hover:underline">
									{product.category.name}
								</YnsLink>
								<span aria-hidden>/</span>
							</>
						) : (
							<>
								<YnsLink href="/products" className="hover:underline">
									Products
								</YnsLink>
								<span aria-hidden>/</span>
							</>
						)}
						<span className="truncate max-w-[40ch] opacity-80">{product.name}</span>
					</nav>
					{stockBadge && (
						<span className="label-caps neo-border bg-[var(--color-surface-container-lowest)] text-foreground px-2 py-1">
							{stockBadge}
						</span>
					)}
				</div>
			</div>

			{/* Hero / details */}
			<section className="border-b border-foreground bg-background">
				<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

					<div className="flex flex-col gap-8 lg:pt-4">
						<div>
							{product.category && (
								<span className="label-caps text-[var(--color-on-surface-variant)]">
									{product.category.name}
								</span>
							)}
							<h1 className="font-serif text-4xl md:text-5xl lg:text-[56px] leading-[1.05] mt-3 text-foreground text-balance">
								{product.name}
							</h1>
							<div className="mt-5 inline-flex items-center gap-3 neo-border bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-4 py-2">
								<span className="font-serif text-2xl font-semibold tracking-tight">{priceDisplay}</span>
							</div>
							{product.summary && (
								<p className="mt-6 text-base md:text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
									{product.summary}
								</p>
							)}
						</div>

						<AddToCartButton
							variants={product.variants}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images,
							}}
							volumePricingTiers={product.volumePricingTiers}
						/>

						{product.content && (
							<div className="neo-border bg-[var(--color-surface-container-lowest)] p-6">
								<h2 className="label-caps mb-4">Details</h2>
								<div className="prose prose-sm max-w-none text-[var(--color-on-surface-variant)]">
									<TiptapRenderer content={product.content} />
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			<ProductFeatures />
			<ProductReviews reviews={reviews} slug={slug} />
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</main>
	);
};
