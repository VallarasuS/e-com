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

function signup() {

    function next() {

    }

    function submit() {

    }

    function populate() {
        day_select = document.getElementById("signup-dob-day")

        for (let day = 1; day <= 31; day++) {
            option = document.createElement("option")
            value = document.createTextNode(`${String(day).padStart(2, 0)}`)
            option.appendChild(value)
            day_select.appendChild(option)
        }

        month_select = document.getElementById("signup-dob-month")

        for (let day = 1; day <= 12; day++) {
            option = document.createElement("option")
            value = document.createTextNode(`${String(day).padStart(2, 0)}`)
            option.appendChild(value)
            month_select.appendChild(option)
        }
    }

    return { next, submit, populate }
}