import { instance as configuredAxios } from '../axiosConfig';

const isAuthenticated = async () => {
    // try {
    //     const res = await configuredAxios.get('/userdata');
    //     if (res.data.user) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // } catch(err){
    //     console.log(err.message);
    //     return false;
    // }
    return true; //temporary fix
}

export { isAuthenticated };