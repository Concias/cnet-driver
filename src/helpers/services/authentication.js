import {baseUrl} from '../../constants/defaultValues';
import axios from 'axios';

export const authentication = {
    login
};

function login(username, password, remember) {
    var formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);
    return axios.post(`${baseUrl}/login`, formData);
}