import * as create from './helpers.js';

export function createLoginForm(main) {
    main.innerHTML=""
    let div = create.Div(main, false, "login-form")
    let loginForm = create.Form(div, false, "signup")
    create.Label(loginForm, false, "login-form", "Username:")
    let uname = create.Input(loginForm, "text", false, "login-form", false, "username")
    create.Label(loginForm, false, "login-form", "Password:")
    let pword = create.Input(loginForm, "password", false, "login-form", false, "password")
    create.Label(loginForm, false, "login-form", "Confirm Password:")
    let confirm = create.Input(loginForm, "password", false, "login-form", false, "confirm")
    let submit = create.Button(loginForm, "submit", false, "login-form", "Login", "login")
    submit.addEventListener("click", login)
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
    submit.addEventListener("click", register)
    let login = create.Button(loginForm, "button", false, false, "Have an account?", false)
    login.addEventListener("click", function(){createLoginForm(main)})
}

function login(event) {
    event.preventDefault()
    console.log("login")
}

function register(event) {
    event.preventDefault()
    console.log("register")
}