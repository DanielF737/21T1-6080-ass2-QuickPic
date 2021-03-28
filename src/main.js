import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import * as create from './helpers.js';
import * as login from './login.js'
import * as feed from './feed.js'


//Grab the important page elements
const body = document.getElementsByTagName("body")[0]
const banner = document.getElementsByClassName("banner")[0]
const main = document.getElementsByTagName("main")[0]

//Build the page title/home button
let title = create.H1(banner, false, "title", "Quickpic")
title.addEventListener("click", function(){feed.createFeed(main)})

//Build the navbar
let navbar = document.createElement("ul")
navbar.className="nav"
banner.append(navbar)

//prep the modal
create.Modal(body)

//Check if there is a user token and redirect accordingly
if (localStorage.hasOwnProperty('token')) {
    feed.createFeed(main)
} else {
    login.createLoginForm(main)
}

