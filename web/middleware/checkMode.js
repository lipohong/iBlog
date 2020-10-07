const cookie = require('cookie');

export default function ({ req, res, store, vuetify }) {
    if (process.server) {
        const { mode } = cookie.parse(req.headers.cookie || '');
        if (!mode) {
            res.setHeader('Set-Cookie', 'mode=light');
            store.dispatch('mode/setMode', { mode: 'light' });
        } else {
            store.dispatch('mode/setMode', { mode });
        }
    }
}