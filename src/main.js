import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import * as create from './helpers.js';
import * as login from './login.js'
import * as feed from './feed.js'

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.

const body = document.getElementsByTagName("body")[0]
const banner = document.getElementsByClassName("banner")[0]
const main = document.getElementsByTagName("main")[0]

let title = create.H1(banner, false, "title", "Quickpic")
title.addEventListener("click", function(){feed.createFeed(main)})

let navbar = document.createElement("ul")
navbar.className="nav"
banner.append(navbar)

let modal = create.Modal(body)

if (localStorage.hasOwnProperty('token')) {
    feed.createFeed(main)
} else {
    login.createLoginForm(main)
}

