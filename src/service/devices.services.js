import { serverUrl } from '../../../constants/defaultValues';

export  const fetchDrivers = async () => {
     return axios.get(`${serverUrl}/devices`)
  }