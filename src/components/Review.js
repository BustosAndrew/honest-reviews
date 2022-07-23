import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

// import { useState } from "react";

// const bull = (
// 	<Box
// 		component="span"
// 		sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
// 	>
// 		•
// 	</Box>
// );

const CardInfo = ({ date }) => {
	return (
		<div style={{ display: "flex" }}>
			<CardActions sx={{ alignSelf: "flex-start" }}>
				<Stack textAlign="center">
					<IconButton>
						<ArrowCircleUpIcon></ArrowCircleUpIcon>
					</IconButton>
					<Typography fontWeight="bold">{1}</Typography>
					<IconButton>
						<ArrowCircleDownIcon></ArrowCircleDownIcon>
					</IconButton>
				</Stack>
			</CardActions>
			<Stack>
				<CardContent>
					<Typography
						sx={{ fontSize: 14 }}
						color="text.secondary"
						gutterBottom
					>
						Time submitted: {date} ms
					</Typography>
					<Typography variant="h5" component="div">
						belent
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						adjective
					</Typography>
					<Typography variant="body2">
						well meaning and kindly.
						<br />
						{'"a benevolent smile"'}
					</Typography>
				</CardContent>
			</Stack>
		</div>
	);
};

export const Review = ({ date }) => {
	return (
		<Box sx={{ width: "100%", textAlign: "left" }}>
			<Card
				sx={{
					background: "#f5f5f5",
				}}
			>
				<CardInfo date={date} />
			</Card>
		</Box>
	);
};
