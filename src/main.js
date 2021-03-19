import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl,  createDiv, createForm,  createInput,  createLabel,  createButton } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
api.makeAPIRequest('dummy/user')
    .then(r => console.log(r));

const main = document.getElementsByTagName("main")[0]
createLoginForm()

function createLoginForm() {
    main.innerHTML=""
    let login = createDiv(main, false, "login-form")
    let loginForm = createForm(login, false, "signup")
    createLabel(loginForm, false, "login-form", "Username:")
    let uname = createInput(loginForm, "text", false, false, false, "username")
    createLabel(loginForm, false, "login-form", "Password:")
    let pword = createInput(loginForm, "password", false, false, false, "password")
    createLabel(loginForm, false, "login-form", "Confirm Password:")
    let confirm = createInput(loginForm, "password", false, false, false, "confirm")
}
