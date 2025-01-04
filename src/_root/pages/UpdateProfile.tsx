import Loader from "@/components/shared/Loader";
import { z } from "zod";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
	useGetUserByIdQuery,
	useUpdateUserProfileMutation,
} from "@/lib/react-query/queriesAndMutations";
import { ProfileValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ProfileUploader from "@/components/shared/ProfileUploader";

const UpdateProfile = () => {
	const { id } = useParams();
	const { user, setUser } = useUserContext();
	const navigate = useNavigate();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof ProfileValidation>>({
		resolver: zodResolver(ProfileValidation),
		defaultValues: {
			file: [],
			name: user.name,
			username: user.username,
			email: user.email,
			bio: user.bio || "",
		},
	});

	const { data: currentUser } = useGetUserByIdQuery(id || "");
	const { mutateAsync: updateUserProfile, isPending: isLoadingUpdate } =
		useUpdateUserProfileMutation();

	if (!currentUser) {
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	}

	const handleUpdateProfile = async (
		value: z.infer<typeof ProfileValidation>
	) => {
		try {
			const updatedUser = await updateUserProfile({
				userId: currentUser.$id,
				name: value.name,
				bio: value.bio,
				file: value.file,
				imageUrl: currentUser.imageUrl,
				imageId: currentUser.imageId,
			});

			if (!updatedUser) {
				toast({
					title: `Update user failed. Please try again.`,
				});
			}

			setUser({
				...user,
				name: updatedUser?.name,
				bio: updatedUser?.bio,
				imageUrl: updatedUser?.imageUrl,
			});
			return navigate(`/profile/${id}`);
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while updating your profile",
			});
		}
	};

	return (
		<div className="flex flex-1">
			<div className="common-container">
				<div className="flex-start gap-3 justify-start w-full max-w-5xl">
					<img
						src="/assets/icons/edit.svg"
						width={36}
						height={36}
						alt="edit"
						className="invert-white"
					/>
					<h2 className="h3-bold md:h2-bold text-left w-full">
						Edit Profile
					</h2>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleUpdateProfile)}
						className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem className="flex">
									<FormControl>
										<ProfileUploader
											fieldChange={field.onChange}
											mediaUrl={currentUser.imageUrl}
										/>
									</FormControl>
									<FormMessage className="shad-form_message" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">
										Name
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">
										Username
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field}
											disabled
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">
										Email
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											{...field}
											disabled
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="shad-form_label">
										Bio
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

						<div className="flex gap-4 items-center justify-end">
							<Button
								type="button"
								className="shad-button_dark_4"
								onClick={() => navigate(-1)}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="shad-button_primary whitespace-nowrap"
								disabled={isLoadingUpdate}>
								{isLoadingUpdate && <Loader />}
								Update Profile
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default UpdateProfile;
