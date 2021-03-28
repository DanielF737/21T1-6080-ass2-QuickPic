import * as create from './helpers.js'
import * as post from './post.js'
import * as feed from './feed.js'
const api = `http://localhost:5000`

/**
 * Check if the current user is following a user by making an API call to
 * GET /user/ and checking if the specified user is present in the following
 * list 
 * @param {number} id the id of the other user
*/
function isFollowing(id) {
  let options = {
      method: "GET",
      headers: {
          'Content-Type' : 'application/JSON',
          'Authorization' : `Token ${localStorage.getItem("token")}`
      }
  }

  //No query strings to return the user object of the currently signed in user (based on auth token)
  fetch(`${api}/user/`, options)
  .then(r => r.json())
  .then(r => {
    //If the specified user is in the current users following list, return true
    if (r.following.includes(id)) {return true}
  })

  //else return false
  return false
}

/**
 * Creates the profile card and profile feed on the profile page
 * @param {*} main The 'main' DOM object (page body)
 * @param {number} id Id of the profile to create
 * @param {string} username username of the profile to create
 */
export function createProfile(main, id, username) {
  while (main.firstChild) {
      main.removeChild(main.lastChild);
  }

  //Scroll to the top of the page
  document.body.scrollTop = 0 //Safari
  document.documentElement.scrollTop = 0 //Chrome Firefox IE
  //Remove existing event listeners
  window.removeEventListener('scroll', feed.infiniteScroll)

  //Adjust the query strings based on the supplied paramters
  let query
  if (id) {
    query = `/user/?id=${id}`
  } else if(username) {
    query = `/user/?username=${username}`
  } else {
    query = `/user/`
  }

  //Build the page structure
  let info = create.Div(main, false, "feed")
  let profile = create.Div(info, false, "post")
  
  
  //Add the loading spinner
  let loader = document.createElement("div")
  loader.className="loader"
  info.appendChild(loader)
  
  let options = {
    method: "GET",
    headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }
  //Preform the API call specified above
  fetch(`${api}${query}`, options)
    .then(r => r.json())
    .then(r => {
      document.getElementsByClassName("loader")[0].remove()

      //check if the profile returned is the current users own profile
      const ownProf = localStorage.getItem("id") == r.id

      //Add profile information to profile card
      let row1 = create.Div(profile, false, "profile-wrapper")

      let uname = create.H1(row1, false, "feed-item", "")
      let strong = document.createElement("strong")
      strong.textContent=`${r.username} `
      uname.appendChild(strong)

      let cell1 = create.Div(row1, false, "cell")
      
      let p = create.P(cell1, false, "feed-item", ``)
      strong = document.createElement("strong")
      strong.textContent=`${r.posts.length} `
      p.appendChild(strong)
      p.appendChild(document.createTextNode("posts"))

      let followers = create.P(cell1, false, "feed-item", ``)
      strong = document.createElement("strong")
      strong.textContent=`${r.followed_num} `
      followers.appendChild(strong)
      followers.appendChild(document.createTextNode("followers"))

      let following = create.P(cell1, false, "feed-item clickable", ``)
      strong = document.createElement("strong")
      strong.textContent=`${r.following.length} `
      following.appendChild(strong)
      following.appendChild(document.createTextNode("following"))

      //add an event listener to allow users to view the following list
      following.addEventListener("click", function(){showFollowing(r)})

      
      let row2 = create.Div(profile, false, "space-evenly")
      
      strong = document.createElement("strong")
      strong.textContent=`${r.name}`
      create.P(row2, false, "feed-item", "Name: ").appendChild(strong)
      
      strong = document.createElement("strong")
      strong.textContent=`${r.email}`
      create.P(row2, false, "feed-item", "Email: ").appendChild(strong)

      //Change button context depending on whether a user is viewing their own profile
      if (ownProf) {
        //Allow the user to edit their own profile
        let editBtn = create.Button(row2, "button", false, "follow", "Edit Profile", "edit")
        editBtn.addEventListener("click", function(){editProfile(r, row2, editBtn)})
      } else {
        //Allow the user to follow/unfollow other users from their profile
        let follow
        if (isFollowing(r.id)) {
          follow = create.Button(row2, "button", false, "follow", "Follow", "follow")
        } else {
          follow = create.Button(row2, "button", false, "unfollow", "Unfollow", "follow")
        }
        follow.addEventListener("click", function(){followUser(r, follow, followers)})
      }

        
      //Add the loading spinner
      let loader = document.createElement("div")
      loader.className="loader"
      info.appendChild(loader)
      //For each of the post ID's specified in the users profile object
      for (let i = 0; i < r.posts.length; i++) {
        let options = {
          method: "GET",
          headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
          }
        }

        //Make an API call to get the post info to be displayed on the profile
        fetch(`${api}/post/?id=${r.posts[i]}`, options)
        .then(r => r.json())
        .then(r => {
          loader.remove()
          post.createPost(info, r)
          return r
        })
        //Sort the posts in reverse chronilogical order (the fun of asynchronous programming!)
        .then(r => sortPosts(main.getElementsByClassName("feed")[0]))
      }
  });

}

/**
 * Given a user, show the other users that user is following
 * @param {*} user user object
 */
function showFollowing(user) {
  let modal = document.getElementById("modal")
    modal.style.display="block"
    let content = document.getElementsByClassName("modal-content")[0]

    let who = create.P(content, false, false, `Users followed by `)
    let strong = document.createElement("strong")
    strong.textContent=`${user.username}: `
    who.appendChild(strong)

    content.style.width = "15%";

    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
        }
    }

    //For each user ID in the list, make an API call to determine the users name
    for (let i = 0; i < user.following.length; i++) {
      fetch(`${api}/user/?id=${user.following[i]}`, options)
          .then(r => r.json())
          .then(r => {
              create.P(document.getElementsByClassName("modal-content")[0], false, false, r.username)
          })
    }
}

/**
 * Context sensitive event function to allow users to either display text inputs to edit
 * their profile or submit data in said text inputs and reflect updated data on the profile
 * while also submitting data to the backend
 * @param {*} user user object of the current profile
 * @param {*} row row dom object where the information will be entered/displayed
 * @param {*} button Submit button
 */
function editProfile(user, row, button) {
  //If the user is submitting their changes
  if (button.textContent=="Done") { 

    //Read data from text inputs
    let name = row.childNodes[0].value.trim()
    let email = row.childNodes[1].value.trim()
    let password = row.childNodes[2].value.trim()

    //Remove all elements from the div
    while(row.firstChild) {
      row.removeChild(row.lastChild)
    }
    
    //Build payload based on submitted data
    let data = {
      "name": name,
      "email" : email 
    }

    //If a new password has been specified, add it to the payload
    if (password != "") {
      data.password = password
    }

    let options = {
      method: "PUT",
      headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    }

    //Submit new data to backend
    fetch(`${api}/user`, options)
    .then(r => {

      //Reflect new data on the frontend
      let strong = document.createElement("strong")
      strong.textContent=`${name}`
      create.P(row, false, "feed-item", "Name: ").appendChild(strong)
      
      strong = document.createElement("strong")
      strong.textContent=`${email}`
      create.P(row, false, "feed-item", "Email: ").appendChild(strong)
  
      let updated = user
      updated.name = name
      updated.email = email
      let btn = create.Button(row, "button", false, false, "Edit Profile", false)
      btn.addEventListener("click", function(e){e.preventDefault();editProfile(user, row, btn)})
    })
  } else { //If the user wants to edit their profile
    //Remove all elements fromt the div
    while(row.firstChild) {
      row.removeChild(row.lastChild)
    }

    //Replace elements with text inputs
    let name = create.Input(row, "text", false, "edit-profile", user.name, user.name)
    let email = create.Input(row, "text", false, "edit-profile", user.email, user.email)
    let password = create.Input(row, "password", false, "edit-profile", "", "password")
    let btn = create.Button(row, "submit", false, "edit-profile", "Done", false)

    btn.addEventListener("click", function(e){e.preventDefault();editProfile(user, row, btn)})
  }
}

/**
 * Context sensitive event function allowing users to follow/unfollow other users from their profile,
 * and reflecting said change on the profile
 * @param {*} user user object
 * @param {*} button follow button dom object
 * @param {*} followers followers count paragraph object
 */
function followUser(user, button, followers) {
  //Build payload (this doesnt change between follow and unfollow)
  let options = {
    method: "PUT",
    headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }

  //If performing a follow
  if (button.textContent=="Follow") {
    //Make the follow API call
    fetch(`${api}/user/follow?username=${user.username}`, options)

    //Increase the follower count of the profile
    let strong = document.createElement("strong")
    strong.textContent=`${parseInt(followers.textContent.split(" ")[0]) + 1} `
    followers.textContent=""
    followers.appendChild(strong)
    followers.appendChild(document.createTextNode("followers"))

    //Update the button context
    button.textContent="Unfollow"
    button.className="unfollow"
  } else {
    //Make the unfollow API call
    fetch(`${api}/user/unfollow?username=${user.username}`, options)

    //Decrease the follower count of the profile
    let strong = document.createElement("strong")
    strong.textContent=`${parseInt(followers.textContent.split(" ")[0]) - 1} `
    followers.textContent=""
    followers.appendChild(strong)
    followers.appendChild(document.createTextNode("followers"))

    //Update the button context
    button.textContent="Follow"
    button.className="follow"
  }
}

//Sorts the posts on the profile page (the get for each of them causes them to be occasionally out of order)
function sortPosts(feed) {
  //Remove all post children and add them to an array
    //The first child in the feed div on a profile page is the profile info so ignore that
  let posts = []
  while (feed.firstChild.nextSibling) {
    posts.push(feed.lastChild)
    feed.removeChild(feed.lastChild);
  }

  //Sort the posts based on their ID (higher id = newer post)
  posts.sort(function(a,b ){
    let aId = parseInt(a.getElementsByClassName("id")[0].textContent)
    let bId = parseInt(b.getElementsByClassName("id")[0].textContent)
    return bId - aId
  })

  //Re-append the sorted posts in order
  for (let i = 0; i < posts.length; i++) {
    feed.append(posts[i])
  }
}