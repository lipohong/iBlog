import themes from '../assets/style/themes/themes';
const cookie = require('cookie');

export default function ({ req, res, store, $vuetify }) {
    if (process.server) {
        const { theme } = cookie.parse(req.headers.cookie || '');
        if (!theme) {
            res.setHeader('Set-Cookie', 'theme=0');
            store.dispatch('theme/setTheme', { theme: 0 });
            $vuetify.them.themes = themes[1];
        } else {
            store.dispatch('theme/setTheme', { theme });
        }
    }
}