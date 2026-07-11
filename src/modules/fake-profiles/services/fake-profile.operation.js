// import { apiConnector } from "@/services/axios/axios.connector";
// import { FAKE_PROFILE_ENDPOINTS } from "@/services/api-endpoints/fake-profiles.endpoints";

// /**
//  * GET /fake-profiles — List all with pagination, sorting, filters
//  * @param {Object} params - Query params: page, limit, gender, status, city, search, batchId, sortBy, sortOrder
//  */
// export const getFakeProfilesApi = async (params = {}) => {
//   try {
//     const response = await apiConnector(
//       "GET",
//       FAKE_PROFILE_ENDPOINTS.LIST_ALL,
//       null,
//       null,
//       params,
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * POST /fake-profiles/bulk-create
//  * @param {Object} payload - { count, gender, ageRange: { min, max }, city }
//  */
// export const bulkCreateFakeProfilesApi = async (payload) => {
//   try {
//     const response = await apiConnector(
//       "POST",
//       FAKE_PROFILE_ENDPOINTS.BULK_CREATE,
//       payload,
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * PATCH /fake-profiles/:id/toggle
//  * @param {string} id - The userId (user.profile.id from list response)
//  */
// export const toggleFakeProfileStatusApi = async (id) => {
//   try {
//     const response = await apiConnector(
//       "PATCH",
//       FAKE_PROFILE_ENDPOINTS.TOGGLE_STATUS(id),
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * DELETE /fake-profiles/:id
//  * @param {string} id - The userId (user.profile.id from list response)
//  */
// export const deleteFakeProfileApi = async (id) => {
//   try {
//     const response = await apiConnector(
//       "DELETE",
//       FAKE_PROFILE_ENDPOINTS.DELETE_SINGLE(id),
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * GET /fake-profiles/cities — List all available cities
//  */
// export const listCitiesApi = async () => {
//   try {
//     const response = await apiConnector(
//       "GET",
//       FAKE_PROFILE_ENDPOINTS.LIST_CITIES,
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * POST /fake-profiles/cities — Add a new custom city
//  * @param {Object} payload - { name, state, lat, lng }
//  */
// export const addCityApi = async (payload) => {
//   try {
//     const response = await apiConnector(
//       "POST",
//       FAKE_PROFILE_ENDPOINTS.ADD_CITY,
//       payload,
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// /**
//  * DELETE /fake-profiles/cities/:id — Delete a custom city
//  * @param {string} id - The ObjectId of the custom city
//  */
// export const deleteCityApi = async (id) => {
//   try {
//     const response = await apiConnector(
//       "DELETE",
//       FAKE_PROFILE_ENDPOINTS.DELETE_CITY(id),
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
