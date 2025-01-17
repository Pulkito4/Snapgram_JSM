import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthContext";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
	useCreateUserAccountMutation,
	useSignInAccountMutation,
} from "@/lib/react-query/queriesAndMutations";

const SignupForm = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { checkAuthUser } = useUserContext();
	
	// renaming the mutation function to createUserAccount
	const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
		useCreateUserAccountMutation();
	const { mutateAsync: signInAccount } =
		useSignInAccountMutation();

	// 1. Define your form.
	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof SignupValidation>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		//create a new user
		const newUser = await createUserAccount(values);
		console.log(newUser);
		if (!newUser) {
			return toast({
				title: "Sign up failed! Please try again",
			});
		}

		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			return toast({
				title: "Sign in failed! Please try again",
			});
		}

		const isLoggedIn = await checkAuthUser();

		if (isLoggedIn) {
			form.reset();
			navigate("/");
		} else {
			return toast({
				title: "Sign up failed! Please try again",
			});
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img src="/assets/images/logo.svg" alt="logo" />
				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
					Create a new account
				</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					To use Snapgram, please enter your details
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col mt-4 gap-5 w-full">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
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
								<FormLabel>Username</FormLabel>
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{isCreatingUser ? (
							// flex-center is a custom css class in globals.css
							<div className=" flex-center gap-2">
								<Loader />
							</div>
						) : (
							"Sign up"
						)}
					</Button>

					<p className=" text-smal-regular text-light-2 text-center mt-2">
						Already have an account?
						<Link
							to="/sign-in"
							className="text-primary-500 text-small-semibold ml-1">
							Log in
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
