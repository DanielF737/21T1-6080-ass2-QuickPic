import * as create from './helpers.js'
import * as post from './post.js'
const api = `http://localhost:5000`

//TODO - meaningful comments and javadocs
function isFollowing(id) {
  let options = {
      method: "GET",
      headers: {
          'Content-Type' : 'application/JSON',
          'Authorization' : `Token ${localStorage.getItem("token")}`
      }
  }
  fetch(`${api}/user/`, options)
  .then(r => r.json())
  .then(r => {
    if (r.following.includes(id)) {return true}
  })

  return false
}

export function createProfile(main, id, username) {
  while (main.firstChild) {
      main.removeChild(main.lastChild);
  }

  let query

  if (id) {
    query = `/user/?id=${id}`
  } else if(username) {
    query = `/user/?username=${username}`
  } else {
    query = `/user/`
  }

  let info = create.Div(main, false, "feed")
  let profile = create.Div(info, false, "post")
  
  let options = {
    method: "GET",
    headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
    }
}

  fetch(`${api}${query}`, options)
    .then(r => r.json())
    .then(r => {
      const ownProf = localStorage.getItem("id") == r.id

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

      following.addEventListener("click", function(){showFollowing(r)})

      
      let row2 = create.Div(profile, false, "space-evenly")
      
      strong = document.createElement("strong")
      strong.textContent=`${r.name}`
      create.P(row2, false, "feed-item", "Name: ").appendChild(strong)
      
      strong = document.createElement("strong")
      strong.textContent=`${r.email}`
      create.P(row2, false, "feed-item", "Email: ").appendChild(strong)

      if (ownProf) {
        let edit = create.Button(row2, "button", false, false, "Edit Profile", "edit")
        edit.addEventListener("click", editProfile(r, row2, edit))
      } else {
        let follow
        if (isFollowing(r.id)) {
          follow = create.Button(row2, "button", false, false, "Follow", "follow")
        } else {
          follow = create.Button(row2, "button", false, false, "Unfollow", "follow")
        }
        follow.addEventListener("click", function(){followUser(r, follow, followers)})
      }

      let posts = r.posts.reverse()

      for (let i = 0; i < posts.length; i++) {
        let options = {
          method: "GET",
          headers: {
            'Content-Type' : 'application/JSON',
            'Authorization' : `Token ${localStorage.getItem("token")}`
          }
        }


        fetch(`${api}/post/?id=${posts[i]}`, options)
        .then(r => r.json())
        .then(r => {
          post.createPost(document.getElementsByClassName("feed")[0], r)
        })
      }
  });

}

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

    for (let i = 0; i < user.following.length; i++) {
      fetch(`${api}/user/?id=${user.following[i]}`, options)
          .then(r => r.json())
          .then(r => {
              create.P(document.getElementsByClassName("modal-content")[0], false, false, r.username)
          })
    }
}

//TODO - implement this - change P to text inputs, change button to submit, make API call
function editProfile(user, row, button) {
  if (button.textContent="done") {
    button.textContent="Edit Profile"

    //read the text areas, make the api call, change back to P

  } else {

    //change to text areas, add password

    button.textContent="done"
  }
}

function followUser(user, button, followers) {
  let options = {
    method: "PUT",
    headers: {
        'Content-Type' : 'application/JSON',
        'Authorization' : `Token ${localStorage.getItem("token")}`
    }
  }
  if (button.textContent=="Follow") {
    fetch(`${api}/user/follow?username=${user.username}`, options)

    let strong = document.createElement("strong")
    strong.textContent=`${parseInt(followers.textContent.split(" ")[0]) + 1} `
    followers.textContent=""
    followers.appendChild(strong)
    followers.appendChild(document.createTextNode("followers"))

    button.textContent="Unfollow"
  } else {
    fetch(`${api}/user/unfollow?username=${user.username}`, options)

    let strong = document.createElement("strong")
    strong.textContent=`${parseInt(followers.textContent.split(" ")[0]) - 1} `
    followers.textContent=""
    followers.appendChild(strong)
    followers.appendChild(document.createTextNode("followers"))

    button.textContent="Follow"
  }
}
