import { useTheme, Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useContext, createContext } from "react";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ToggleDarkMode = () => {
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);
	return (
		<Box
			sx={{
				display: "flex",
				marginX: "auto",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "background.default",
				color: "text.primary",
				p: 1,
			}}
		>
			<IconButton
				size="large"
				onClick={colorMode.toggleColorMode}
				color="inherit"
			>
				{theme.palette.mode === "dark" ? (
					<Brightness7Icon fontSize="large" />
				) : (
					<Brightness4Icon fontSize="large" />
				)}
			</IconButton>
		</Box>
	);
};
