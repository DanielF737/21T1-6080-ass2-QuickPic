import * as profile from './profile.js'
import * as post from './post.js'
import * as login from './login.js'
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

/**
 * Creates a div element in the dom appending it to the specified parent and with
 * the optionally specified id and classname
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @returns div element
 */
export function Div(parent, id, cl) {
    let elem = document.createElement("div")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

/**
 * Creates a form element in the dom appending it to the specified parent and with
 * the optionally specified id and classname
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @returns form element
 */
export function Form (parent, id, cl) {
    let elem = document.createElement("form")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

/**
 * Creates an input element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows specification of value and placeholder
 * text
 * @param {*} parent The parent object for this object 
 * @param {string} type The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} value a string containing the objects value
 * @param {string} placeholder a string containing the objects placeholder text
 * @returns input element
 */
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

/**
 * Creates a button element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows specification of value and name
 * @param {*} parent The parent object for this object 
 * @param {string} type The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} value a string containing the objects value
 * @param {*} name a string containing the objects name
 * @returns button element
 */
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

/**
 * Creates a label element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns label element
 */
export function Label(parent, id, cl, text) {
    let elem = document.createElement("label")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

/**
 * Creates a break element in the dom appending it to the specified parent
 * @param {*} parent the parent object for this object
 * @returns break element
 */
export function Br(parent) {
    let elem = document.createElement("br")
    parent.append(elem)
    return elem
}

/**
 * Creates a paragraph element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns paragraph element
 */
export function P (parent, id, cl, text) {
    let elem = document.createElement("p")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text} 
    parent.append(elem)
    return elem
}

/**
 * Creates a heading1 element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns heading1 element
 */
export function H1 (parent, id, cl, text) {
    let elem = document.createElement("h1")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

/**
 * Creates a heading2 element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns heading2 element
 */
export function H2 (parent, id, cl, text) {
    let elem = document.createElement("h2")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

/**
 * Creates a heading3 element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns heading3 element
 */
export function H3 (parent, id, cl, text) {
    let elem = document.createElement("h3")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

/**
 * Creates a heading4 element in the dom appending it to the specified parent and with
 * the optionally specified id and classname, allows the specification of objects text
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {string} text a string containing the objects text content 
 * @returns heading4 element
 */
export function H4 (parent, id, cl, text) {
    let elem = document.createElement("h4")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}

/**
 * Creates an image element in the dom SPECIFICALLY SPECIFIED BY A BASE64 DATA STRING appending it to 
 * the specified parent and with the optionally specified id and classname, allows the specification of 
 * the image base64 data string
 * @param {*} parent The parent object for this object 
 * @param {string} id a string containing the objects id
 * @param {string} cl a string containing the objects class name
 * @param {*} src a string containg the image base64 data string
 * @returns image element
 */
export function Img (parent, id, cl, src) {
    let elem = document.createElement("img")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (src) {elem.src=`data:image/png;base64,${src}`}
    parent.append(elem)
    return elem

}

/**
 * Helper function to initiate modal to be used across the rest off the app
 * @param {*} main the main DOM element (page body)
 * @returns modal div element
 */
export function Modal (main) {
    //Build the modal background
    let modal = Div(main, "modal", "modal")
    main.appendChild(modal)

    //Build the modal content
    let content = Div(modal, false, "modal-content")

    //Add the close button, add the event listener and logic
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

    // If the user clicks on the background (outside of the content) close the modal
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

/**
 * helper function to build the navbar elements for a signed in user
 */
export function navbar() {
    //Get and clear the navbar element
    const navbar = document.getElementsByClassName("nav")[0]
    while (navbar.firstChild) {
        navbar.removeChild(navbar.lastChild);
    }
    
    //Build the buttons, adding relevant alt text and event listeners to the images
    let search = document.createElement("img")
    search.setAttribute("src", "../images/fi-rr-search.svg")
    search.setAttribute("alt", "Search for a user")
    search.className="nav-item clickable"
    search.addEventListener("click", function(){feed.followUser()})
    navbar.appendChild(search)

    let make = document.createElement("img")
    make.setAttribute("src", "../images/fi-rr-edit.svg")
    make.setAttribute("alt", "Make a post")
    make.className="nav-item clickable"
    make.addEventListener("click", function(){post.makePostForm()})
    navbar.appendChild(make)

    let main=document.getElementsByTagName("main")[0]

    let prof = document.createElement("img")
    prof.setAttribute("src", "../images/fi-rr-user.svg")
    prof.setAttribute("alt", "View your profile")
    prof.className="nav-item clickable"
    prof.addEventListener("click", function(){profile.createProfile(main)})
    navbar.appendChild(prof)
    
    let signout = document.createElement("img")
    signout.setAttribute("src", "../images/fi-rr-sign-out.svg")
    signout.setAttribute("alt", "Sign out")
    signout.className="nav-item clickable"
    signout.addEventListener("click", function(){login.logout(main)})
    navbar.appendChild(signout)
}