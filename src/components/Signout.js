import { Button } from "@mui/material";

export const Signout = ({ signoutHandler }) => {
	return (
		<Button
			onClick={() => {
				signoutHandler();
			}}
			variant="contained"
			sx={{ width: "8rem" }}
		>
			Sign out
		</Button>
	);
};
