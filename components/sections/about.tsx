import { Moon, Sparkles, Sun } from "lucide-react";

const moments = [
	{
		Icon: Sun,
		title: "Morning Rituals",
		body: "Start your day with intention. Awakening blends and bright objects to focus the mind.",
		bg: "bg-[var(--color-primary-container)]",
		fg: "text-[var(--color-on-primary-container)]",
	},
	{
		Icon: Sparkles,
		title: "Daily Balance",
		body: "Find equilibrium in the chaos. Subtle aromatics and tactile pieces to ground your space.",
		bg: "bg-[var(--color-secondary-container)]",
		fg: "text-[var(--color-on-secondary-container)]",
	},
	{
		Icon: Moon,
		title: "Evening Calm",
		body: "Wind down gracefully. Deep, soothing notes to prepare your home for restful sleep.",
		bg: "bg-[var(--color-tertiary-container)]",
		fg: "text-[var(--color-on-tertiary-container)]",
	},
];

export function About() {
	return (
		<section
			id="about"
			className="bg-[var(--color-surface-container)] border-b border-foreground py-20 md:py-28 px-5 md:px-20"
		>
			<div className="max-w-[1280px] mx-auto">
				<div className="text-center mb-14">
					<span className="label-caps text-[var(--color-on-surface-variant)]">Our promise</span>
					<h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-3 leading-tight">
						Curated for your moments
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{moments.map(({ Icon, title, body, bg, fg }) => (
						<div
							key={title}
							className="flex flex-col items-center text-center bg-[var(--color-surface-container-lowest)] neo-border p-8 hover:neo-shadow transition-shadow"
						>
							<div className={`w-16 h-16 neo-border ${bg} ${fg} flex items-center justify-center mb-6`}>
								<Icon className="w-7 h-7" strokeWidth={1.5} />
							</div>
							<h3 className="font-serif text-2xl mb-3">{title}</h3>
							<p className="text-base leading-relaxed text-[var(--color-on-surface-variant)]">{body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
