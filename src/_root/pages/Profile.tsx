import GridPostList from "@/components/shared/GridPostList";
import StatBlock from "@/components/shared/StatBlock";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserByIdQuery } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import {
	Link,
	Outlet,
	Route,
	Routes,
	useLocation,
	useParams,
} from "react-router-dom";
import LikedPosts from "./LikedPosts";

const Profile = () => {
	const { id } = useParams();
	const { user } = useUserContext();
	const { data: currentUser } = useGetUserByIdQuery(id || "");
	const { pathname } = useLocation();

	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);

	return (
		<div className="profile-container">
			<div className="profile-inner_container">
				<div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
					<img
						src={
							currentUser.imageUrl ||
							"/assets/icons/profile-placeholder.svg"
						}
						alt="profile"
						className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
					/>
					<div className="flex flex-col flex-1 justify-between md:mt-2">
						<div className="flex flex-col w-full">
							<h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
								{currentUser.name}
							</h1>
							<p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
								@{currentUser.username}
							</p>
						</div>

						<div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
							<StatBlock
								value={currentUser.posts.length}
								label="Posts"
							/>
						</div>

						<p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
							{currentUser.bio}
						</p>
					</div>

					<div className="flex justify-center gap-4">
						{/* Update user profile | Only visible to the user himself */}
						<div
							className={`${
								user.id !== currentUser.$id && "hidden"
							}`}>
							<Link
								to={`/update-profile/${currentUser.$id}`}
								className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
									user.id !== currentUser.$id && "hidden"
								}`}>
								<img
									src={"/assets/icons/edit.svg"}
									alt="edit"
									width={20}
									height={20}
								/>
								<p className="flex whitespace-nowrap small-medium">
									Edit Profile
								</p>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Posts created by a user | Visible to all */}
			<div className="flex max-w-5xl w-full">
				<Link
					to={`/profile/${id}`}
					className={`profile-tab rounded-l-lg ${
						pathname === `/profile/${id}` && "!bg-dark-3"
					}`}>
					<img
						src={"/assets/icons/posts.svg"}
						alt="posts"
						width={20}
						height={20}
					/>
					Posts
				</Link>

				{/* Liked posts by a user | Visible only to the user */}
				{currentUser.$id === user.id && (
					<Link
						to={`/profile/${id}/liked-posts`}
						className={`profile-tab rounded-r-lg ${
							pathname === `/profile/${id}/liked-posts` &&
							"!bg-dark-3"
						}`}>
						<img
							src={"/assets/icons/like.svg"}
							alt="like"
							width={20}
							height={20}
						/>
						Liked Posts
					</Link>
				)}
			</div>

			{/* We have 2 sub routes in the profile page itself | using these routes directly in the app.js gives error */}
			<Routes>
				<Route
					index
					element={
						<GridPostList
							posts={currentUser.posts}
							showUser={false}
						/>
					}
				/>
				{currentUser.$id === user.id && (
					<Route path="/liked-posts" element={<LikedPosts />} />
				)}
			</Routes>
			<Outlet />
		</div>
	);
};

export default Profile;
