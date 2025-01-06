import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.tsx";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<AuthProvider>
					<App />
					<Analytics />
				</AuthProvider>
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>
);
