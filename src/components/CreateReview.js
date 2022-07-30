import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState } from "react";

export const CreateReview = ({ createReview, db, ip }) => {
	//const db = getFirestore(app);
	const [username, setUsername] = useState("");
	const [link, setLink] = useState("https://");
	const [caption, setCaption] = useState("");
	const [checked, setChecked] = useState(false);

	const submitReview = async () => {
		let userBanned = false;
		const querySnapshot = await getDocs(collection(db, "ips"));
		querySnapshot.forEach((doc) => {
			if (doc.data().banned) userBanned = true;
		});

		if (userBanned) {
			alert("You are banned from making new reviews.");
			return;
		}

		// Add a new document in collection "reviews"
		await addDoc(collection(db, "reviews"), {
			username: username,
			link: link,
			caption: caption,
			created: new Date().getTime(),
			upvotes: 1,
		});
	};

	const addNewIP = async () => {
		let ipExists = false;
		const querySnapshot = await getDocs(collection(db, "ips"));
		querySnapshot.forEach((doc) => {
			if (doc.data().ipv4 === ip) ipExists = true;
		});

		if (ipExists) return;

		await addDoc(collection(db, "ips"), {
			username: username,
			ipv4: ip,
			banned: false,
		});
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (!link || !caption || !username || !checked) return;
		addNewIP();
		submitReview()
			.then(() => {
				createReview(); // go back to list of reviews
			})
			.catch((error) => console.log(error));
	};

	return (
		<Box
			component="form"
			sx={{
				"& .MuiTextField-root": {
					m: ".75rem auto",
					width: "100%",
				},
			}}
			noValidate
			autoComplete="off"
			onSubmit={(e) => submitHandler(e)}
		>
			<div>
				<TextField
					error={!username}
					// id="outlined-error-helper-text"
					label="Enter your username"
					helperText=""
					required
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
				<TextField
					error={!link}
					// id="outlined-error-helper-text"
					label="Enter the link of the product/service at issue"
					helperText=""
					required
					value={link}
					onChange={(event) => setLink(event.target.value)}
				/>
				<TextField
					error={!caption}
					//id="outlined-multiline-flexible"
					label="Write your review here"
					multiline
					rows={8}
					required
					value={caption}
					onChange={(event) => setCaption(event.target.value)}
				/>
				<span>
					By submitting, you agree that this is an honest review?
					<Checkbox
						checked={checked}
						onChange={() => setChecked(!checked)}
					/>
				</span>
				<br />
				<Button type="submit" variant="contained">
					<Typography variant="button">SUBMIT</Typography>
				</Button>
			</div>
		</Box>
	);
};
