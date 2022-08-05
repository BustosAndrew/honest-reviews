import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
//import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, CardActionArea, useTheme } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import { useState } from "react";

const CardInfo = ({
	date,
	reviewHandler,
	reviewer,
	title,
	caption,
	link,
	upvotes,
	upvoteHandler,
	id,
}) => {
	const [upvoted, setUpvoted] = useState(false);
	const [downvoted, setDownvoted] = useState(false);

	return (
		<Box display="flex">
			<CardActions sx={{ alignSelf: "flex-start" }}>
				<Stack textAlign="center">
					<IconButton
						onClick={() => {
							if (downvoted) {
								setDownvoted(false);
								setUpvoted(true);
								upvoteHandler("revert-down", id, upvotes + 1);
							} else if (upvoted === false) {
								setUpvoted(true);
								upvoteHandler("up", id, upvotes);
							} else {
								setUpvoted(false);
								upvoteHandler("revert-up", id, upvotes);
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
					<Typography fontWeight="bold">{upvotes}</Typography>
					<IconButton
						onClick={() => {
							if (upvoted) {
								setUpvoted(false);
								setDownvoted(true);
								upvoteHandler("revert-up", id, upvotes - 1);
							} else if (downvoted === false) {
								setDownvoted(true);
								upvoteHandler("down", id, upvotes);
							} else {
								setDownvoted(false);
								upvoteHandler("revert-down", id, upvotes);
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
			<CardActionArea
				onClick={() =>
					reviewHandler(
						date,
						reviewer,
						caption,
						title,
						link,
						upvotes,
						id
					)
				}
			>
				<Stack>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							{date.toDate().toString()}
						</Typography>
						<Typography variant="body1">
							Reviewed by: {reviewer}
						</Typography>
						<Typography variant="h5" component="div">
							{title}
						</Typography>
						<Typography sx={{ mb: 1.5 }} color="text.secondary">
							{link}
						</Typography>
						<Typography variant="body2">{caption}</Typography>
					</CardContent>
				</Stack>
			</CardActionArea>
		</Box>
	);
};

export const ReviewItem = ({
	date,
	reviewHandler,
	reviewer,
	link,
	title,
	caption,
	upvotes,
	upvoteHandler,
	id,
}) => {
	const [raised, setRaised] = useState(false);
	const theme = useTheme();
	return (
		<Box
			sx={{
				width: "100%",
				textAlign: "left",
				bgcolor: "background.default",
				color: "text.primary",
			}}
		>
			<Card
				sx={{
					bgcolor:
						theme.palette.mode === "light" ? "#f5f5f5" : "inherit",
					maxHeight: "10rem",
					overflowWrap: "break-word",
				}}
				raised={raised}
				onMouseOver={() => setRaised(true)}
				onMouseOut={() => setRaised(false)}
			>
				<CardInfo
					date={date}
					reviewHandler={reviewHandler}
					reviewer={reviewer}
					caption={caption}
					title={title}
					link={link}
					upvotes={upvotes}
					upvoteHandler={upvoteHandler}
					id={id}
				/>
			</Card>
		</Box>
	);
};
