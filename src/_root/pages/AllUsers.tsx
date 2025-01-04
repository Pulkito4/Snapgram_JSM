import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/hooks/use-toast";
import { useGetUsersQuery } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
	const { toast } = useToast();

	const {
		data: creators,
		isPending: usersLoading,
		isError: usersError,
	} = useGetUsersQuery();

	if (usersError) {
		return toast({ title: "Sometthing went wrong while fetching users" });
	}

	return (
		<div className="common-container">
			<div className="user-container">
				<h2 className="h3-bold md:h2-bold text-left w-full">
					All Users
				</h2>
				{usersLoading && !creators ? (
					<Loader />
				) : (
					<ul className="user-grid">
						{creators?.documents.map((creator) => (
							<li
								key={creator?.$id}
								className="flex-1 min-w-[200px] w-full">
								<UserCard user={creator} />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default AllUsers;
