function redirect(path) {
    window.location.assign(path)
}

function login() {

    user = document.getElementById('login-user').value
    pass = document.getElementById('login-pass').value

    if (user == 'admin' && pass == 'admin') {
        redirect("index.html")
    }
}