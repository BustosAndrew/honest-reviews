import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Stack, useTheme } from "@mui/material";
import { IconButton, Link } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

import { useState } from "react";

const CardInfo = ({
	date,
	username,
	caption,
	link,
	upvotes,
	upvoteHandler,
	id,
}) => {
	const [currUpvotes, setCurrUpvotes] = useState(upvotes);
	return (
		<div style={{ display: "flex" }}>
			<CardActions
				sx={{
					alignSelf: "flex-start",
				}}
			>
				<Stack textAlign="center">
					<IconButton
						onClick={() => {
							upvoteHandler("up", id, currUpvotes);
							setCurrUpvotes(currUpvotes + 1);
						}}
					>
						<ArrowCircleUpIcon></ArrowCircleUpIcon>
					</IconButton>
					<Typography fontWeight="bold">{currUpvotes}</Typography>
					<IconButton
						onClick={() => {
							upvoteHandler("down", id, currUpvotes);
							setCurrUpvotes(currUpvotes - 1);
						}}
					>
						<ArrowCircleDownIcon></ArrowCircleDownIcon>
					</IconButton>
				</Stack>
			</CardActions>
			<Stack>
				<CardContent sx={{}}>
					<Typography
						sx={{ fontSize: 14 }}
						color="text.secondary"
						gutterBottom
					>
						Time submitted: {date} ms
					</Typography>
					<Typography variant="h5" component="div">
						{username}
					</Typography>
					<Link href={link} sx={{ mb: 1.5 }}>
						{link}
					</Link>
					<Typography variant="body2">{caption}</Typography>
				</CardContent>
			</Stack>
		</div>
	);
};

export const Review = ({
	date,
	caption,
	link,
	username,
	upvotes,
	id,
	upvoteHandler,
}) => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				width: "100%",
				textAlign: "left",
				bgcolor: "background.default",
			}}
		>
			<Card
				sx={{
					bgcolor:
						theme.palette.mode === "light" ? "#f5f5f5" : "inherit",
					height: "100%",
					overflowWrap: "break-word",
				}}
			>
				<CardInfo
					date={date}
					caption={caption}
					username={username}
					link={link}
					upvotes={upvotes}
					upvoteHandler={upvoteHandler}
					id={id}
				/>
			</Card>
		</Box>
	);
};
