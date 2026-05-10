"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<div className="relative">
					<Search
						className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--olive-deep)]/50"
						strokeWidth={1.5}
					/>
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the shop"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-56 rounded-full border border-[var(--olive-deep)]/15 bg-[var(--cream)]/50 pl-10 pr-4 text-sm text-[var(--olive-deep)] placeholder:text-[var(--olive-deep)]/40 focus:outline-none focus:border-[var(--olive-deep)]/40 focus:bg-[var(--cream)] transition-colors"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2.5 hover:bg-[var(--olive-deep)]/5 rounded-full transition-colors sm:hidden text-[var(--olive-deep)]"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.5} />
			</YnsLink>
		</>
	);
}
