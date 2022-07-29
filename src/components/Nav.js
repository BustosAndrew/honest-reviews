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

import { useState, useEffect, useReducer, useCallback, useRef } from "react";
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
	reviews: { newest: [], oldest: [] },
	reviewItems: [],
};

const reducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.SET_REVIEWS:
			return {
				...state,
				reviews: { newest: action.newest, oldest: action.oldest },
			};
		case ACTIONS.SET_REVIEW_ITEMS:
			return { ...state, reviewItems: action.data };
		default:
			throw new Error();
	}
};

export const Nav = () => {
	const [value, setValue] = useState(0);
	const [newReview, setNewReview] = useState(false);
	const [filter, setFilter] = useState("newest");
	const [page, setPage] = useState(1);
	const [reviewPage, setReviewPage] = useState(null);
	const [reviewUpdate, setReviewUpdate] = useState();
	const [state, dispatch] = useReducer(reducer, initialState);
	const pageRef = useRef(1);
	const { reviews, reviewItems } = state;
	const maxPerPage = 5;

	const handlerFilter = (event) => {
		pageRef.current = 1;
		setPage(1);
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
				upvotes={upvotes}
				upvoteHandler={upvoteHandler}
				id={id}
			/>
		);
		setReviewPage(renderPage);
	};

	const pageChange = useCallback(
		(page) => {
			let currReviews = [];

			if (filter === "newest") currReviews = reviews.newest;
			else currReviews = reviews.oldest;

			if (!currReviews[page * maxPerPage - 1]) {
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.slice(
						page * maxPerPage - maxPerPage,
						currReviews.length
					),
				});
			} else
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.slice(
						page * maxPerPage - maxPerPage,
						maxPerPage
					),
				});
		},
		[filter, reviews.newest, reviews.oldest]
	);

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
		return querySnapshot;
	};

	const upvoteHandler = async (vote, id, upvotes) => {
		const review = doc(db, "reviews", id);
		const upvote = upvotes + 1;
		const downvote = upvotes - 1;
		if (vote === "up") {
			//setCurrUpvotes(upvote);
			await updateDoc(review, { upvotes: upvote });
			setReviewUpdate({ newId: id, newUpvotes: upvote, changed: true });
		} else {
			//setCurrUpvotes(downvote);
			await updateDoc(review, { upvotes: downvote });
			setReviewUpdate({ newId: id, newUpvotes: downvote, changed: true });
		}
	};

	useEffect(() => {
		console.log("rendering");
		if (reviews.newest.length === 0) {
			let currReviews = [];
			getReviews().then((res) => {
				res.forEach((doc) => {
					currReviews.push([doc.id, doc.data()]);
				});

				currReviews.sort((a, b) => b[1].created - a[1].created); // getting newest created
				let oldestReviews = [];

				for (const review of currReviews) oldestReviews.push(review);
				oldestReviews.sort((a, b) => a[1].created - b[1].created); // getting oldest created

				dispatch({
					type: ACTIONS.SET_REVIEWS,
					newest: currReviews,
					oldest: oldestReviews,
				});
			});
		}

		let currReviews = { newest: [], oldest: [] };
		for (const review of reviews.newest) currReviews.newest.push(review);
		for (const review of reviews.oldest) currReviews.oldest.push(review);

		if (reviewUpdate) {
			if (reviewUpdate.changed) {
				let counter = 0;
				let arrPos = 0;
				currReviews.newest.forEach((review) => {
					counter++;
					if (review[0] === reviewUpdate.newId) {
						review[1].upvotes = reviewUpdate.newUpvotes;
						arrPos = counter;
					}
				});
				currReviews.oldest.forEach((review) => {
					if (review[0] === reviewUpdate.newId)
						review[1].upvotes = reviewUpdate.newUpvotes;
				});

				let newPage = Math.ceil(arrPos / maxPerPage);
				setReviewUpdate((update) => ({ ...update, changed: false }));
				//setReviewPos(arrPos);
				pageChange(newPage);
			}
			// let newPage = Math.ceil(reviewPos / maxPerPage);
			pageChange(pageRef.current);
		} else {
			if (filter === "newest")
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.newest.slice(0, maxPerPage),
				});
			// getting newest created
			else if (filter === "oldest")
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.oldest.slice(0, maxPerPage),
				}); // getting oldest created
		}
	}, [filter, reviewUpdate, reviews, pageChange]);

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
										onChange={(event) =>
											handlerFilter(event)
										}
									>
										<MenuItem value={"newest"}>
											Newest
										</MenuItem>
										<MenuItem value={"oldest"}>
											Oldest
										</MenuItem>
									</Select>
								</FormControl>
								{reviewItems.map((val, indx) => {
									return (
										<ReviewItem
											date={val[1].created}
											username={val[1].username}
											link={val[1].link}
											caption={val[1].caption}
											upvotes={val[1].upvotes}
											key={indx}
											reviewHandler={() =>
												reviewHandler(
													val[1].created,
													val[1].caption,
													val[1].username,
													val[1].link,
													val[1].upvotes,
													val[0]
												)
											}
											upvoteHandler={upvoteHandler}
											id={val[0]}
										/>
									);
								})}
								<Pagination
									count={Math.ceil(
										reviews.newest &&
											reviews.newest.length / maxPerPage
									)}
									page={page}
									sx={{
										display: "flex",
										justifyContent: "center",
									}}
									onChange={(event, page) => {
										pageRef.current = page;
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
