const auth = {
  isAuthenticated() {
    if (typeof window == 'undefined') return false;

    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'));
    else return false;
  },
  authenticate(jwt) {
    if (typeof window !== 'undefined')
      sessionStorage.setItem('jwt', JSON.stringify(jwt));
  },
  clearJWT(callback) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
    callback();
  },
};

export default auth;
