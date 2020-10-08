const cookie = require('cookie');

export default function ({ req, res, store }) {
    if (process.server) {
        const { theme } = cookie.parse(req.headers.cookie || '');
        if (!theme) {
            res.setHeader('Set-Cookie', 'theme=0');
            store.dispatch('theme/setTheme', { theme: 0 });
        } else {
            store.dispatch('theme/setTheme', { theme });
        }
    }
}