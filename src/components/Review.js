import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Stack, useTheme } from "@mui/material";
import { IconButton, Link } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import { useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";

const CardInfo = ({
	date,
	title,
	caption,
	link,
	upvotes,
	upvoteHandler,
	id,
	isUpvoted,
	isDownvoted,
}) => {
	const [currUpvotes, setCurrUpvotes] = useState(upvotes);
	const [upvoted, setUpvoted] = useState(false);
	const [downvoted, setDownvoted] = useState(false);
	const { profile } = useContext(AuthContext);

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
							if (downvoted) {
								setDownvoted(false);
								setUpvoted(true);
								upvoteHandler("revert-down", id, upvotes + 1);
								setCurrUpvotes(currUpvotes + 2);
							} else if (upvoted === false) {
								setUpvoted(true);
								upvoteHandler("up", id, upvotes);
								setCurrUpvotes(currUpvotes + 1);
							} else {
								setUpvoted(false);
								upvoteHandler("revert-up", id, upvotes);
								setCurrUpvotes(currUpvotes - 1);
							}
						}}
					>
						{!upvoted ? (
							<ArrowCircleUpIcon />
						) : (
							<ArrowCircleRightIcon
								sx={{ transform: "rotate(-.25turn)" }}
							/>
						)}
					</IconButton>
					<Typography fontWeight="bold">{currUpvotes}</Typography>
					<IconButton
						onClick={() => {
							if (upvoted) {
								setUpvoted(false);
								setDownvoted(true);
								upvoteHandler("revert-up", id, upvotes - 1);
								setCurrUpvotes(currUpvotes - 2);
							} else if (downvoted === false) {
								setDownvoted(true);
								upvoteHandler("down", id, upvotes);
								setCurrUpvotes(currUpvotes - 1);
							} else {
								setDownvoted(false);
								upvoteHandler("revert-down", id, upvotes);
								setCurrUpvotes(currUpvotes + 1);
							}
						}}
					>
						{!downvoted ? (
							<ArrowCircleDownIcon />
						) : (
							<ArrowCircleRightIcon
								sx={{ transform: "rotate(.25turn)" }}
							/>
						)}
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
						{date.toDate().toString()}
					</Typography>
					<Typography variant="body1">
						Reviewed by: {profile.displayName}
					</Typography>
					<Typography variant="h5" component="div">
						{title}
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
	title,
	upvotes,
	id,
	upvoteHandler,
	isUpvoted,
	isDownvoted,
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
					title={title}
					link={link}
					upvotes={upvotes}
					upvoteHandler={upvoteHandler}
					id={id}
					isUpvoted={isUpvoted}
					isDownvoted={isDownvoted}
				/>
			</Card>
		</Box>
	);
};
