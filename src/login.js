import * as create from './helpers.js'
import * as feed from './feed.js'
const api = `http://localhost:5000`

//TODO - Make this not butt ugly (suck it up and do some flexbox)
/**
 * Build the login form
 * @param {*} main The 'main' DOM object (page body)
 */
export function createLoginForm(main) {
  //Remove all children from main
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }

  //Build the login form
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
  
  //Allow the user to swap to the register form
  let register = create.Button(loginForm, "button", false, false, "Dont have an account?", false)
  register.addEventListener("click", function(){createRegisterForm(main)})
}

/**
 * Build the register form
 * @param {*} main The 'main' DOM object (page body)
 */
function createRegisterForm(main) {
  //Remove all children from main
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }

  //Build the register form
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
  
  //Allow the user to swap to the login form
  let login = create.Button(loginForm, "button", false, false, "Have an account?", false)
  login.addEventListener("click", function(){createLoginForm(main)})
}

/**
 * Handles the authentication process
 * @param {string} uname supplied username
 * @param {string} pword supplied password
 * @param {string} confirm supplied password confirmation
 */
function login(uname, pword, confirm) {
  //If the passwords dont match throw an error
  if (pword!=confirm) {
    error(0)
  } else {
    //Build the payload
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
    //perform the authentication API call
    fetch(`${api}/auth/login`, options)
      .then(r => {    
        //If it fails, return an error and exit the function
        if (r.status != 200) {error(r.status); return}
        return r.json()
     })
      .then(r => {
        //Save the returned token to the local storage
        localStorage.setItem("token", r.token)
        
        let options = {
          method: "GET",
          headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${r.token}`
          }
        }
        //Save the logged in users info to the local storage
        fetch(`${api}/user`, options)
          .then(r => r.json())
          .then(r => {
            localStorage.setItem("id", r.id)
            localStorage.setItem("uname", r.username)
          })

        //Build the logged in users feed
        const main = document.getElementsByTagName("main")[0]
        feed.createFeed(main, 'user/feed')
      });

  }
}

/**
 * Handles the authentication process
 * @param {string} uname supplied username
 * @param {string} pword supplied password
 * @param {string} confirm supplied password confirmation
 * @param {string} email supplied email
 * @param {string} name supplied name
 */
function register(uname, pword, confirm, email, name) {
  //If the passwords dont match throw an error
  if (pword!=confirm) {
    error(0)
  } else {
    //Build the payload
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

    //perform the authentication API call
    fetch(`${api}/auth/signup`, options)
      .then(r => {    
        //If it fails, return an error and exit the function
        if (r.status != 200) {error(r.status); return}
        return r.json()
      })
      .then(r => {
        //Save the returned token to the local storage
        localStorage.setItem("token", r.token)
        
        let options = {
          method: "GET",
          headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${r.token}`
          }
        }

        //Save the logged in users info to the local storage
        fetch(`${api}/user`, options)
          .then(r => r.json())
          .then(r => {
            localStorage.setItem("id", r.id)
            localStorage.setItem("uname", r.username)
          })

        //Build the logged in users feed
        const main = document.getElementsByTagName("main")[0]
        feed.createFeed(main, 'user/feed')
      });
      

  }
}

/**
 * Performs a logout
 * @param {*} main The 'main' DOM object (page body)
 */
export function logout(main) {
  //Remove the users token from local storage (log them out)
  localStorage.removeItem("token")

  //Remove logged in elements from the sidebar
  const navbar = document.getElementsByClassName("nav")[0]
  while (navbar.firstChild) {
    navbar.removeChild(navbar.lastChild);
  }

  //Show the login form
  createLoginForm(main)
} 

/**
 * Handles errors during login based on error code
 * @param {number} error error code from the API
 */
function error(error) {
  //Prepare the errpor div by making it visible and removing all children
  let div = document.getElementsByClassName("error")[0]
  while (div.firstChild) {
      div.removeChild(div.lastChild);
  }
  div.style.display="block"

  //Add the error close button
  let close = document.createElement("span")
  close.className="close"
  close.textContent="x"
  div.append(close)

  //Build the error message dependant on the error code
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

  //Add the logic to the close button
  close.addEventListener('click', function(){
      div.style.display = "none";
      while (div.firstChild) {
          div.removeChild(div.lastChild);
      }
  })
}