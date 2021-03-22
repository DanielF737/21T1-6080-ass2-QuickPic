import * as create from './helpers.js'
import * as login from './login.js'
const api = `http://localhost:5000`

export function createFeed(main) {
    if (!localStorage.hasOwnProperty('token')) {
        login.createLoginForm(main)
    }
    main.innerHTML=""

    const navbar = document.getElementsByClassName("nav")[0]
    let btn = document.createElement("li")
    btn.className="nav-item"
    btn.textContent="Sign Out"
    btn.addEventListener("click", function(){login.logout(main)})
    navbar.appendChild(btn)

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
            console.log(r)
            for (let i = 0; i < r.posts.length; i++) {
                createPost(document.getElementsByClassName("feed")[0], r.posts[i])
            }
        });

}

function createPost(feed, post) {
    let d = new Date(post.meta.published*1000); //Convert unix timestamp to milliseconds
    let wrapper = create.Div(feed, false, "post")
    create.H2(wrapper, false, "feed-item", post.meta.author)
    create.Img(wrapper, false, "feed-item", post.src)
    let likes = create.P(wrapper, false, "feed-item view-comment", `${post.meta.likes.length} Likes`)
    likes.addEventListener('click', function(){viewLikes(post)})
    create.P(wrapper, false, "feed-item", `<strong>${post.meta.author}</strong> ${post.meta.description_text}`)
    let comments = create.P(wrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
    comments.addEventListener('click', function(){viewComments(post)})
    create.P(wrapper, false, "feed-item", d.toLocaleString())
}

function viewLikes(post) {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]
    create.P(content, false, false, `Likes for post ID: ${post.id}`)
}

function viewComments(post) {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]
    create.P(content, false, false, `Comments for post ID: ${post.id}`)    
}