import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUserQuery } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {

  // See the explanation for this part of code from notes made on notion
	const { data: currentUser } = useGetCurrentUserQuery();
	const savedPosts = currentUser?.save.map((savedPost: Models.Document) => ({
		...savedPost.post,
		creator: {
			imageUrl: currentUser.imageUrl,
		},
	})).reverse();

	return (
		<div className="saved-container">
			<div className="flex gap-2 w-full max-w-5xl">
				<img
					src="/assets/icons/save.svg"
					alt=""
					width={36}
					height={36}
					className="invert-white"
				/>
				<h2 className="h3-bold md:h2-bold w-full">Saved Posts </h2>
			</div>

			{!currentUser ? (
				<Loader />
			) : (
				<ul className="w-full flex justify-center max-w-5xl gap-9">
					{savedPosts.length === 0 ? (
						<p className="text-light-4">No saved posts yet</p>
					) : (
						<GridPostList posts={savedPosts} showStats={false} />
					)}
				</ul>
			)}
		</div>
	);
};

export default Saved;
