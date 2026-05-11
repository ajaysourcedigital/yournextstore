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
					<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the store…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-56 rounded-full border border-border bg-card/80 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</>
	);
}
