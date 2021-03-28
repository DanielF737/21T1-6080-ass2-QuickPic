import * as create from './helpers.js'
import * as login from './login.js'
import * as post from './post.js'
const api = `http://localhost:5000`

/**
 * Build the feed on the application main page when a user is signed in
 * @param {*} main The 'main' DOM object (page body)
 */
export function createFeed(main) {
  //If the user is not signed in, return to the sign in page
  if (!localStorage.hasOwnProperty('token')) {
    login.createLoginForm(main)
  }

  //Remove all children from body of the page
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }

  //Remove existing event listeners
    window.removeEventListener('scroll', infiniteScroll)

  //Build the signed in user navbar
  create.navbar()

  //Create the feed wrapper div
  let feed = create.Div(main, "homeFeed", "feed")

  //Add the loading spinner
  let loader = document.createElement("div")
  loader.className="loader"
  feed.appendChild(loader)

  let options = {
    method: "GET",
    headers: {
      'Content-Type' : 'application/JSON',
      'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }

  //Make an API call to get the current users feed
  fetch(`${api}/user/feed`, options)
    .then(r => r.json())
    .then(r => {
      //For each post in the feed, build the post object
      loader.remove()

      //Scroll to the top of the page
      document.body.scrollTop = 0 //Safari
      document.documentElement.scrollTop = 0 //Chrome Firefox IE

      for (let i = 0; i < r.posts.length; i++) {
        post.createPost(feed, r.posts[i])
      }

      //start the infinite scroll
      window.addEventListener("scroll", infiniteScroll)
    });

}

/**
 * Function allow users to follow other users from their feed page via a 
 * text input (not otherwise possible to follow new users)
 */
export function followUser() {
  //Display the modal over the page
  let modal = document.getElementById("modal")
  modal.style.display="block"
  let content = document.getElementsByClassName("modal-content")[0]

  //Prepare the error message
  let error = create.Div(content, false, "error")
  create.P(content, false, false, "Enter the username of a user to follow:")
  let input = create.Input(content, "text", false, false, false, "username")
  let submit = create.Button(content, "submit", false, false, "Follow", "follow")

  submit.addEventListener("click", function(e){
    e.preventDefault() //Prevent the page from refreshing

    let options = {
      method: "PUT",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      }
    }

    //Preform the follow user API call
    fetch(`${api}/user/follow?username=${input.value}`, options)
      .then(r => {
        //If the call fails (an ivalid username is entered)
        if (r.status != 200) {
          //Show the error and remove any previous error messages
          error.style.display="block"
          while (error.firstChild) {
              error.removeChild(error.lastChild);
          }

          //Add the apropriate error message (user not found)
          let err = create.P(error, false, "error-text", "")
          let strong = document.createElement("strong")
          strong.textContent="Error: "
          err.appendChild(strong)

          err.appendChild(document.createTextNode("User not found"))
        } else {
          //If a valid username is entered, display the updated feed and hide any errors
          error.style.display="none"
          createFeed(document.getElementsByTagName("main")[0])
        }
    })

  })

  //Adjust the width of the modal
  content.style.width = "15%";
}

/**
 * Allows infninite scrolling of the page rather than pagination by making additional API calls
 * as the user approaches the bottom of the page
 */
function infiniteScroll() {
  let feed = document.getElementById("homeFeed")
  let windowHeight = window.pageYOffset
  let total = windowHeight+ window.innerHeight
  //If the scrolled ammount is greater than the height of the feed
  if (total >= feed.offsetHeight) {
    //If there are no more posts to load, remove the listener and exit
    if (document.getElementById("no-more")) {
      window.removeEventListener('scroll', infiniteScroll)
      return
    }
    //If we are alread loading more posts, exit
    if (document.getElementById("inf-scroll-loader")) {return}

    //Add the loading spinner
    let loader = document.createElement("div")
    loader.id="inf-scroll-loader"
    loader.className="loader"
    feed.appendChild(loader)
    
    //Load the next posts
    let options = {
      method: "GET",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      }
    }

    //Set the number of posts to load and the starting index of the posts to load
    let n = 5
    let pos = feed.childElementCount

    //Make an API call to get the next posts
    fetch(`${api}/user/feed?p=${pos-1}&n=${n}`, options)
      .then(r => r.json())
      .then(r => {
        //For each post in the feed, build the post object
        loader.remove()
        for (let i = 0; i < r.posts.length; i++) {
          post.createPost(feed, r.posts[i])
        }
        
        //If no additonal posts are loaded, add an error
        if(r.posts.length == 0) {
          create.P(feed, "no-more", false, "No more posts, try following some more users")
        }
    })
  }
}