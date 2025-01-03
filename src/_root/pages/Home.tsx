import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPostsQuery } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
	// original query to get recent posts
	// const {
	// 	data: posts,
	// 	isPending: isPostLoading,
	// } = useGetRecentPostsQuery();

	// new query to get infinite posts/pagination
	const { ref, inView } = useInView();
	const {
		data: posts,
		isLoading: isPostLoading,
		hasNextPage,
		fetchNextPage,
	} = useGetRecentPostsQuery();

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage]);

	return (
		<div className="flex flex-1">
			<div className="home-container">
				<div className="home-posts">
					<h2 className="h3-bold md:h2-bold text-left w-full">
						Home Feed
					</h2>
					{isPostLoading && !posts ? (
						<Loader />
					) : (
						// original code to get recent posts
						// <ul className=" flex flex-col flex-1 gap-9 w-full">
						// 	{posts?.documents.map((post: Models.Document) => (
						// 		<PostCard key={post.$id}  post={post} />
						// 	))}
						// </ul>

						// new code to get infinite posts/pagination
						<ul className="flex flex-col flex-1 gap-9 w-full">
							{posts?.pages.map((page) =>
								page?.documents.map((post: Models.Document) => (
									<PostCard key={post.$id} post={post} />
								))
							)}
						</ul>
					)}
				</div>
				{/* Adding this to implement infinite scroll functionality on the home page too */}
				{hasNextPage && (
					<div ref={ref} className="mt-10">
						<Loader />
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
