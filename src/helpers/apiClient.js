import axios from 'axios';
import { getCurrentUser, setCurrentUser } from './Utils';
import { baseUrl } from '../constants/defaultValues';

const apiClient = axios.create({
  baseURL: baseUrl,
});

try {
   let currentUser = getCurrentUser();
  // const authenticationHeader = currentUser ? 'Bearer ' + currentUser.token : '';
  // apiClient.defaults.headers.common['Authorization'] = authenticationHeader;

  apiClient.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      // Do something with response error
      if (
        error &&
        error.response &&
        error.response.status &&
        error.response.status === 401
      ) {
        // auto logout if 401 Unauthorized
        setCurrentUser(null);
        window.location.reload(true);
      }
      return Promise.reject(error);
    }
  );
} catch (ex) {
  console.log(ex);
}

export default apiClient;
