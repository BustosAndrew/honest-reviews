import { TextField, Typography, Button } from "@mui/material";

import { useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const Login = ({ pageHandler, signedInHandler }) => {
	const [username, setUsername] = useState("");
	const [pw, setPw] = useState("");
	const { login } = useContext(AuthContext);

	const submitHandler = async () => {
		let success = await login(username, pw);

		if (!success) console.log("login failed");
		else signedInHandler();
	};

	return (
		<>
			<Typography color="primary" variant="h5" fontWeight="bold">
				Login
			</Typography>
			<TextField
				// id="outlined-error-helper-text"
				label="Email"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				fullWidth={true}
				autoComplete="email"
			/>
			<TextField
				// id="outlined-error-helper-text"
				label="Password"
				value={pw}
				onChange={(event) => setPw(event.target.value)}
				fullWidth={true}
				autoComplete="current-password"
			/>
			<Button
				onClick={submitHandler}
				variant="contained"
				sx={{ width: "8rem" }}
			>
				Login
			</Button>
			<Typography>OR</Typography>
			<Button
				variant="outlined"
				onClick={pageHandler}
				sx={{ width: "8rem" }}
			>
				Sign Up
			</Button>
		</>
	);
};
