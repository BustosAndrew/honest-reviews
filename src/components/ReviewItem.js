import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, CardActionArea } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

import { useState } from "react";

const CardInfo = ({
	date,
	reviewHandler,
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
			<CardActions sx={{ alignSelf: "flex-start" }}>
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
			<CardActionArea onClick={() => reviewHandler(date)}>
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
							{username}
						</Typography>
						<Typography sx={{ mb: 1.5 }} color="text.secondary">
							{link}
						</Typography>
						<Typography variant="body2">{caption}</Typography>
					</CardContent>
				</Stack>
			</CardActionArea>
			<CardActions sx={{}}>
				<Button
					sx={{ color: "black" }}
					size="small"
					onClick={() => reviewHandler(date)}
				>
					Read More
				</Button>
			</CardActions>
		</div>
	);
};

export const ReviewItem = ({
	date,
	reviewHandler,
	link,
	username,
	caption,
	upvotes,
	upvoteHandler,
	id,
}) => {
	const [raised, setRaised] = useState(false);
	return (
		<Box sx={{ width: "100%", textAlign: "left" }}>
			<Card
				sx={{
					background: "#f5f5f5",
				}}
				raised={raised}
				onMouseOver={() => setRaised(true)}
				onMouseOut={() => setRaised(false)}
			>
				<CardInfo
					date={date}
					reviewHandler={reviewHandler}
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
