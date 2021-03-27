import * as create from './helpers.js'
import * as feed from './feed.js'
const api = `http://localhost:5000`

export function createLoginForm(main) {
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }

    let div = create.Div(main, false, "login-form")
    create.Div(div, false, "error")
    let loginForm = create.Form(div, false, "signup")
    
    create.Label(loginForm, false, "login-form", "Username:")
    let uname = create.Input(loginForm, "text", false, "login-form", false, "username")

    create.Label(loginForm, false, "login-form", "Password:")
    let pword = create.Input(loginForm, "password", false, "login-form", false, "password")

    create.Label(loginForm, false, "login-form", "Confirm Password:")
    let confirm = create.Input(loginForm, "password", false, "login-form", false, "confirm")

    loginForm.append(document.createElement("br"))

    let submit = create.Button(loginForm, "submit", false, "login-form", "Login", "login")
    submit.addEventListener("click", function(e){e.preventDefault();login(uname.value, pword.value, confirm.value)})
    let register = create.Button(loginForm, "button", false, false, "Dont have an account?", false)
    register.addEventListener("click", function(){createRegisterForm(main)})
}

function createRegisterForm(main) {
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }

    let div = create.Div(main, false, "login-form")
    create.Div(div, false, "error")
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
    
    loginForm.append(document.createElement("br"))

    let submit = create.Button(loginForm, "submit", false, "login-form", "Register", "register")
    submit.addEventListener("click", function(e){e.preventDefault();register(uname.value, pword.value, confirm.value, email.value, name.value)})
    let login = create.Button(loginForm, "button", false, false, "Have an account?", false)
    login.addEventListener("click", function(){createLoginForm(main)})
}

function login(uname, pword, confirm) {
    if (pword!=confirm) {
        error(0)
    } else {
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
        .then(r => {    
            if (r.status != 200) {error(r.status); return}
            return r.json()
        })
        .then(r => {
            localStorage.setItem("token", r.token)
            
            let options = {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/JSON',
                    'Authorization' : `Token ${r.token}`
                }
            }
    
            fetch(`${api}/user`, options)
                .then(r => r.json())
                .then(r => {
                    localStorage.setItem("id", r.id)
                    localStorage.setItem("uname", r.username)
                })

            const main = document.getElementsByTagName("main")[0]
            feed.createFeed(main, 'user/feed')
        });

    }
}

function register(uname, pword, confirm, email, name) {
    if (pword!=confirm) {
        error(0)
    } else {
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
            .then(r => {    
                if (r.status != 200) {error(r.status); return}
                return r.json()
            })
            .then(r => {
                localStorage.setItem("token", r.token)
                
                let options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        'Authorization' : `Token ${r.token}`
                    }
                }
        
                fetch(`${api}/user`, options)
                    .then(r => r.json())
                    .then(r => {
                        localStorage.setItem("id", r.id)
                        localStorage.setItem("uname", r.username)
                    })

                const main = document.getElementsByTagName("main")[0]
                feed.createFeed(main, 'user/feed')
            });
        

    }
}

export function logout(main) {
    localStorage.removeItem("token")
    const navbar = document.getElementsByClassName("nav")[0]
    while (navbar.firstChild) {
        navbar.removeChild(navbar.lastChild);
    }
    createLoginForm(main)
} 

function error(error) {
    let div = document.getElementsByClassName("error")[0]
    while (div.firstChild) {
        div.removeChild(div.lastChild);
    }
    div.style.display="block"

    let close = document.createElement("span")
    close.className="close"
    close.textContent="x"
    div.append(close)

    let err = create.P(div, false, "error-text", "")
    let strong = document.createElement("strong")
    strong.textContent="Error: "
    err.appendChild(strong)
    if (error == 0) {
        err.appendChild(document.createTextNode("Passwords do not match"))
    } else if (error == 400) {
        err.appendChild(document.createTextNode("Missing username or password"))
    } else if (error == 403) {
        err.appendChild(document.createTextNode("Invalid username or password"))
    } else if (error == 409) {
        err.appendChild(document.createTextNode("Username already taken"))
    } else {
        err.appendChild(document.createTextNode("Unknown"))
    }

    close.addEventListener('click', function(){
        div.style.display = "none";
        while (div.firstChild) {
            div.removeChild(div.lastChild);
        }
    })
}