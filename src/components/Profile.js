import { Box } from "@mui/material";

import { useState } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";

export const Profile = () => {
	const [loggingIn, setLoggingIn] = useState(true);

	const submitHandler = () => {};

	const pageHandler = () => {
		setLoggingIn(!loggingIn);
	};

	return (
		<Box
			component="form"
			noValidate
			autoComplete="off"
			onSubmit={(e) => {
				submitHandler(e);
			}}
		>
			{loggingIn ? (
				<Login pageHandler={pageHandler} />
			) : (
				<Signup pageHandler={pageHandler} />
			)}
		</Box>
	);
};
