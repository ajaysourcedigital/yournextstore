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
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search panels, kits…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-56 rounded-full border border-white/15 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition-colors"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 text-white/85 hover:text-white hover:bg-white/10 rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</>
	);
}
