import * as create from './helpers.js'
import * as login from './login.js'
import * as profile from './profile.js'
const api = `http://localhost:5000`

export function createFeed(main) {
    if (!localStorage.hasOwnProperty('token')) {
        login.createLoginForm(main)
    }
    main.innerHTML=""

    const navbar = document.getElementsByClassName("nav")[0]
    navbar.innerHTML=""
    let prof = document.createElement("li")
    prof.className="nav-item"
    prof.textContent="My Profile"
    prof.addEventListener("click", function(){profile.createProfile(main)})
    navbar.appendChild(prof)
    
    let signout = document.createElement("li")
    signout.className="nav-item"
    signout.textContent="Sign Out"
    signout.addEventListener("click", function(){login.logout(main)})
    navbar.appendChild(signout)

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
                createPost(document.getElementsByClassName("feed")[0], r.posts[i])
            }
        });

}

export function createPost(feed, post) {
    let d = new Date(post.meta.published*1000); //Convert unix timestamp to milliseconds
    let wrapper = create.Div(feed, false, "post")
    create.H2(wrapper, false, "feed-item", post.meta.author)
    create.Img(wrapper, false, "feed-item", post.src)

    let likewrapper = create.Div(wrapper, false, "like-wrapper")
    let heart
    if (post.meta.likes.includes(parseInt(localStorage.getItem("id")))) {
        heart = create.P(likewrapper, false, "feed-item add-like liked", `♥`)
    } else {
        heart = create.P(likewrapper, false, "feed-item add-like unliked", `♥`)
    }

    let likes = create.P(likewrapper, false, "feed-item view-comment", `${post.meta.likes.length}`)
    likes.addEventListener('click', function(){viewLikes(post)})

    heart.addEventListener("click", function(){like(heart, likes, post)})

    create.P(wrapper, false, "feed-item", `<strong>${post.meta.author}</strong> ${post.meta.description_text}`)

    let commentWrapper = create.Div(wrapper, false, "comment-wrapper")
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
    comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

    create.P(wrapper, false, "feed-item", d.toLocaleString())
}

function viewLikes(post) {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]
    create.P(content, false, false, `People who liked <strong>${post.meta.author}</strong>'s post:`)
    content.style.width = "15%";

    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
        }
    }

    fetch(`${api}/post/?id=${post.id}`, options)
        .then(r => r.json())
        .then(r => {
            let likes = r.meta.likes

            for (let i = 0; i < likes.length; i++) {

                let options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        'Authorization' : `Token ${localStorage.getItem("token")}`
                    }
                }

                fetch(`${api}/user/?id=${likes[i]}`, options)
                    .then(r => r.json())
                    .then(r => {
                        create.P(document.getElementsByClassName("modal-content")[0], false, false, r.username)
                    })
            }
    })
    
}

function viewComments(post, commentWrapper) {
    commentWrapper.innerHTML=""
    for (let i = 0; i < post.comments.length; i++) {
        create.P(commentWrapper, false, "feed-item", `<strong>${post.comments[i].author}</strong>: ${post.comments[i].comment}`)
    }
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `Hide comment(s)`)
    comments.addEventListener('click', function(){hideComments(post , commentWrapper)})
      
}

function hideComments(post, commentWrapper) {
    commentWrapper.innerHTML=""
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
    comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

}

function like(heart, count, post) {
    if (heart.className === "feed-item add-like liked") {
        heart.className="feed-item add-like unliked"
        count.innerHTML = parseInt(count.textContent) - 1
        
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                'Authorization' : `Token ${localStorage.getItem("token")}`
            }
        }

        fetch(`${api}/post/unlike?id=${post.id}`, options)
            .then(r => r.json())
            .then(r => {
                console.log(r)
            })
    } else {
        heart.className="feed-item add-like liked"
        count.innerHTML = parseInt(count.textContent) + 1
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                'Authorization' : `Token ${localStorage.getItem("token")}`
            }
        }

        fetch(`${api}/post/like?id=${post.id}`, options)
            .then(r => r.json())
            .then(r => {
                console.log(r)
            })
    }

    //Do the unliking
}