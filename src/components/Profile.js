import { Stack } from "@mui/material";

import { useState, useContext, useEffect } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Signout } from "./Signout";
import { AuthContext } from "./AuthProvider";

export const Profile = () => {
	const [loggingIn, setLoggingIn] = useState(true);
	const [signedIn, setSignedIn] = useState(false);
	const { profile, logout } = useContext(AuthContext);

	const pageHandler = () => {
		setLoggingIn(!loggingIn);
	};

	const signoutHandler = () => {
		logout();
	};

	const signedInHandler = () => {
		setSignedIn(!signedIn);
	};

	useEffect(() => {
		if (profile) setSignedIn(true);
	}, [profile]);

	return (
		<Stack alignItems="center" spacing={2} marginX="auto">
			{(profile && signedIn && (
				<Signout signoutHandler={signoutHandler} />
			)) ||
				(!profile && loggingIn && (
					<Login
						pageHandler={pageHandler}
						signedInHandler={signedInHandler}
					/>
				)) ||
				(!profile && !loggingIn && (
					<Signup pageHandler={pageHandler} />
				))}
		</Stack>
	);
};
