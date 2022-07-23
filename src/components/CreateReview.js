import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

export const CreateReview = ({ createReview }) => {
	const submitHandler = (event) => {
		event.preventDefault();
		createReview(); // go back to list of reviews
		console.log("submitted");
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
					error={true}
					// id="outlined-error-helper-text"
					label="Enter your username"
					defaultValue="Joey Salads"
					helperText=""
					required
				/>
				<TextField
					error={true}
					// id="outlined-error-helper-text"
					label="Enter the link of the product/service at issue"
					defaultValue="https://"
					helperText=""
					required
				/>
				<TextField
					error={true}
					//id="outlined-multiline-flexible"
					label="Write your review here"
					multiline
					rows={8}
					required
					//value={value}
					//onChange={handleChange}
				/>
				<span>
					By submitting, you agree that this is an honest review?
					<Checkbox />
				</span>
				<br />
				<Button type="submit" variant="contained">
					<Typography variant="button">SUBMIT</Typography>
				</Button>
			</div>
		</Box>
	);
};
