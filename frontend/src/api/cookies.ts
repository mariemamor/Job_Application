import Cookies from 'js-cookie';
import { baseUrl} from "./baseUrl";

const COOKIE_DOMAIN = '';

export const setTokenCookie = (token: string) => {
  Cookies.set('token', token, {
    domain: COOKIE_DOMAIN,
    expires: 1, // expires in 1 day
    sameSite: 'Lax', // good practice for security
    secure: false, // true if using https
  });
};

export const getTokenCookie = () => {
  return Cookies.get('token');
};

export const removeTokenCookie = () => {
  Cookies.remove('token', { domain: COOKIE_DOMAIN });
};
