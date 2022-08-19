import {
	Button,
	Typography,
	IconButton,
	Stack,
	TextField,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const Signout = ({ signoutHandler }) => {
	const [editing, setEditing] = useState(false);
	const { profile } = useContext(AuthContext);

	return (
		<>
			<AccountCircle fontSize="large" />
			<Stack
				direction="row"
				spacing={1}
				width={1}
				justifyContent="center"
			>
				{(!editing && (
					<>
						<Typography variant="h5">
							{profile.displayName}
						</Typography>
						<IconButton
							size="small"
							onClick={() => setEditing(true)}
						>
							<EditIcon fontSize="small" />
						</IconButton>
					</>
				)) || (
					<>
						<TextField fullWidth label="New Username" />
						<IconButton
							sx={{ height: "max-content" }}
							size="medium"
							onClick={() => setEditing(false)}
						>
							<CloseIcon fontSize="medium" />
						</IconButton>
						<Button
							size="medium"
							sx={{ width: 0.2 }}
							onClick={() => setEditing(false)}
						>
							Update
						</Button>
					</>
				)}
			</Stack>
			<Typography variant="h5">Your Reviews</Typography>
			<Button
				onClick={() => {
					signoutHandler();
				}}
				variant="contained"
				sx={{ width: "8rem" }}
			>
				Sign out
			</Button>
		</>
	);
};
