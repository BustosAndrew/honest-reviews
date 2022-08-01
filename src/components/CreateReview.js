import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
	Button,
	Typography,
	Snackbar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormGroup,
	Switch,
	FormControlLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState, forwardRef } from "react";
import * as ls from "local-storage";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CreateReview = ({ createReview, db, ip }) => {
	const [username, setUsername] = useState("");
	const [link, setLink] = useState("https://");
	const [caption, setCaption] = useState("");
	const [checked, setChecked] = useState(false);
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState({
		missingInfo: false,
		checked: true,
		fail: false,
		message: "",
	});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [choice, setChoice] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") return;
		setOpen(false);
	};

	const handleCloseError = (event, reason) => {
		if (reason === "clickaway") return;
		setOpenError({ missingInfo: false, checked: true });
	};

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = (agreed) => {
		//console.log(agreed);
		setDialogOpen(false);

		if (!agreed) return;
		if (choice) ls("choice", true);
		addNewIP();
		submitReview()
			.then(() => {
				setOpen(true);
				setTimeout(() => createReview(), 500); // go back to list of reviews
			})
			.catch((error) => console.log(error));
	};

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
		if (!link || !caption || !username) {
			setOpenError((openError) => ({
				...openError,
				missingInfo: true,
			}));
			return;
		} else if (!checked) {
			setOpenError((openError) => ({
				...openError,
				checked: false,
			}));
			return;
		}

		if (!ls("choice")) {
			handleDialogOpen();
			return;
		} else {
			addNewIP();
			submitReview()
				.then(() => {
					setOpen(true);
					setTimeout(() => createReview(), 500); // go back to list of reviews
				})
				.catch((error) =>
					setOpenError((openError) => ({
						...openError,
						fail: true,
						message: error,
					}))
				);
		}
	};

	//useEffect(() => {}, []);

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
			onSubmit={(e) => {
				submitHandler(e);
			}}
		>
			<Box>
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
						sx={{ color: "red" }}
					/>
				</span>
				<br />
				<Button type="submit" variant="contained">
					<Typography variant="button">SUBMIT</Typography>
				</Button>
				<Dialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Before you submit a review"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Please be sure that you want to submit a review
							because after submission your public IP address will
							be logged into the database, if not already. This is
							to track who submits their reviews in case they
							become flagged.
						</DialogContentText>
					</DialogContent>
					<DialogActions
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<FormGroup>
							<FormControlLabel
								checked={choice}
								onChange={() => setChoice(!choice)}
								control={<Switch />}
								label="Remember my choice"
								labelPlacement="end"
							/>
						</FormGroup>
						<Box>
							<Button
								onClick={() => {
									handleDialogClose(false);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									handleDialogClose(true);
								}}
							>
								Submit
							</Button>
						</Box>
					</DialogActions>
				</Dialog>
				<Snackbar
					open={open}
					autoHideDuration={6000}
					onClose={handleClose}
				>
					<Alert
						onClose={handleClose}
						severity="success"
						sx={{ width: "100%" }}
					>
						You have successfully submitted a new review!
					</Alert>
				</Snackbar>
				<Snackbar
					open={
						openError.missingInfo ||
						!openError.checked ||
						openError.fail
					}
					autoHideDuration={6000}
					onClose={handleCloseError}
				>
					<Alert
						onClose={handleCloseError}
						severity="error"
						sx={{ width: "100%" }}
					>
						{(openError.missingInfo &&
							"You can't leave any field empty!") ||
							(!openError.checked &&
								"You must select the checkbox!") ||
							(openError.fail && "Error: " + openError.message)}
					</Alert>
				</Snackbar>
			</Box>
		</Box>
	);
};
