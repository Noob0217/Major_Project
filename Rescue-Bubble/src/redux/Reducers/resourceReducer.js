// resourceReducer.js
import { ResourceTypes } from "../action_types"; // Importing action types

const initialState = {
  allResources: [],  // This will hold the list of resources fetched from the API
  loadingResources: false,  // Will track the loading state
};

const resourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ResourceTypes.GET_ALL_RESOURCES_REQUEST:
      return { ...state, loadingResources: true };  // Set loading state to true
    case ResourceTypes.GET_ALL_RESOURCES_SUCCESS:
      return { 
        ...state, 
        loadingResources: false,  // Set loading state to false when data is fetched
        allResources: action.payload  // Store the resources in state
      };
    case ResourceTypes.GET_ALL_RESOURCES_FAILURE:
      return { ...state, loadingResources: false };  // Handle failure, set loading to false
    default:
      return state;
  }
};

export default resourceReducer;
