import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="bg-[var(--color-primary-container)] border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-16 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
				<div className="max-w-xl">
					<span className="label-caps inline-block neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)] mb-6">
						New collection
					</span>
					<h1 className="font-serif text-5xl sm:text-6xl lg:text-[64px] leading-[1.05] tracking-tight text-[var(--color-on-primary-container)] font-bold mb-5">
						Curated joys
						<br />
						for your home
					</h1>
					<p className="font-sans text-lg leading-relaxed text-[var(--color-on-surface-variant)] mb-10">
						Discover a thoughtfully selected collection of premium goods — designed to bring warmth, beauty,
						and intention into every corner of your everyday life.
					</p>
					<div className="flex flex-wrap items-center gap-4">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="label-caps inline-flex items-center justify-center neo-border px-8 py-4 bg-foreground text-background hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors"
						>
							Shop the Collection
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#about"
							className="label-caps inline-flex items-center justify-center neo-border px-8 py-4 bg-transparent hover:bg-[var(--color-surface-container-lowest)] transition-colors"
						>
							Our Story
						</YnsLink>
					</div>
				</div>
				<div className="relative flex justify-center md:justify-end">
					<div className="relative w-full max-w-md aspect-[3/4] neo-border bg-[var(--color-surface-container-lowest)] hover:neo-shadow transition-shadow">
						<Image
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ixkQZRKMe3XZu-3vLHC_4HRptImUFMNuCijpwv0O_psIF1h0gE8zWdpN096hf-b0acOHwePiGXV51vQDYBRKI7_QAeCM1v0oQKob-_0N4LsfOe2w3asFllx867ebr534kIsvPpunbmT0v1yH5KqK7Hybck2lPLJk9xLZetusRrrQRtHon5g-K5yJ_NKKdbTZ8YgKBkw0eU4yqsyg8e74Ch-eFI_1baDC89QSnTEatgaTpsrco2mhpqgxzpt-8rQLPNW6xu4xFQob"
							alt="Curated joy in warm yellow and pastel colors"
							fill
							sizes="(max-width: 768px) 100vw, 480px"
							className="object-cover"
							priority
							unoptimized
						/>
						<div className="absolute -bottom-3 -left-3 bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] neo-border px-3 py-2 label-caps">
							Free shipping $40+
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
