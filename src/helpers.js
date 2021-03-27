import * as profile from './profile.js'
import * as feed from './feed.js'

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

/*A bunch of functions to create dom elements to make my 
main code look nicer (and so I dont have to write the same code over
and over again to achieve the same thing)*/

export function Div(parent, id, cl) {
    let elem = document.createElement("div")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

export function Form (parent, id, cl) {
    let elem = document.createElement("form")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

export function Input(parent, type, id, cl, value, placeholder) {
    let elem = document.createElement("input")
    elem.type=type
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (value) {elem.value=value}
    if (placeholder) {elem.placeholder=placeholder}
    parent.append(elem)
    return elem
}

export function Button(parent, type, id, cl, value, name) {
    let elem = document.createElement("button")
    elem.type=type
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (value) {elem.value=value; elem.textContent=value}
    if (name) {elem.name=name}
    parent.append(elem)
    return elem
}

export function Label(parent, id, cl, text) {
    let elem = document.createElement("label")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

export function Br(parent) {
    let elem = document.createElement("br")
    parent.append(elem)
    return elem
}

export function P (parent, id, cl, text) {
    let elem = document.createElement("p")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text} 
    parent.append(elem)
    return elem
}

export function H1 (parent, id, cl, text) {
    let elem = document.createElement("h1")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

export function H2 (parent, id, cl, text) {
    let elem = document.createElement("h2")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

export function H3 (parent, id, cl, text) {
    let elem = document.createElement("h3")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

export function H4 (parent, id, cl, text) {
    let elem = document.createElement("h4")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

export function Img (parent, id, cl, src) {
    let elem = document.createElement("img")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (src) {elem.src=`data:image/png;base64,${src}`}
    parent.append(elem)
    return elem

}


//Helper function to initiate modal to be used across the rest off the app
export function Modal (main) {
    let modal = Div(main, "modal", "modal")
    main.appendChild(modal)

    let content = Div(modal, false, "modal-content")

    let close = document.createElement("span")
    close.className="close"
    close.textContent="x"
    content.appendChild(close)

    close.addEventListener('click', function(){
        modal.style.display = "none";
        while (content.firstChild) {
            content.removeChild(content.lastChild);
        }
        content.appendChild(close)

    })
    window.onclick = function(e) {
        if (e.target==modal) {
            modal.style.display="none"
            while (content.firstChild) {
                content.removeChild(content.lastChild);
            }
            content.appendChild(close)
        }
    }

    return modal
}

//helper function to build the navbar elements for a signed in user
export function navbar() {
    const navbar = document.getElementsByClassName("nav")[0]
    while (navbar.firstChild) {
        navbar.removeChild(navbar.lastChild);
    }
    
    let search = document.createElement("img")
    search.setAttribute("src", "../images/fi-rr-search.svg")
    search.className="nav-item clickable"
    search.addEventListener("click", function(){feed.followUser()})
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
}