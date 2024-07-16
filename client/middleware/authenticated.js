export default function({ app, redirect }) {
    const isAuthenticated = app.$auth.loggedIn

    if(!isAuthenticated) {
        redirect('/login')
    }
}