import axios from 'axios';

// The URL of your Python Flask backend
const API_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches movie recommendations from the backend API.
 * @param {string[]} movieIds - An array of movie IDs from the user's watch history.
 * @returns {Promise<any>} The recommendation data from the API.
 */
export const getRecommendations = (movieIds) => {
  console.log("Sending movie IDs to backend:", movieIds);
  // This sends a POST request to your Python server with the movie IDs
  return axios.post(`${API_URL}/recommend`, {
    movie_ids: movieIds,
  });
};