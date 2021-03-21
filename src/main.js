import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import * as create from './helpers.js';
import * as login from './login.js'
import * as feed from './feed.js'

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
api.makeAPIRequest('dummy/user')
    .then(r => console.log(r));

const main = document.getElementsByTagName("main")[0]
if (localStorage.hasOwnProperty('token')) {
    feed.createFeed(main)
} else {
    login.createLoginForm(main)
}

