// resourceActions.js
import { ResourceTypes } from "../action_types";

// Action to get all resources
export const getAllResources = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ResourceTypes.GET_ALL_RESOURCES_REQUEST });

      // ✅ Get resources from Redux store itself
      const resources = getState().resources.resources || [];

      dispatch({
        type: ResourceTypes.GET_ALL_RESOURCES_SUCCESS,
        payload: resources,
      });
    } catch (error) {
      dispatch({ type: ResourceTypes.GET_ALL_RESOURCES_FAILURE });
    }
  };
};
