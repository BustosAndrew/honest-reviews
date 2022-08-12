import { Nav } from "./components/Nav";
import { ColorModeContext } from "./components/ToggleDarkMode";
import { AuthProvider } from "./components/AuthProvider";
import { FirebaseProvider } from "./components/FirebaseProvider";
import { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const App = () => {
	const [mode, setMode] = useState("light");

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) =>
					prevMode === "light" ? "dark" : "light"
				);
			},
		}),
		[]
	);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<div>
			<FirebaseProvider>
				<AuthProvider>
					<ColorModeContext.Provider value={colorMode}>
						<ThemeProvider theme={theme}>
							<Nav />
						</ThemeProvider>
					</ColorModeContext.Provider>
				</AuthProvider>
			</FirebaseProvider>
		</div>
	);
};
