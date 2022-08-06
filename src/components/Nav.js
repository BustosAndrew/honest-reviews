import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Pagination } from "@mui/material";
import { CircularProgress } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { IconButton } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import {
	useState,
	useEffect,
	useReducer,
	useCallback,
	useRef,
	useMemo,
	useContext,
} from "react";
import { ReviewItem } from "./ReviewItem";
import { About } from "./About";
import { Contact } from "./Contact";
import { CreateReview } from "./CreateReview";
import { Review } from "./Review";
import { Privacy } from "./Privacy";
import { ToggleDarkMode, ColorModeContext } from "./ToggleDarkMode";
import { Profile } from "./Profile";
import { FirebaseContext } from "./FirebaseProvider";

import {
	collection,
	doc,
	getDocs,
	updateDoc,
	addDoc,
} from "firebase/firestore";
import { AuthContext } from "./AuthProvider";

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
	const [loading, setLoading] = useState(true);
	const [ip, setIP] = useState("");
	const [mode, setMode] = useState("light");
	const [userVotes, setUserVotes] = useState(null);
	//const elemRef = useRef(null);
	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) =>
					prevMode === "light" ? "dark" : "light"
				);
			},
		}),
		[]
	);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);
	const { reviews, reviewItems } = state;
	const maxPerPage = 5;

	const { myFS, myAuth } = useContext(FirebaseContext);
	const { profile } = useContext(AuthContext);
	const db = myFS;

	const handlerFilter = (event) => {
		pageRef.current = 1;
		setPage(1);
		setFilter(event.target.value);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
		if (newValue !== 0) setNewReview(false);
	};

	const reviewHandler = (
		date,
		reviewer,
		caption,
		title,
		link,
		upvotes,
		id,
		isUpvoted,
		isDownvoted
	) => {
		const renderPage = (
			<Review
				date={date}
				caption={caption}
				title={title}
				link={link}
				reviewer={reviewer}
				upvotes={upvotes}
				upvoteHandler={upvoteHandler}
				id={id}
				isUpvoted={isUpvoted}
				isDownvoted={isDownvoted}
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
			} else {
				let arrPos = page * maxPerPage - maxPerPage;
				if (arrPos < 0) arrPos = 0;

				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.slice(arrPos, arrPos + maxPerPage),
				});
			}
		},
		[filter, reviews.newest, reviews.oldest]
	);

	const createReview = () => {
		if (!profile) {
			setNewReview(false);
			setValue(4);
			return;
		}
		setNewReview(!newReview);
	};

	const getReviews = useCallback(async () => {
		const querySnapshot = await getDocs(collection(db, "reviews"));
		return querySnapshot;
	}, [db]);

	const upvoteHandler = async (vote, id, upvotes) => {
		if (!profile) {
			setValue(4);
			setReviewPage(null);
			return;
		}

		let userVotesExists = false;
		let userVotesDoc = null;
		const querySnapshot = await getDocs(collection(db, "userVotes"));
		querySnapshot.forEach((doc) => {
			if (doc.data().displayName === profile.displayName) {
				userVotesDoc = doc;
				userVotesExists = true;
			}
		});

		if (!userVotesExists) {
			let upvoteHistory = [
				{
					postId: id,
					upvoted: vote === "up",
					downvoted: vote === "down",
				},
			];

			await addDoc(collection(db, "userVotes"), {
				displayName: profile.displayName,
				postsUpvoted: upvoteHistory,
			});
		} else {
			let upvoteHistory = [...userVotesDoc.data().postsUpvoted];
			let postVoted = false;
			for (const review of upvoteHistory) {
				if (review.postId === id) {
					review.upvoted = vote === "up" || vote === "revert-down";
					review.downvoted = vote === "down" || vote === "revert-up";
					postVoted = true;
				}
			}

			if (!postVoted)
				upvoteHistory.push({
					postId: id,
					upvoted: vote === "up",
					downvoted: vote === "down",
				});

			await updateDoc(userVotesDoc.ref, {
				postsUpvoted: upvoteHistory,
			});
		}

		const review = doc(db, "reviews", id);
		const upvote = upvotes + 1;
		const downvote = upvotes - 1;
		if (vote === "up") {
			await updateDoc(review, { upvotes: upvote });
			setReviewUpdate(() => ({
				newId: id,
				newUpvotes: upvote,
				changed: true,
			}));
			return;
		} else if (vote === "down") {
			await updateDoc(review, { upvotes: downvote });
			setReviewUpdate(() => ({
				newId: id,
				newUpvotes: downvote,
				changed: true,
			}));
			return;
		}

		if (vote === "revert-up") {
			await updateDoc(review, { upvotes: upvotes });
			setReviewUpdate(() => ({
				newId: id,
				newUpvotes: upvotes,
				changed: true,
			}));
			return;
		} else if (vote === "revert-down") {
			await updateDoc(review, { upvotes: upvotes });
			setReviewUpdate(() => ({
				newId: id,
				newUpvotes: upvotes,
				changed: true,
			}));
			return;
		}
	};

	const syncHandler = () => {
		const currReviews = [];

		dispatch({
			type: ACTIONS.SET_REVIEWS,
			newest: currReviews,
			oldest: currReviews,
		});
		setLoading(!loading);
		setPage(1);
	};

	useEffect(() => {
		if (!ip)
			fetch("https://geolocation-db.com/json/")
				.then((res) => res.json())
				.then((data) => setIP(data.IPv4));
		console.log("rendering");
		if (reviews.newest.length === 0) {
			let currReviews = [];
			getReviews().then((res) => {
				res.forEach((doc) => {
					currReviews.push([doc.id, doc.data()]);
				});

				if (!(currReviews.length === 0)) {
					currReviews.sort((a, b) => b[1].created - a[1].created); // getting newest created
					let oldestReviews = [];

					for (const review of currReviews)
						oldestReviews.push(review);
					oldestReviews.sort((a, b) => a[1].created - b[1].created); // getting oldest created

					dispatch({
						type: ACTIONS.SET_REVIEWS,
						newest: currReviews,
						oldest: oldestReviews,
					});
					setTimeout(() => setLoading(false), 500);
				}
			});
		}

		let currReviews = { newest: [], oldest: [] };
		for (const review of reviews.newest) currReviews.newest.push(review);
		for (const review of reviews.oldest) currReviews.oldest.push(review);

		if (reviewUpdate) {
			if (reviewUpdate.changed) {
				currReviews.newest.forEach((review) => {
					if (review[0] === reviewUpdate.newId) {
						review[1].upvotes = reviewUpdate.newUpvotes;
					}
				});
				currReviews.oldest.forEach((review) => {
					if (review[0] === reviewUpdate.newId)
						review[1].upvotes = reviewUpdate.newUpvotes;
				});

				setReviewUpdate((update) => ({ ...update, changed: false }));
				pageChange(pageRef.current);
			}
			pageChange(pageRef.current);
		} else {
			// getting newest created
			if (filter === "newest")
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.newest.slice(0, maxPerPage),
				});
			// getting oldest created
			else if (filter === "oldest")
				dispatch({
					type: ACTIONS.SET_REVIEW_ITEMS,
					data: currReviews.oldest.slice(0, maxPerPage),
				});
		}
	}, [filter, reviewUpdate, reviews, pageChange, ip, getReviews]);

	useEffect(() => {
		const getUpvoteHistory = async () => {
			if (profile) {
				const querySnapshot = await getDocs(
					collection(db, "userVotes")
				);
				querySnapshot.forEach((doc) => {
					if (doc.data().displayName === profile.displayName) {
						//console.log(userVotesDoc);
						setUserVotes(doc.data());
					}
				});
			}
		};

		getUpvoteHistory();
	}, [profile, db]);

	// useEffect(() => {
	// 	//let yTop =
	// 	// 	window.innerHeight - elemRef.current.getBoundingClientRect().top;
	// 	onscroll = () => {
	// 		let currScrollYPos = window.innerHeight - window.scrollY;
	// 		//console.log("tabs y top pos: " + currScrollYPos);
	// 		console.log("scroll y pos: " + currScrollYPos);
	// 	};
	// }, []);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Container maxWidth="sm">
					<Box textAlign="center">
						<Typography
							variant="h2"
							fontWeight="500"
							color={"primary"}
						>
							Honest Reviews
						</Typography>
						<ToggleDarkMode />
						<Box
							//ref={elemRef}
							display="flex"
							justifyContent="center"
						>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="navigation tabs"
								TabIndicatorProps={{
									style: {
										display: "none",
									},
								}}
								variant="scrollable"
								scrollButtons
								allowScrollButtonsMobile
							>
								<Tab
									label="Reviews"
									{...a11yProps(0)}
									sx={{
										fontWeight: "bold",
										color: "text.primary",
									}}
									onClick={() => {
										(newReview &&
											setNewReview(!newReview)) ||
											(reviewPage && setReviewPage(null));
										setPage(1);
										pageChange(1);
										pageRef.current = 1;
									}}
								/>
								<Tab
									label="About"
									{...a11yProps(1)}
									sx={{
										fontWeight: "bold",
										color: "text.primary",
									}}
									onClick={() =>
										reviewPage && setReviewPage(null)
									}
								/>
								<Tab
									label="Contact"
									{...a11yProps(2)}
									sx={{
										fontWeight: "bold",
										color: "text.primary",
									}}
									onClick={() =>
										reviewPage && setReviewPage(null)
									}
								/>
								<Tab
									label="Privacy"
									{...a11yProps(3)}
									sx={{
										color: "text.primary",
										fontWeight: "bold",
									}}
									onClick={() =>
										reviewPage && setReviewPage(null)
									}
								/>
								<Tab
									label="Profile"
									{...a11yProps(4)}
									sx={{
										color: "text.primary",
										fontWeight: "bold",
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
							{!reviewItems && <CircularProgress size={100} />}
							{!reviewPage && !newReview && reviewItems && (
								<Stack justifyContent="center" spacing={3}>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
									>
										<FormControl
											sx={{
												width: "110px",
												textAlign: "center",
											}}
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
										<IconButton onClick={syncHandler}>
											<SyncIcon />
										</IconButton>
									</Stack>
									{loading && (
										<CircularProgress
											sx={{
												alignSelf: "center",
											}}
											size={80}
										/>
									)}
									{!loading &&
										reviewItems.map((val, indx) => {
											return (
												<ReviewItem
													date={val[1].created}
													reviewer={val[1].reviewer}
													title={val[1].title}
													link={val[1].link}
													caption={val[1].caption}
													upvotes={val[1].upvotes}
													key={indx}
													reviewHandler={
														reviewHandler
													}
													upvoteHandler={
														upvoteHandler
													}
													id={val[0]}
													isUpvoted={
														userVotes &&
														userVotes.postsUpvoted.find(
															(post) =>
																post.postId ===
																	val[0] &&
																post.upvoted
														)
													}
													isDownvoted={
														userVotes &&
														userVotes.postsUpvoted.find(
															(post) =>
																post.postId ===
																	val[0] &&
																post.downvoted
														)
													}
												/>
											);
										})}
									{!loading && (
										<Pagination
											count={Math.ceil(
												reviews.newest &&
													reviews.newest.length /
														maxPerPage
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
									)}
								</Stack>
							)}
							{newReview && (
								<CreateReview
									createReview={createReview}
									ip={ip}
								/>
							)}
						</TabPanel>
						<TabPanel value={value} index={1}>
							<About />
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Contact />
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Privacy />
						</TabPanel>
						<TabPanel value={value} index={4}>
							<Profile />
						</TabPanel>
					</Box>
				</Container>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};
