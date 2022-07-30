import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, CardActionArea, useTheme } from "@mui/material";
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
	theme,
}) => {
	//const theme = useTheme();
	return (
		<div style={{ display: "flex" }}>
			<CardActions sx={{ alignSelf: "flex-start" }}>
				<Stack textAlign="center">
					<IconButton
						onClick={() => {
							upvoteHandler("up", id, upvotes);
						}}
					>
						<ArrowCircleUpIcon></ArrowCircleUpIcon>
					</IconButton>
					<Typography fontWeight="bold">{upvotes}</Typography>
					<IconButton
						onClick={() => {
							upvoteHandler("down", id, upvotes);
						}}
					>
						<ArrowCircleDownIcon></ArrowCircleDownIcon>
					</IconButton>
				</Stack>
			</CardActions>
			<CardActionArea
				onClick={() =>
					reviewHandler(date, caption, username, link, upvotes, id)
				}
			>
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
					size="small"
					onClick={() => reviewHandler(date)}
					sx={{
						color:
							theme.palette.mode === "light"
								? "black"
								: "inherit",
					}}
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
					theme={theme}
				/>
			</Card>
		</Box>
	);
};
