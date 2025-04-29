import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers } from "redux";
import authReducer from "./Reducers/authRedcuer";  // Adjust as per your file structure
import profileReducer from "./Reducers/profileReducer";
import agencyReducer from "./Reducers/agencyReducer";
import resourceReducer from "./Reducers/resourceReducer"; // Import the resourceReducer

const store = createStore(
  combineReducers({
    auth: authReducer,
    profile: profileReducer,
    agencies: agencyReducer,
    resources: resourceReducer,  // Include resourceReducer in the store
  }),
  composeWithDevTools(applyMiddleware(thunk))  // Enable Redux DevTools extension
);

export default store;
