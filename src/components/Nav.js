import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import {
	CircularProgress,
	IconButton,
	Pagination,
	Tabs,
	Tab,
	Typography,
	Box,
	Stack,
	Container,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import {
	useState,
	useEffect,
	useReducer,
	useCallback,
	useRef,
	useContext,
} from "react";
import { ReviewItem } from "./ReviewItem";
import { About } from "./About";
import { Filter } from "./Filter";
import { Contact } from "./Contact";
import { CreateReview } from "./CreateReview";
import { Review } from "./Review";
import { Privacy } from "./Privacy";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { Profile } from "./Profile";
import { TabPanel, a11yProps } from "./TabPanel";
import { FirebaseContext } from "./FirebaseProvider";
import { AuthContext } from "./AuthProvider";
import { navReducer, initialState, ACTIONS } from "./navReducer";

import {
	collection,
	doc,
	getDocs,
	updateDoc,
	addDoc,
	onSnapshot,
} from "firebase/firestore";

const tabStyle = { fontWeight: "bold", color: "text.primary" };

export const Nav = () => {
	const [value, setValue] = useState(0);
	const [newReview, setNewReview] = useState(false);
	const [filter, setFilter] = useState("newest");
	const [page, setPage] = useState(1);
	const [reviewPage, setReviewPage] = useState(null);
	const [state, dispatch] = useReducer(navReducer, initialState);
	const pageRef = useRef(1);
	const [loading, setLoading] = useState(true);
	const [ip, setIP] = useState("");
	const [userVotes, setUserVotes] = useState(null);
	const { reviews, reviewItems } = state;
	const maxPerPage = 5;

	const { myFS } = useContext(FirebaseContext);
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
		const review = (
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
		setReviewPage(review);
	};

	const renderReviews = useCallback(
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

	const upvoteHandler = async (vote, id, upvotes, upvoted, downvoted) => {
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
					upvoted: upvoted,
					downvoted: downvoted,
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
					review.upvoted = upvoted;
					review.downvoted = downvoted;
					postVoted = true;
				}
			}

			if (!postVoted)
				upvoteHistory.push({
					postId: id,
					upvoted: upvoted,
					downvoted: downvoted,
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
			return;
		} else if (vote === "down") {
			await updateDoc(review, { upvotes: downvote });
			return;
		}

		if (vote === "revert-up") {
			await updateDoc(review, { upvotes: upvotes });
			return;
		} else if (vote === "revert-down") {
			await updateDoc(review, { upvotes: upvotes });
			return;
		}
	};

	useEffect(() => {
		if (!ip)
			fetch("https://geolocation-db.com/json/")
				.then((res) => res.json())
				.then((data) => setIP(data.IPv4));
		//console.log("rendering");
		if (reviews.newest.length === 0) {
			let currReviews = [];
			getReviews().then((res) => {
				res.forEach((doc) => {
					currReviews.push([doc.id, doc.data()]);
				});

				if (!(currReviews.length === 0)) {
					currReviews.sort((a, b) => b[1].created - a[1].created); // getting newest created
					let oldestReviews = [...currReviews];

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

		renderReviews(pageRef.current);
	}, [filter, reviews, ip, getReviews, renderReviews]);

	useEffect(() => {
		const getUpvoteHistory = async () => {
			if (profile) {
				const querySnapshot = await getDocs(
					collection(db, "userVotes")
				);
				querySnapshot.forEach((doc) => {
					if (doc.data().displayName === profile.displayName) {
						setUserVotes(doc.data());
					}
				});
			} else setUserVotes(null);
		};

		getUpvoteHistory();

		const unsubscribe = onSnapshot(collection(db, "reviews"), (res) => {
			let reviews = [];
			for (const doc of res.docs) reviews.push([doc.id, doc.data()]);
			reviews.sort((a, b) => b[1].created - a[1].created); // getting newest created
			let oldestReviews = [...reviews];
			oldestReviews.sort((a, b) => a[1].created - b[1].created); // getting oldest created

			dispatch({
				type: ACTIONS.SET_REVIEWS,
				newest: reviews,
				oldest: oldestReviews,
			});
			getUpvoteHistory();
		});

		return unsubscribe;
	}, [profile, db, filter]);

	return (
		<>
			<CssBaseline />
			<Container maxWidth="sm">
				<Box textAlign="center">
					<Typography variant="h2" fontWeight="500" color={"primary"}>
						Honest Reviews
					</Typography>
					<ToggleDarkMode />
					<Box display="flex" justifyContent="center">
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
								sx={tabStyle}
								onClick={() => {
									(newReview && setNewReview(!newReview)) ||
										(reviewPage && setReviewPage(null));
									setPage(1);
									pageRef.current = 1;
									renderReviews(1);
								}}
							/>
							<Tab
								label="About"
								{...a11yProps(1)}
								sx={tabStyle}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
							<Tab
								label="Contact"
								{...a11yProps(2)}
								sx={tabStyle}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
							<Tab
								label="Privacy"
								{...a11yProps(3)}
								sx={tabStyle}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
							<Tab
								label="Profile"
								{...a11yProps(4)}
								sx={tabStyle}
								onClick={() =>
									reviewPage && setReviewPage(null)
								}
							/>
						</Tabs>
					</Box>
					{reviewPage}
					{!reviewPage && value === 0 && (
						<IconButton
							onClick={createReview}
							aria-label="create review"
						>
							{(!newReview && <AddBoxIcon />) || <CancelIcon />}
						</IconButton>
					)}
					<TabPanel value={value} index={0}>
						{!reviewItems && <CircularProgress size={100} />}
						{!reviewPage && !newReview && (
							<Stack justifyContent="center" spacing={3}>
								<Filter
									filter={filter}
									handlerFilter={handlerFilter}
								/>
								{(loading && (
									<CircularProgress
										sx={{
											alignSelf: "center",
										}}
										size={80}
									/>
								)) ||
									(reviewItems &&
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
														(userVotes &&
															userVotes.postsUpvoted.find(
																(post) =>
																	post.postId ===
																		val[0] &&
																	post.upvoted
															) &&
															true) ||
														false
													}
													isDownvoted={
														(userVotes &&
															userVotes.postsUpvoted.find(
																(post) =>
																	post.postId ===
																		val[0] &&
																	post.downvoted
															) &&
															true) ||
														false
													}
												/>
											);
										}))}
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
											renderReviews(page);
										}}
									/>
								)}
							</Stack>
						)}
						{newReview && (
							<CreateReview createReview={createReview} ip={ip} />
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
		</>
	);
};
