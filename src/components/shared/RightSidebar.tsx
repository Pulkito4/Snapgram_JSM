import { useGetTopCreatorsQuery } from "@/lib/react-query/queriesAndMutations";
import UserCard from "./UserCard";
import Loader from "./Loader";

const RightSidebar = () => {
	const { data: creators, isLoading: isUserLoading } =
		useGetTopCreatorsQuery();
	return (
		<div className="home-creators">
			<h3 className="h3-bold text-light-1">Top Creators</h3>
			{isUserLoading ? (
				<Loader />
			) : !creators ? (
				<p className="text-light-3">
					Cannot fetch top users right now!
				</p>
			) : (
				<ul className="grid grid-cols-2 gap-4">
					{creators?.documents.map((creator) => (
						<li key={creator.$id}>
							<UserCard user={creator} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default RightSidebar;
