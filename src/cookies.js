// cookies.js
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const removeCookie = () => {
  cookies.remove("id");
  cookies.remove("token");
};

export default cookies;
