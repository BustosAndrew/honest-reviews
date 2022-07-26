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
import { Pagination } from "@mui/material";
//import CssBaseline from "@mui/material/CssBaseline";

import { useState, useEffect, useReducer } from "react";
import { ReviewItem } from "./ReviewItem";
import { About } from "./About";
import { Contact } from "./Contact";
import { CreateReview } from "./CreateReview";
import { Review } from "./Review";

import { initializeApp } from "firebase/app";
import {
	collection,
	doc,
	getDocs,
	getFirestore,
	updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAH7u9gRSiL-8B211-Kjh2dmUrkw7gIuac",
	authDomain: "honestreviews-492ea.firebaseapp.com",
	projectId: "honestreviews-492ea",
	storageBucket: "honestreviews-492ea.appspot.com",
	messagingSenderId: "260627698277",
	appId: "1:260627698277:web:cdd642ed44c946e2362c8c",
};

// Initialize Firebase/firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const ACTIONS = {
	SET_REVIEWS: "set_reviews",
	SET_REVIEW_ITEMS: "set_review_items",
	SET_PAGE: "set_page",
};

const initialState = {
	reviews: null,
	reviewItems: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.SET_REVIEWS:
			return { ...state, reviews: action.data };
		case ACTIONS.SET_REVIEW_ITEMS:
			return { ...state, reviewItems: action.data };
		default:
			throw new Error();
	}
};

export const Nav = () => {
	const [value, setValue] = useState(0);
	// const [reviews, setReviews] = useState(null);
	// const [reviewItems, setReviewItems] = useState();
	const [newReview, setNewReview] = useState(false);
	const [filter, setFilter] = useState("newest");
	const [page, setPage] = useState(1);
	const [reviewPage, setReviewPage] = useState(null);
	const [currUpvotes, setCurrUpvotes] = useState(null);
	const [state, dispatch] = useReducer(reducer, initialState);
	const { reviews, reviewItems } = state;
	const maxPerPage = 5;

	const handlerFilter = (event) => {
		setFilter(event.target.value);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (newValue !== 0) setNewReview(false);
	};

	const reviewHandler = (date, caption, username, link, upvotes, id) => {
		const renderPage = (
			<Review
				date={date}
				caption={caption}
				username={username}
				link={link}
				upvotes={currUpvotes || upvotes}
				upvoteHandler={upvoteHandler}
				id={id}
			/>
		);
		setReviewPage(renderPage);
	};

	const pageChange = (page) => {
		if (!reviews[page * maxPerPage - 1]) {
			// setReviewItems(
			// 	reviews.slice(page * maxPerPage - maxPerPage, reviews.length)
			// );
			dispatch({
				type: ACTIONS.SET_REVIEW_ITEMS,
				data: reviews.slice(
					page * maxPerPage - maxPerPage,
					reviews.length
				),
			});
		}
		// setReviewItems(
		// 	reviews.slice(page * maxPerPage - maxPerPage, maxPerPage)
		// );
		else
			dispatch({
				type: ACTIONS.SET_REVIEW_ITEMS,
				data: reviews.slice(page * maxPerPage - maxPerPage, maxPerPage),
			});
	};

	const createReview = () => {
		setNewReview(!newReview);
		if (newReview === false)
			//setReviewItems(reviews.slice(0, maxPerPage));
			dispatch({
				type: ACTIONS.SET_REVIEW_ITEMS,
				data: reviews.slice(0, maxPerPage),
			});
	};

	const getReviews = async () => {
		const querySnapshot = await getDocs(collection(db, "reviews"));
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			//console.log(doc.id, " => ", doc.data());
		});
		return querySnapshot;
	};

	const upvoteHandler = async (vote, id, upvotes) => {
		const review = doc(db, "reviews", id);
		const upvote = upvotes + 1;
		const downvote = upvotes - 1;
		if (vote === "up") {
			setCurrUpvotes(upvote);
			await updateDoc(review, { upvotes: upvote });
		} else {
			setCurrUpvotes(downvote);
			await updateDoc(review, { upvotes: downvote });
		}
	};

	useEffect(() => {
		//console.log("rendering");
		let currReviews = reviews;
		if (!currReviews) {
			currReviews = [];
			getReviews().then((res) => {
				res.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					//console.log(doc);
					console.log(doc.id, " => ", doc.data());
					currReviews.push([doc.id, doc.data()]);
				});
				if (filter === "newest")
					currReviews.sort((a, b) => b[1].created - a[1].created);
				// getting newest first
				else currReviews.sort((a, b) => a[1].created - b[1].created); // getting oldest first

				//setReviews(currReviews);
				dispatch({ type: ACTIONS.SET_REVIEWS, data: currReviews });
			});
		} else {
			const currReviews = reviews;
			if (filter === "newest")
				currReviews.sort((a, b) => b[1].created - a[1].created);
			// getting newest first
			else currReviews.sort((a, b) => a[1].created - b[1].created); // getting oldest first

			//setReviewItems(currReviews.slice(0, maxPerPage));
		}
		//setReviewItems(currReviews.slice(0, maxPerPage));
		dispatch({ type: ACTIONS.SET_REVIEW_ITEMS, data: currReviews });
	}, [filter, reviews]);

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
								onClick={() =>
									(newReview && setNewReview(!newReview)) ||
									(reviewPage && setReviewPage(null))
								}
							/>
							<Tab
								label="About"
								{...a11yProps(1)}
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "1.2rem",
								}}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
							<Tab
								label="Contact"
								{...a11yProps(2)}
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "1.2rem",
								}}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
						</Tabs>
					</Box>
					{reviewPage}
					{!reviewPage && !newReview && value === 0 && (
						<IconButton
							onClick={createReview}
							aria-label="create review"
						>
							<AddBoxIcon />
						</IconButton>
					)}
					{!reviewPage && newReview && value === 0 && (
						<IconButton
							onClick={createReview}
							aria-label="cancel review"
						>
							<CancelIcon />
						</IconButton>
					)}
					<TabPanel value={value} index={0}>
						{!reviewPage && !newReview && reviewItems && (
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
									<ReviewItem
										date={val[1].created}
										username={val[1].username}
										link={val[1].link}
										caption={val[1].caption}
										upvotes={currUpvotes || val[1].upvotes}
										key={indx}
										reviewHandler={() =>
											reviewHandler(
												val[1].created,
												val[1].caption,
												val[1].username,
												val[1].link,
												currUpvotes || val[1].upvotes,
												val[0]
											)
										}
										upvoteHandler={upvoteHandler}
										id={val[0]}
									/>
								))}
								<Pagination
									count={Math.ceil(
										reviews && reviews.length / maxPerPage
									)}
									page={page}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
									onChange={(event, page) => {
										setPage(page);
										pageChange(page);
									}}
								/>
							</Stack>
						)}
						{newReview && (
							<CreateReview db={db} createReview={createReview} />
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
