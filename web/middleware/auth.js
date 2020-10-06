export default function ( { store, redirect } ) {
    if ( !store.state.auth.accessToken ) {
        return redirect( `/` )
    }
}