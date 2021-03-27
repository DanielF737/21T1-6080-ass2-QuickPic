import * as create from './helpers.js'
const api = `http://localhost:5000`

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

  let ta = document.createElement("textarea")
  ta.className="add-comment"
  ta.placeholder="Write a comment..."
  ta.addEventListener("keypress", function(e){
    if (e.key === 'Enter'){
      e.preventDefault()
      addComment(ta, commentWrapper, post.id)
    }
  })
  wrapper.appendChild(ta)

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

//TODO - meaningful comments and javadocs
export function makePostForm() {
  let modal = document.getElementById("modal")
  modal.style.display="block"
  let content = document.getElementsByClassName("modal-content")[0]

  create.H2(content, false, false, "Make a post:")
  create.Input(content, "file", false, false, false, false).setAttribute("accept", "image/png")
  create.P(content, false, false, "Enter a description for your image:")
  let desc = document.createElement("textarea")
  desc.setAttribute("placeholder", "An interesting description...")
  desc.setAttribute("value", "An interesting description...")
  content.append(desc)

  content.append(document.createElement("br"))

  let submit = create.Button(content, "submit", false, false, "Make Post", "post")
  submit.addEventListener("click", function(e){e.preventDefault();makePost(document.querySelector('input[type="file"]').files[0], desc.value)})

  content.style.width = "30%";
}

//TODO - Throw an error when no desc or image (400 - malformed request)
function makePost(image, desc) {
  create.fileToDataUrl(image)
  .then(r => {
    let img = r.replace("data:image/png;base64,", "")

    let data = {
      "description_text": desc,
      "src": img 
    }

    let options = {
      method: "POST",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    }

    fetch(`${api}/post`, options)
    .then(r => {
      if (r.status==200) {
        modal.style.display="none"
      }
      return r.json()
    })
  })
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
      for (let i = 0; i < r.comments.length; i++) {
        let com = create.P(commentWrapper, false, "feed-item", "")
        let strong = document.createElement("strong")
        strong.textContent=`${r.comments[i].author}: `
        com.appendChild(strong)
        com.appendChild(document.createTextNode(`${r.comments[i].comment}`))
      }
      let comments = create.P(commentWrapper, false, "feed-item view-comment", `Hide comment(s)`)
      comments.addEventListener('click', function(){hideComments(r, commentWrapper)})
    })
}

function hideComments(post, commentWrapper) {
  let count = commentWrapper.childNodes.length - 1 
  while (commentWrapper.firstChild) {
    commentWrapper.removeChild(commentWrapper.lastChild);
  }
  let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${count} comment(s)`)
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

function delPost(id, object) {
  let options = {
    method: "DELETE",
    headers: {
      'Content-Type' : 'application/JSON',
      'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }

  fetch(`${api}/post/?id=${id}`, options)
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
    }
  })

}

function addComment(ta, parent, id) {
  let comment = ta.value.trim()
  if (comment == "") {return}
    let com = document.createElement("p")
    com.className = "feed-item"
    let strong = document.createElement("strong")
    strong.textContent=`${localStorage.getItem("uname")}: `
    com.appendChild(strong)
    com.appendChild(document.createTextNode(comment))

    parent.insertBefore(com, parent.lastChild)

    let view = parent.getElementsByClassName("view-comment")[0]
    let num = parseInt(view.textContent.split(" ")[2])
    console.log(num != NaN)
    if (!isNaN(num)) {
      view.textContent=`View all ${num+1} comment(s)`
    }

    ta.value=""
    
    let data = {
      "comment": comment
    }

    let options = {
      method: "PUT",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    }

    fetch(`${api}/post/comment?id=${id}`, options)
}