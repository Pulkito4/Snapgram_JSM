import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
	useGetPostsQuery,
	useSearchPostsQuery,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
	const { ref, inView } = useInView();
	const { data: posts, fetchNextPage, hasNextPage } = useGetPostsQuery();
	const [searchValue, setSearchValue] = useState("");

	const debouncedSearchValue = useDebounce(searchValue, 500); //500 miliseconds debounce time

	const { data: searchedPosts, isFetching: isSearchFetching } =
		useSearchPostsQuery(debouncedSearchValue);
	// now if we were to search each time the searchValue changes, it would send a lot of requests to the server/api
	// this will degrade the performance of the app and also the server
	// so to avoid this we use the concept of debouncing
	// debouncing is a technique used to limit the rate at which a function is called so that it is called only after the user has stopped typing for a certain amount of time
	// debounce query is directly available in react-query

	useEffect(() => {
		if (inView && !searchValue) fetchNextPage();
	}, [inView, searchValue]);

	if (!posts) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	}

	const shouldShowSearchResults = searchValue !== "";
	const shouldShowPosts =
		!shouldShowSearchResults &&
		posts.pages.every((item) => item.documents.length === 0);

	return (
		<div className="explore-container">
			<div className="explore-inner_container">
				<h2 className="h3-bold md:h2-bold w-full">Search Posts </h2>

				<div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
					<img
						src="/assets/icons/search.svg"
						alt="search"
						width={24}
						height={24}
					/>
					<Input
						type="text"
						placeholder="Search"
						className="explore-search"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex-between w-full max-w-5xl mt-16 pb-7">
				<h3 className="body-bold md:h3-bold">Popular Today</h3>
				<div className="flex-center gap-3 bg-dark-3 rounded-xl py-2 px-4 cursor-pointer">
					<p className="small-medium md:base-medium">All</p>
					<img
						src="/assets/icons/filter.svg"
						alt="filter"
						height={20}
						width={20}
					/>
				</div>
			</div>
			<div className="flex flex-wrap gap-9 w-full max-w-5xl">
				{shouldShowSearchResults ? (
					<SearchResults
						isSearchFetching={isSearchFetching}
						searchedPosts={searchedPosts}
					/>
				) : shouldShowPosts ? (
					<p className=" text-light-4 mt-10 w-full text-center">
						End of Posts
					</p>
				) : (
					posts.pages.map((item, index) => (
						<GridPostList
							key={`page-${index}`}
							posts={item.documents}
						/>
					))
				)}
			</div>

			{hasNextPage && !searchValue && (
				<div ref={ref} className="mt-10">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default Explore;
