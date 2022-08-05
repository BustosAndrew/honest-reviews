import { TextField, Typography, Button } from "@mui/material";
import { AuthContext } from "./AuthProvider";

import { useState, useContext } from "react";

export const Signup = ({ pageHandler }) => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [pw, setPw] = useState("");
	const { register } = useContext(AuthContext);

	const submitHandler = async () => {
		let success = await register(email, pw, username);

		if (!success) {
			console.log("Registration failed!");
		} else pageHandler();
	};

	return (
		<>
			<Typography color="primary" variant="h5" fontWeight="bold">
				Sign Up
			</Typography>
			<TextField
				// id="outlined-error-helper-text"
				label="Email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				fullWidth={true}
			/>
			<TextField
				// id="outlined-error-helper-text"
				label="Username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				fullWidth={true}
			/>
			<TextField
				// id="outlined-error-helper-text"
				label="Password"
				value={pw}
				onChange={(event) => setPw(event.target.value)}
				fullWidth={true}
			/>
			<Button
				onClick={submitHandler}
				variant="contained"
				sx={{ width: "8rem" }}
			>
				Sign Up
			</Button>
			<Typography>OR</Typography>
			<Button
				variant="outlined"
				onClick={pageHandler}
				sx={{ width: "8rem" }}
			>
				Login
			</Button>
		</>
	);
};
