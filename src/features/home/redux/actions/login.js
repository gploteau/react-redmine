import {
	HOME_LOGIN_BEGIN,
	HOME_LOGIN_SUCCESS,
	HOME_LOGIN_FAILURE,
	HOME_LOGIN_DISMISS_ERROR
} from './constants';

export function login(args = {}) {
	return dispatch => {
		dispatch({
			type: HOME_LOGIN_BEGIN
		});

		const promise = new Promise((resolve, reject) => {
			const doRequest = args.error
				? Promise.reject(new Error())
				: Promise.resolve();

			doRequest.then(
				res => {
					dispatch({
						type: HOME_LOGIN_SUCCESS,
						data: res
					});
					resolve(res);
				},

				err => {
					dispatch({
						type: HOME_LOGIN_FAILURE,
						data: { error: err }
					});
					reject(err);
				}
			);
		});

		return promise;
	};
}

export function dismissLoginError() {
	return {
		type: HOME_LOGIN_DISMISS_ERROR
	};
}

export function notConnected() {
	return {
		type: HOME_LOGIN_FAILURE
	};
}

export function reducer(state, action) {
	switch (action.type) {
		case HOME_LOGIN_BEGIN:
			// Just after a request is sent
			return {
				...state,
				loginPending: true,
				authChecked: false,
				loginError: null
			};

		case HOME_LOGIN_SUCCESS:
			// The request is success
			return {
				...state,
				loginPending: false,
				authChecked: true,
				loginError: null
			};

		case HOME_LOGIN_FAILURE:
			// The request is failed
			return {
				...state,
				loginPending: false,
				authChecked: true,
				loginError: action.data ? action.data.error : null
			};

		case HOME_LOGIN_DISMISS_ERROR:
			// Dismiss the request failure error
			return {
				...state,
				authChecked: false,
				loginError: null
			};

		default:
			return state;
	}
}
