import * as create from './helpers.js'
const api = `http://localhost:5000`

export function makePostForm() {
  let modal = document.getElementById("modal")
  modal.style.display="block"
  let content = document.getElementsByClassName("modal-content")[0]

  create.H2(content, false, false, "Make a post:")
  let image = create.Input(content, "file", false, false, false, false).setAttribute("accept", "image/png")
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