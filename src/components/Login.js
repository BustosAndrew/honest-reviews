import { TextField, Typography, Stack, Button } from "@mui/material";

import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Login = ({ pageHandler }) => {
	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");

	const submitHandler = () => {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, pw)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
	};

	return (
		<Stack spacing={4}>
			<Typography color="primary" variant="h5" fontWeight="bold">
				Login
			</Typography>
			<TextField
				// id="outlined-error-helper-text"
				label="Email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
			/>
			<TextField
				// id="outlined-error-helper-text"
				label="Password"
				value={pw}
				onChange={(event) => setPw(event.target.value)}
			/>
			<Stack direction="row" justifyContent="space-between">
				<Button variant="contained" sx={{ width: 0.4 }}>
					Login
				</Button>
				<Typography m={1}>OR</Typography>
				<Button
					variant="outlined"
					onClick={pageHandler}
					sx={{ width: 0.4 }}
				>
					Sign Up
				</Button>
			</Stack>
		</Stack>
	);
};
