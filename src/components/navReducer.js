export const ACTIONS = {
	SET_REVIEWS: "set_reviews",
	SET_REVIEW_ITEMS: "set_review_items",
};

export const initialState = {
	reviews: { newest: [], oldest: [] },
	reviewItems: [],
};

export const navReducer = (state, action) => {
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
