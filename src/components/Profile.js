import { Stack } from "@mui/material";

import { useState } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";

import { getAuth, signOut } from "firebase/auth";
import { Signout } from "./Signout";

export const Profile = ({ app }) => {
	const [loggingIn, setLoggingIn] = useState(true);
	const [user, setUser] = useState(null);

	//const submitHandler = () => {};

	const userHandler = (newUser) => {
		setUser(newUser);
	};

	const pageHandler = () => {
		setLoggingIn(!loggingIn);
	};

	const signoutHandler = () => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				console.log("signed out");
				setUser(null);
				setLoggingIn(true);
			})
			.catch((error) => {
				// An error happened.
			});
	};

	return (
		<Stack alignItems="center" spacing={2} width={0.7} marginX="auto">
			{user && <Signout signoutHandler={signoutHandler} />}
			{!user && loggingIn && (
				<Login
					pageHandler={pageHandler}
					app={app}
					userHandler={userHandler}
				/>
			)}
			{!user && !loggingIn && (
				<Signup
					pageHandler={pageHandler}
					app={app}
					userHandler={userHandler}
				/>
			)}
		</Stack>
	);
};
