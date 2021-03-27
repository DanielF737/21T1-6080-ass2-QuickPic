import * as create from './helpers.js'
import * as login from './login.js'
import * as profile from './profile.js'
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

    //TODO - Move this into its own function, credit images in comment
    const navbar = document.getElementsByClassName("nav")[0]
    while (navbar.firstChild) {
        navbar.removeChild(navbar.lastChild);
    }
    
    let search = document.createElement("img")
    search.setAttribute("src", "../images/fi-rr-search.svg")
    search.className="nav-item clickable"
    search.addEventListener("click", function(){followUser()})
    navbar.appendChild(search)

    let make = document.createElement("img")
    make.setAttribute("src", "../images/fi-rr-edit.svg")
    make.className="nav-item clickable"
    make.addEventListener("click", function(){post.makePostForm()})
    navbar.appendChild(make)

    let prof = document.createElement("img")
    prof.setAttribute("src", "../images/fi-rr-user.svg")
    prof.className="nav-item clickable"
    prof.addEventListener("click", function(){profile.createProfile(main)})
    navbar.appendChild(prof)
    
    let signout = document.createElement("img")
    signout.setAttribute("src", "../images/fi-rr-sign-out.svg")
    signout.className="nav-item clickable"
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

//TODO - Add commenting functionality, add text area to bottom of post, even listener on enter, append comments immediately
export function createPost(feed, post) {
    const ownPost = localStorage.getItem("uname") == post.meta.author
    let d = new Date(post.meta.published*1000); //Convert unix timestamp to milliseconds
    let wrapper = create.Div(feed, false, "post")

    let authorWrapper = create.Div(wrapper, false, "author-wrapper")
    let author = create.H2(authorWrapper, false, "feed-item clickable", post.meta.author)
    author.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, post.meta.author)})

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

    let descWrapper = create.Div(wrapper, false, "desc-wrapper")
    let desc = create.P(descWrapper, false, "feed-item", ``)
    let strong = document.createElement("strong")
    strong.textContent=`${post.meta.author}: `
    desc.appendChild(strong)
    desc.appendChild(document.createTextNode(`${post.meta.description_text}`))

    let commentWrapper = create.Div(wrapper, false, "comment-wrapper")
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
    comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

    create.P(wrapper, false, "feed-item", d.toLocaleString())

    //TODO - credit images in comment
    if (ownPost) {
        let inner = create.Div(authorWrapper, false, "inner-wrapper")
        let edit = document.createElement("img")
        edit.setAttribute("src", "../images/fi-rr-pencil.svg")
        edit.className="clickable inner-wrapper"
        inner.append(edit)
        edit.addEventListener("click", function(){editPost(post, descWrapper)})

        let del = document.createElement("img")
        del.setAttribute("src", "../images/fi-rr-trash.svg")
        del.className="clickable inner-wrapper"
        inner.append(del)
        del.addEventListener("click", function(){delPost(post.id, wrapper)})
    }
}

function viewLikes(post) {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]

    let who = create.P(content, false, false, `People who liked `)
    let strong = document.createElement("strong")
    strong.textContent=`${post.meta.author}'s `
    who.appendChild(strong)
    who.appendChild(document.createTextNode(`post:`))

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
    while (commentWrapper.firstChild) {
        commentWrapper.removeChild(commentWrapper.lastChild);
    }
    for (let i = 0; i < post.comments.length; i++) {
        let com = create.P(commentWrapper, false, "feed-item", "")
        let strong = document.createElement("strong")
        strong.textContent=`${post.comments[i].author}: `
        com.appendChild(strong)
        com.appendChild(document.createTextNode(`${post.comments[i].comment}`))

    }
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `Hide comment(s)`)
    comments.addEventListener('click', function(){hideComments(post , commentWrapper)})
      
}

function hideComments(post, commentWrapper) {
    while (commentWrapper.firstChild) {
        commentWrapper.removeChild(commentWrapper.lastChild);
    }
    let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
    comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

}

function like(heart, count, post) {
    if (heart.className === "feed-item add-like liked") {
        heart.className="feed-item add-like unliked"
        count.textContent = parseInt(count.textContent) - 1
        
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                'Authorization' : `Token ${localStorage.getItem("token")}`
            }
        }

        fetch(`${api}/post/unlike?id=${post.id}`, options)
    } else {
        heart.className="feed-item add-like liked"
        count.textContent = parseInt(count.textContent) + 1
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                'Authorization' : `Token ${localStorage.getItem("token")}`
            }
        }

        fetch(`${api}/post/like?id=${post.id}`, options)
    }
}

function followUser() {
    let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]

    let error = create.Div(content, false, "error")
    create.P(content, false, false, "Enter the username of a user to follow:")
    let input = create.Input(content, "text", false, false, "username", "username")
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

function delPost(id, object) {
    let options = {
        method: "DELETE",
        headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
        }
    }

    fetch(`${api}/post/?id=${id}`, options)
    .then(r => console.log(r))
    object.remove();

}

function editPost(post, object) {
    while (object.firstChild) {
        object.removeChild(object.lastChild);
    }

    let ta = document.createElement("textarea")
    ta.className="feed-item"
    ta.value = post.meta.description_text

    object.append(ta)

    ta.addEventListener("keypress", function(e){
        if (e.key === 'Enter') {
            let newDesc = ta.value
            while (object.firstChild) {
                object.removeChild(object.lastChild);
            }

            let desc = create.P(object, false, "feed-item", ``)
            let strong = document.createElement("strong")
            strong.textContent=`${post.meta.author}: `
            desc.appendChild(strong)
            desc.appendChild(document.createTextNode(`${newDesc}`))

            //API Call
            let data = {
                "description_text": newDesc,
                "src": post.src
            }

            let options = {
                method: "PUT",
                headers: {
                    'Content-Type' : 'application/JSON',
                    'Authorization' : `Token ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data)
            }
        
            fetch(`${api}/post/?id=${post.id}`, options)
            .then(r => console.log(r))
        }
    })

}