import { Nav } from "./components/Nav";
//import { Provider } from "react-redux";
//import { store } from "./store/store";
import { AuthProvider } from "./components/AuthProvider";
import { FirebaseProvider } from "./components/FirebaseProvider";

export const App = () => {
	return (
		<div>
			<FirebaseProvider>
				<AuthProvider>
					<Nav />
				</AuthProvider>
			</FirebaseProvider>
		</div>
	);
};
