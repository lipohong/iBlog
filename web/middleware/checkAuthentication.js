const cookie = require('cookie');

export default async function ({ req, res, store }) {
    if (process.server) {
        let { authentication } = cookie.parse(req.headers.cookie || '');
        if (authentication) {
            authentication = JSON.parse(authentication);
            await store.dispatch('authentication/setAuth', { authentication });
            await store.dispatch('user/getAndSetUserInfo', { userId: store.state.authentication.userId });
        }
    }
}