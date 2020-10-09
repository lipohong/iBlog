export default function ({ store, redirect, app, route }) {
    if (!store.state.authentication.jwt) {
        return redirect(`/${app.i18n.locale}/auth/login?from=${route.path}`)
    }
}