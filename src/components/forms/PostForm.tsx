import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
	useCreatePostMutation,
	useUpdatePostMutation,
} from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
	post?: Models.Document;
	action: "create" | "update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const { mutateAsync: createPost, isPending: isLoadingCreate } =
		useCreatePostMutation();
	const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
		useUpdatePostMutation();

	const { user } = useUserContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	// 1. Define your form.
	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post ? post?.caption : "",
			file: [],
			location: post ? post?.location : "",
			tags: post ? post?.tags.join(",") : "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof PostValidation>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		// update the post
		if (post && action === "update") {
			const updatedPost = await updatePost({
				...values,
				postId: post.$id,
				imageId: post?.imageId,
				imageUrl: post?.imageUrl,
			});

			if (!updatedPost) {
				toast({
					title: "Please try again",
				});
			}
			return navigate(`/posts/${post.$id}`);
		}

		// create a new post
		const newPost = await createPost({
			...values,
			userId: user.id,
		});

		if (!newPost) {
			toast({
				title: "Please try again",
			});
		}

		navigate("/");
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-9 w-full max-w-5xl">
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className=" shad-form_label">
								Caption
							</FormLabel>
							<FormControl>
								<Textarea
									className="shad-textarea custom-scrollbar"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className=" shad-form_label">
								Add Photos
							</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.imageUrl}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className=" shad-form_label">
								Add Location
							</FormLabel>
							<FormControl>
								<Input
									className="shad-input"
									type="text"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className=" shad-form_label">
								Add Tags (separated by commas " , " )
							</FormLabel>
							<FormControl>
								<Input
									className="shad-input"
									type="text"
									placeholder="Art, Expression, Learn, React, NextJS"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<div className="flex gap-4 items-center justify-end">
					<Button
						type="button"
						className="shad-button_dark_4 rounded">
						Cancel
					</Button>
					<Button
						type="submit"
						className="shad-button_primary whitespace-nowrap rounded"
						disabled={isLoadingCreate || isLoadingUpdate}>
						{isLoadingCreate || isLoadingUpdate && 'Loading...'}
						{action.toUpperCase()} POST
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
