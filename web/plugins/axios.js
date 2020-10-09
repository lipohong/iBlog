export default ({ store, $axios, redirect, app, route }) => {
    if (store.state.authentication.jwt) {
        $axios.setToken(store.state.authentication.jwt, 'Bearer');
    }
    $axios.onError(error => {
        if (error.response.data.message == 'ex_not_authenticated' ) {
            redirect(`/${app.i18n.locale}/auth/login?from=${route.path}`)
        }
    })
}
