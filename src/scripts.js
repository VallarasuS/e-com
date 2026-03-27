function redirect(path) {
    window.location.assign(path)
}

function login() {

    user = document.getElementById('auth-user').value
    pass = document.getElementById('auth-pass').value

    if (user == 'admin' && pass == 'admin') {
        redirect("index.html")
    }
    else {
        show_alert("Invalid user name or password")
    }
}

function show_alert(text) {
    window.alert(text)
}

function signup() {

    current = 0
    groups = document.getElementsByClassName("field-group")
    length = groups?.length || 0

    function next(reverse = false) {

        groups[current].classList.toggle("visible")

        if (reverse)
            current--
        if (current < 0)
            current = length - 1
        else {
            current++
            if (current >= length)
                current = 0
        }

        if (current == length - 1) {
            document.getElementById("signup-button-next").classList.toggle("visible")
        }

        groups[current].classList.toggle("visible")
    }

    function submit() {

    }

    function createOption(id, start, stop, step) {

        el = document.getElementById(id)

        for (let i = start; i <= stop; i = i + step) {

            value = document.createTextNode(`${String(i).padStart(2, 0)}`)

            option = document.createElement("option")
            option.appendChild(value)
            option.setAttribute("value", i)

            el.appendChild(option)
        }
    }

    function populate() {

        createOption("auth-dob-day", 1, 31, 1)
        createOption("auth-dob-month", 1, 12, 1)
    }

    return { next, submit, populate, show_alert }
}