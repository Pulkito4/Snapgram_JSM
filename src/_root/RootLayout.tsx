import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	return (
		<div className="w-full md:flex">
			<Topbar />
			<LeftSideBar />

			<section className=" flex flex-1 h-full">
				{/* child routes render here */}
				<Outlet />
			</section>
			<BottomBar />
		</div>
	);
};

export default RootLayout;
