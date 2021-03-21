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
    let d = new Date();
    d.setTime(post.meta.published)
    let time = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
    let wrapper = create.Div(feed, false, "post")
    create.P(wrapper, false, "feed-item", post.meta.author)
    // create.P(wrapper, false, "feed-item",)
    create.Img(wrapper, false, "feed-item", post.src)
    create.P(wrapper, false, "feed-item", `${post.meta.likes.length} Likes - ${post.comments.length} comments`)
    create.P(wrapper, false, "feed-item", post.meta.description_text)
    create.P(wrapper, false, "feed-item", time)
}