import * as create from './helpers.js'
import * as login from './login.js'
import * as post from './post.js'
const api = `http://localhost:5000`

//TODO - meaningful comments and javadocs
//TODO - Infinite scroll, when approaching the bottom of the page load the next 5 or so of feed (base index off number of "post" elements)
    //if run out of posts display warnings and stop attempting
export function createFeed(main) {
    if (!localStorage.hasOwnProperty('token')) {
        login.createLoginForm(main)
    }
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }

    create.navbar()

    let feed = create.Div(main, false, "feed")

    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
        }
    }

    fetch(`${api}/user/feed`, options)
        .then(r => r.json())
        .then(r => {
            for (let i = 0; i < r.posts.length; i++) {
                post.createPost(document.getElementsByClassName("feed")[0], r.posts[i])
            }
        });

}

function followUser() {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]

    let error = create.Div(content, false, "error")
    create.P(content, false, false, "Enter the username of a user to follow:")
    let input = create.Input(content, "text", false, false, false, "username")
    let submit = create.Button(content, "submit", false, false, "Follow", "follow")

    submit.addEventListener("click", function(e){
        e.preventDefault()

        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                'Authorization' : `Token ${localStorage.getItem("token")}`
            }
        }

        fetch(`${api}/user/follow?username=${input.value}`, options)
        .then(r => {
                if (r.status != 200) {
                error.style.display="block"
                while (error.firstChild) {
                    error.removeChild(error.lastChild);
                }

                let err = create.P(error, false, "error-text", "")
                let strong = document.createElement("strong")
                strong.textContent="Error: "
                err.appendChild(strong)

                err.appendChild(document.createTextNode("User not found"))
            } else {
                error.style.display="none"
                createFeed(document.getElementsByTagName("main")[0])
            }
        })

    })

    content.style.width = "15%";

}