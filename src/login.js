import * as create from './helpers.js'
import * as feed from './feed.js'
const api = `http://localhost:5000`

export function createLoginForm(main) {
    main.innerHTML="" //Reset the page body
    let div = create.Div(main, false, "login-form")
    let loginForm = create.Form(div, false, "signup")
    create.Label(loginForm, false, "login-form", "Username:")
    let uname = create.Input(loginForm, "text", false, "login-form", false, "username")
    create.Label(loginForm, false, "login-form", "Password:")
    let pword = create.Input(loginForm, "password", false, "login-form", false, "password")
    create.Label(loginForm, false, "login-form", "Confirm Password:")
    let confirm = create.Input(loginForm, "password", false, "login-form", false, "confirm")
    let submit = create.Button(loginForm, "submit", false, "login-form", "Login", "login")
    submit.addEventListener("click", function(e){e.preventDefault();login(uname.value, pword.value, confirm.value)})
    let register = create.Button(loginForm, "button", false, false, "Dont have an account?", false)
    register.addEventListener("click", function(){createRegisterForm(main)})
}

function createRegisterForm(main) {
    main.innerHTML=""
    let div = create.Div(main, false, "login-form")
    let loginForm = create.Form(div, false, "signup")
    create.Label(loginForm, false, "login-form", "Username:")
    let uname = create.Input(loginForm, "text", false, "login-form", false, "username")
    create.Label(loginForm, false, "login-form", "Password:")
    let pword = create.Input(loginForm, "password", false, "login-form", false, "password")
    create.Label(loginForm, false, "login-form", "Confirm Password:")
    let confirm = create.Input(loginForm, "password", false, "login-form", false, "confirm")
    
    
    create.Label(loginForm, false, "login-form", "Email:")
    let email = create.Input(loginForm, "text", false, "login-form", false, "email")
    create.Label(loginForm, false, "login-form", "Username:")
    let name = create.Input(loginForm, "text", false, "login-form", false, "full name")
    
    let submit = create.Button(loginForm, "submit", false, "login-form", "Register", "register")
    submit.addEventListener("click", function(e){e.preventDefault();register(uname.value, pword.value, confirm.value, email.value, name.value)})
    let login = create.Button(loginForm, "button", false, false, "Have an account?", false)
    login.addEventListener("click", function(){createLoginForm(main)})
}

function login(uname, pword, confirm) {
    console.log("login")
    console.log(`${uname} ${pword} ${confirm}`)
    if (pword!=confirm) {
        console.log("Error u fuckwit")
    } else {
        console.log("yeet")
        let data = {
            "username": uname,
            "password": pword
        }

        let options = {
            method: "POST",
            headers: {
                'Content-Type' : 'application/JSON'
            },
            body: JSON.stringify(data)
        }

        fetch(`${api}/auth/login`, options)
        .then(r => r.json())
        .then(r => {
            console.log(r)
            localStorage.setItem("token", r.token)
            const main = document.getElementsByTagName("main")[0]
            feed.createFeed(main)
        });

    }
}

function register(uname, pword, confirm, email, name) {
    console.log("login")
    console.log(`${uname} ${pword} ${confirm}`)
    if (pword!=confirm) {
        console.log("Error u fuckwit")
    } else {
        console.log("yeet")
        let data = {
            "username": uname,
            "password": pword,
            "email": email,
            "name": name
        }

        let options = {
            method: "POST",
            headers: {
                'Content-Type' : 'application/JSON'
            },
            body: JSON.stringify(data)
        }

        fetch(`${api}/auth/signup`, options)
            .then(r => r.json())
            .then(r => {
                console.log(r)
                localStorage.setItem("token", r.token)
                const main = document.getElementsByTagName("main")[0]
                feed.createFeed(main)
            });

    }
}

export function logout(main) {
    localStorage.removeItem("token")
    const navbar = document.getElementsByClassName("nav")[0]
    navbar.innerHTML=""
    createLoginForm(main)
} 