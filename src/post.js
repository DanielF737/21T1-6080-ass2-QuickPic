import * as create from './helpers.js'
import * as profile from './profile.js'
const api = `http://localhost:5000`

/**
 * Builds a post object and appends it to the feed wrapper
 * @param {*} feed The feed wrapper the post is to be appended to
 * @param {*} post Raw post data (from API)
 */
export function createPost(feed, post) {
  //Determine whether the author of the post is the currently loggen in user
  const ownPost = localStorage.getItem("uname") == post.meta.author

  //Create the post wrapper
  let wrapper = create.Div(feed, false, "post")

  //Add an invisible paragraph containg the post ID (sneaky trick to order posts on profile pages)
  let postId = create.P(wrapper, false, "id", post.id)
  postId.style.display="none"

  //Create a wrapper for the author name and add the author name to it
  let authorWrapper = create.Div(wrapper, false, "author-wrapper")
  let author = create.H2(authorWrapper, false, "feed-item clickable", post.meta.author)
  author.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, post.meta.author)})

  //Add the image to the post
  let image = create.Img(wrapper, false, "feed-item", post.src)
  image.setAttribute("alt", "") //Set alt text to blank

  //Create a wrapper for the like info
  let likewrapper = create.Div(wrapper, false, "like-wrapper")
  
  //Add the heart icon and style it dependent on whether the post has been liked by the logged in user
  let heart
  if (post.meta.likes.includes(parseInt(localStorage.getItem("id")))) {
    heart = create.P(likewrapper, false, "feed-item add-like liked", `♥`)
  } else {
    heart = create.P(likewrapper, false, "feed-item add-like unliked", `♥`)
  }
  //Make the like button interactable
  heart.addEventListener("click", function(){like(heart, likes, post)})

  //Add the like count to the post and make it clickable
  let likes = create.P(likewrapper, false, "feed-item view-comment", `${post.meta.likes.length}`)
  likes.addEventListener('click', function(){viewLikes(post)})

  //Build the description
  let descWrapper = create.Div(wrapper, false, "desc-wrapper")
  let desc = create.P(descWrapper, false, "feed-item", ``)
  let strong = document.createElement("strong")
  
  //Make the users name clickable directing to the users profile
  strong.className="clickable"
  strong.textContent=`${post.meta.author}`
  strong.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, post.meta.author)})
  desc.appendChild(strong)

  //Append the description text
  desc.appendChild(document.createTextNode(`: ${post.meta.description_text}`))

  //Build the comment section, add the comment count and reveal comments button
  let commentWrapper = create.Div(wrapper, false, "comment-wrapper")
  let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${post.comments.length} comment(s)`)
  comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

  //Convert the UNIX date to a readable format and add it to the post
  let d = new Date(post.meta.published*1000)
  create.P(wrapper, false, "feed-item", d.toLocaleString())

  //Add the new comment field to the post, add event listener
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

  //Icons used with permission from flaticon.com uicons collection
  /*If the user is viewing one of their own posts, add edit and delete buttons to the
    Top of the post (author wrapper)*/
  if (ownPost) {
    let inner = create.Div(authorWrapper, false, "inner-wrapper")
    let edit = document.createElement("img")
    edit.setAttribute("src", "../images/fi-rr-pencil.svg")
    edit.setAttribute("alt", "Edit post")
    edit.className="clickable inner-wrapper"
    inner.append(edit)
    edit.addEventListener("click", function(){editPost(post, descWrapper)})

    let del = document.createElement("img")
    del.setAttribute("src", "../images/fi-rr-trash.svg")
    del.setAttribute("alt", "Delete post")
    del.className="clickable inner-wrapper"
    inner.append(del)
    del.addEventListener("click", function(){delPost(post.id, wrapper)})
  }
}

/**
 * Displays the make new post modal
 */
export function makePostForm() {
  //Display the modal
  let modal = document.getElementById("modal")
  modal.style.display="block"
  let content = document.getElementsByClassName("modal-content")[0]

  //Prepare the error message div
  create.Div(content, false, "error")

  //Build the form contents
  create.H2(content, false, false, "Make a post:")
  let upload = create.Input(content, "file", "upload", "upload-file", false, false).setAttribute("accept", "image/png")
  let btn = create.Button(content, "button", false, false, "Upload your image", false)
  btn.addEventListener("click", function(){document.getElementById("upload").click()}) //redirect the onclick event for style purposes
  create.P(content, false, false, "Enter a description for your image:")
  let desc = document.createElement("textarea")
  desc.className="upload"
  desc.setAttribute("placeholder", "An interesting description...")
  desc.setAttribute("value", "An interesting description...")
  content.append(desc)

  content.append(document.createElement("br"))

  //Add the submit button
  let submit = create.Button(content, "submit", false, false, "Make Post", "post")
  submit.addEventListener("click", function(e){e.preventDefault();makePost(document.querySelector('input[type="file"]').files[0], desc.value)})

  //Adjust the modal width
  content.style.width = "30%";
}

/**
 * Handles the submission of a new post to the POST /post/ endpoint on the backend
 * converts image to base64 encoding and sends to the backend
 * @param {File} image image file
 * @param {string} desc post description
 * @returns 
 */
function makePost(image, desc) {
  //Prepare the error message div
  let error = document.getElementsByClassName("error")[0]

  //If an image isnt provided, display an apropriate error and exit out of function
  if(!image) {error.style.display="block"
    while (error.firstChild) {
      error.removeChild(error.lastChild);
    }

    let err = create.P(error, false, "error-text", "")
    let strong = document.createElement("strong")
    strong.textContent="Error: "
    err.appendChild(strong)

    err.appendChild(document.createTextNode("Please fill all fields"))
    return
  }

  //Convert the image to base64 encoding
  create.fileToDataUrl(image)
  .then(r => {
    //Remove the metadata from the image string
    let img = r.replace("data:image/png;base64,", "")

    //Build the payload
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

    //Make the API call
    fetch(`${api}/post`, options)
    .then(r => {
      //If the posts suceeds remove the modal
      if (r.status==200) {
        modal.style.display="none"
      } else {
        //If the post fails display and apropriate error message (no description)
        error.style.display="block"
        while (error.firstChild) {
          error.removeChild(error.lastChild);
        }

        let err = create.P(error, false, "error-text", "")
        let strong = document.createElement("strong")
        strong.textContent="Error: "
        err.appendChild(strong)

        err.appendChild(document.createTextNode("Please fill all fields"))
      }
    })
  })
}

/**
 * View the list of all users who have liked a specified post in a modal
 * @param {*} post post raw info from the backend 
 */
function viewLikes(post) {
  //Prepare and display the modal
  let modal = document.getElementById("modal")
  modal.style.display="block"
  let content = document.getElementsByClassName("modal-content")[0]

  //Add the header text tp the modal and adjust the width
  let who = create.P(content, false, false, `People who liked `)
  let strong = document.createElement("strong")
  strong.textContent=`${post.meta.author}'s `
  who.appendChild(strong)
  who.appendChild(document.createTextNode(`post:`))

  content.style.width = "15%";

  //Show a loading spinner while the API call is happening
  let loader = document.createElement("div")
  loader.className="loader"
  content.appendChild(loader)

  let options = {
    method: "GET",
    headers: {
      'Content-Type' : 'application/JSON',
      'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }
  //Get an updates list of users who have liked the post (incase the current user has liked)
    //Propably the least efficient way to do this but also the easiest
  fetch(`${api}/post/?id=${post.id}`, options)
    .then(r => r.json())
    .then(r => {
      //For each user ID in likes, get the users name
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
            //Add the users name to the modal, remove the loading spinner
            loader.remove()
            create.P(document.getElementsByClassName("modal-content")[0], false, false, r.username)
          })
        }
  })
  
}

/**
 * Event function to append all the comments on a post to the post, and
 * add a hide comments button
 * @param {*} post 
 * @param {*} commentWrapper 
 */
function viewComments(post, commentWrapper) {
  while (commentWrapper.firstChild) {
    commentWrapper.removeChild(commentWrapper.lastChild);
  }

  //Add the loading spinner
  let loader = document.createElement("div")
  loader.className="loader"
  commentWrapper.appendChild(loader)

  let options = {
    method: "GET",
    headers: {
      'Content-Type' : 'application/JSON',
      'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }
  //Get the updated comment list (incase user has made any comments since page load)
  fetch(`${api}/post/?id=${post.id}`, options)
    .then(r => r.json())
    .then(r => {
      loader.remove()
      let coms = r.comments.reverse() //order the comments chronilogically
      //Add each comment to the page
      for (let i = 0; i < coms.length; i++) {
        let com = create.P(commentWrapper, false, "feed-item", "")

        //add the commenters name, and make clicking it redirect to commenters pofile
        let strong = document.createElement("strong")
        strong.textContent=`${r.comments[i].author}`
        strong.className="clickable"
        strong.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, coms[i].author)})
        
        com.appendChild(strong)
        com.appendChild(document.createTextNode(`: ${coms[i].comment}`))
      }

      //Add the hide comments button
      let comments = create.P(commentWrapper, false, "feed-item view-comment", `Hide comment(s)`)
      comments.addEventListener('click', function(){hideComments(r, commentWrapper)})
    })
}

function hideComments(post, commentWrapper) {
  //Remove all comments from the comments wrapper and update the comment count incase the user
  //made a comment while the comments were expanded
  let count = commentWrapper.childNodes.length - 1 
  while (commentWrapper.firstChild) {
    commentWrapper.removeChild(commentWrapper.lastChild);
  }
  let comments = create.P(commentWrapper, false, "feed-item view-comment", `View all ${count} comment(s)`)
  comments.addEventListener('click', function(){viewComments(post , commentWrapper)})

}

/**
 * Adds or removes a like to the specified post from the current logged in user
 * @param {*} heart like button heart object
 * @param {*} count like count object 
 * @param {*} post post data from backend
 */
function like(heart, count, post) {
  //Check if the post is already liked
  if (heart.className === "feed-item add-like liked") {
    //Update the visual element and decrement the like counter
    heart.className="feed-item add-like unliked"
    count.textContent = parseInt(count.textContent) - 1
    
    let options = {
      method: "PUT",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      }
    }
    //Send the unlike to the backend
    fetch(`${api}/post/unlike?id=${post.id}`, options)
  } else {
    //Update the visual element and increment the like counter
    heart.className="feed-item add-like liked"
    count.textContent = parseInt(count.textContent) + 1
    let options = {
      method: "PUT",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      }
    }
    //Send the like to the backend
    fetch(`${api}/post/like?id=${post.id}`, options)
  }
}

/**
 * Handles the deleting of a post from the backend and the frontend
 * @param {number} id The posts ID 
 * @param {*} object The post object in the feed
 */
function delPost(id, object) {
  let options = {
    method: "DELETE",
    headers: {
      'Content-Type' : 'application/JSON',
      'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }
  //Remove the post from the backend
  fetch(`${api}/post/?id=${id}`, options)
  object.remove() //remove the object from the feed 

}

/**
 * Handles the updating of a posts description
 * @param {*} post the post object from the backend
 * @param {*} object the post's description wrapper object in the frontend
 */
function editPost(post, object) {
  //remove all elements from the description wrapper
  while (object.firstChild) {
    object.removeChild(object.lastChild);
  }

  //Add a text area containing the previous description text
  let ta = document.createElement("textarea")
  ta.className="feed-item"
  ta.value = post.meta.description_text
  object.append(ta)

  //When the enter button is pressed in the text area, submit the changes
  ta.addEventListener("keypress", function(e){
    if (e.key === 'Enter') {
      e.preventDefault()
      let newDesc = ta.value
      //Remove the text area
      while (object.firstChild) {
        object.removeChild(object.lastChild);
      }

      //Add a parargraph object to the wrapper containing the users name and updated description
      let desc = create.P(object, false, "feed-item", ``)
      let strong = document.createElement("strong")

      //Make the authors name clickable and redirects to their profile page
      strong.textContent=`${post.meta.author}`
      strong.className="clickable"
      strong.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, post.meta.author)})
      
      //Append the new description
      desc.appendChild(strong)
      desc.appendChild(document.createTextNode(`: ${newDesc}`))

      //Build the payload
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
      //Make the api call
      fetch(`${api}/post/?id=${post.id}`, options)
    }
  })

}

/**
 * Allows the currently logged in user to add a comment to a post
 * @param {*} ta The add comment text area
 * @param {*} wrapper the comment wrapper object
 * @param {string} id 
 * @returns 
 */
function addComment(ta, wrapper, id) {
  //Trim the whitespace from the comment
  let comment = ta.value.trim()

  //If the comment is blank, exit and dont post
  if (comment == "") {return}

  //Create a new paragraph to hold the comment object
  let com = document.createElement("p")
  com.className = "feed-item"

  //Make the users name clickable and redirects to the users profile
  let strong = document.createElement("strong")
  strong.textContent=`${localStorage.getItem("uname")}`
  strong.className="clickable"
  strong.addEventListener("click", function(){profile.createProfile(document.getElementsByTagName("main")[0], false, localStorage.getItem("uname"))})
      
  //Append the new comments
  com.appendChild(strong)
  com.appendChild(document.createTextNode(`: ${comment}`))

  //Add the comment to the post above the hide/reveal comments button
  wrapper.insertBefore(com, wrapper.lastChild)

  //Increase the comment count number
  let view = wrapper.getElementsByClassName("view-comment")[0]
  let num = parseInt(view.textContent.split(" ")[2])
  if (!isNaN(num)) {
    view.textContent=`View all ${num+1} comment(s)`
  }

  //Clear the text area
  ta.value=""
  

  //Build the payload
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
  //Make the API call
  fetch(`${api}/post/comment?id=${id}`, options)
}