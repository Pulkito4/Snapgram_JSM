import {
	useDeleteSavedPostQuery,
	useGetCurrentUserQuery,
	useLikePostQuery,
	useSavePostQuery,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
	post?: Models.Document;
	userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
	const likesList = post?.likes.map((user: Models.Document) => user.$id);

	const [likes, setLikes] = useState(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePostQuery();
	const { mutate: savePost, isPending: isSavingPost } = useSavePostQuery();
	const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } =
		useDeleteSavedPostQuery();

	const { data: currentUser } = useGetCurrentUserQuery();

	const savedPostRecord = currentUser?.save.find(
		(record: Models.Document) => record.post.$id === post?.$id
	);

	useEffect(() => {
		// Explanation of the double negation operator !!
		//{ saved : true } -> !savedPostRecord (=> false) -> !false = true;
		// { saved : false } -> !savedPostRecord (=> true) -> !true = false;
		// '' -> !'' (=>true) -> !true -> false

		// so basically !! can convert any value to a boolean value
		setIsSaved(!!savedPostRecord);
	}, [currentUser]);

	const handleLikePost = (e: React.MouseEvent) => {
		e.stopPropagation();
		let newLikes = [...likes];
		const hasLiked = newLikes.includes(userId);

		// remove the like if the user has already liked the post
		if (hasLiked) {
			newLikes = newLikes.filter((id) => id !== userId);
		} else {
			newLikes.push(userId);
		}

		setLikes(newLikes);
		likePost({ postId: post?.$id || "", likesArray: newLikes });
	};

	const handleSavePost = (e: React.MouseEvent) => {
		e.stopPropagation();

		// if the post is already saved then delete it from the saved posts
		if (savedPostRecord) {
			setIsSaved(false);
			deleteSavedPost(savedPostRecord.$id);
		} else {
			savePost({ postId: post?.$id || "", userId });
			setIsSaved(true);
		}
	};

	return (
		<div className="flex justify-between items-center z-20">
			<div className=" flex gap-2 mr-5">
				<img
					src={
						checkIsLiked(likes, userId)
							? "/assets/icons/liked.svg"
							: "/assets/icons/like.svg"
					}
					alt="like"
					width={20}
					height={20}
					onClick={handleLikePost}
					className="cursor-pointer"
				/>
				<p className="small-medium lg:base-medium">{likes.length}</p>
			</div>

			<div className=" flex gap-2">
				{isSavingPost || isDeletingSavedPost ? (
					<Loader />
				) : (
					<img
						src={
							isSaved
								? "/assets/icons/saved.svg"
								: "/assets/icons/save.svg"
						}
						alt="like"
						width={20}
						height={20}
						onClick={handleSavePost}
						className="cursor-pointer"
					/>
				)}
			</div>
		</div>
	);
};

export default PostStats;
