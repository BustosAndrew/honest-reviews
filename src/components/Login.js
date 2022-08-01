import { TextField, Typography, Stack, Button } from "@mui/material";

import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Login = ({ pageHandler, app, userHandler }) => {
	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");

	const submitHandler = () => {
		const auth = getAuth(app);
		signInWithEmailAndPassword(auth, email, pw)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log(user);
				userHandler(user);
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
	};

	return (
		<>
			<Typography color="primary" variant="h5" fontWeight="bold">
				Login
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
