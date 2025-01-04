import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUserQuery } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
	const { data: currentUser } = useGetCurrentUserQuery();

	if (!currentUser) return <Loader />;

	return (
		<>
			{currentUser.liked.length === 0 ? (
				<p className=" text-light-4"> No Liked Posts</p>
			) : (
				<GridPostList posts={currentUser.liked} showStats={false} />
			)}
		</>
	);
};

export default LikedPosts;
