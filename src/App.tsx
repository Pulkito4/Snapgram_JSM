import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Routes, Route } from "react-router-dom";
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

const App = () => {
	return (
		<main className="flex h-screen">
			<Routes>
				{/* Public Routes */}
				<Route element={<AuthLayout />}>
					<Route path="/sign-in" element={<SigninForm />} />
					<Route path="/sign-up" element={<SignupForm />} />
				</Route>

				{/* Private Routes */}
				{/* Accessible only after authentication */}
				<Route element={<RootLayout />}>
					{/* following are the child routes/ nested routes */}
					{/* Following routes will be rendered inside the <Outlet/> in Rootlayout component  */}
					<Route index element={<Home />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/saved" element={<Saved />} />
					<Route path="/all-users" element={<AllUsers />} />
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/update-post/:id" element={<EditPost />} />
					<Route path="/posts/:id" element={<PostDetails />} />
					<Route path="/profile/:id/*" element={<Profile />} />
					<Route path="/update-profile/:id" element={<UpdateProfile />} />
					
				</Route>
			</Routes>
			<Toaster />
		</main>
	);
};

export default App;
