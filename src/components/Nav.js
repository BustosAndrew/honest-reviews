import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
//import CssBaseline from "@mui/material/CssBaseline";

import { useState, useEffect } from "react";
import { ReviewItem } from "./ReviewItem";
import { About } from "./About";
import { Pagination } from "@mui/material";
import { Contact } from "./Contact";
import { CreateReview } from "./CreateReview";

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
};

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export const Nav = () => {
	const [value, setValue] = useState(0);
	const [reviews, setReviews] = useState();
	const [reviewItems, setReviewItems] = useState();
	const [newReview, setNewReview] = useState(false);
	const [filter, setFilter] = useState("newest");
	const maxPerPage = 5;

	const handlerFilter = (event) => {
		setFilter(event.target.value);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (newValue !== 0) setNewReview(false);
	};

	const pageChange = (page) => {
		if (!reviews[page * maxPerPage - 1]) {
			console.log(
				reviews.slice(page * maxPerPage - maxPerPage, reviews.length)
			);
			setReviewItems(
				reviews.slice(page * maxPerPage - maxPerPage, reviews.length)
			);
		} else
			setReviewItems(
				reviews.slice(page * maxPerPage - maxPerPage, maxPerPage)
			);
	};

	const createReview = () => {
		setNewReview(!newReview);
		if (newReview === false) setReviewItems(reviews.slice(0, maxPerPage));
	};

	useEffect(() => {
		const newReviews = [
			{ date: new Date().getTime() + 1 },
			{ date: new Date().getTime() + 2 },
			{ date: new Date().getTime() + 3 },
			{ date: new Date().getTime() + 4 },
			{ date: new Date().getTime() + 5 },
			{ date: new Date().getTime() - 1 },
		];
		if (filter === "newest")
			newReviews.sort((a, b) => b.date - a.date); // getting newest first
		else newReviews.sort((a, b) => a.date - b.date); // getting oldest first
		setReviews(newReviews);

		setReviewItems(newReviews.slice(0, maxPerPage));
	}, [filter]);

	return (
		<>
			{/* <CssBaseline /> */}
			<Container maxWidth="sm">
				<Box sx={{ width: "100%" }} textAlign="center">
					<Typography color="primary" variant="h2" fontWeight="500">
						Honest Reviews
					</Typography>
					<Box>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="navigation tabs"
							centered
							TabIndicatorProps={{
								style: {
									display: "none",
								},
							}}
						>
							<Tab
								label="Reviews"
								{...a11yProps(0)}
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "1.2rem",
								}}
							/>
							<Tab
								label="About"
								{...a11yProps(1)}
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "1.2rem",
								}}
							/>
							<Tab
								label="Contact"
								{...a11yProps(2)}
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "1.2rem",
								}}
							/>
						</Tabs>
					</Box>
					{!newReview && value === 0 && (
						<IconButton
							onClick={createReview}
							aria-label="create review"
						>
							<AddBoxIcon />
						</IconButton>
					)}
					{newReview && value === 0 && (
						<IconButton
							onClick={createReview}
							aria-label="create review"
						>
							<CancelIcon />
						</IconButton>
					)}
					<TabPanel value={value} index={0}>
						{!newReview && reviewItems && (
							<Stack spacing={5}>
								<FormControl
									sx={{ width: "110px", textAlign: "center" }}
								>
									<InputLabel>Filter</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={filter}
										label="Filter"
										onChange={handlerFilter}
									>
										<MenuItem value={"newest"}>
											Newest
										</MenuItem>
										<MenuItem value={"oldest"}>
											Oldest
										</MenuItem>
									</Select>
								</FormControl>
								{reviewItems.map((val, indx) => (
									<ReviewItem date={val.date} key={indx} />
								))}
								<Pagination
									count={Math.ceil(
										reviews.length / maxPerPage
									)}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
									onChange={(event, page) => {
										console.log(
											Math.ceil(
												reviews.length / maxPerPage
											)
										);
										pageChange(page);
									}}
								/>
							</Stack>
						)}
						{newReview && (
							<CreateReview createReview={createReview} />
						)}
					</TabPanel>
					<TabPanel value={value} index={1}>
						<About />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Contact />
					</TabPanel>
				</Box>
			</Container>
		</>
	);
};
