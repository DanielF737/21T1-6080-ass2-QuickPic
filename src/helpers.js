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
export function createDiv(parent, id, cl) {
    let elem = document.createElement("div")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

export function createForm (parent, id, cl) {
    let elem = document.createElement("form")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    parent.append(elem)
    return elem
}

export function createInput(parent, type, id, cl, value, placeholder) {
    let elem = document.createElement("input")
    elem.type=type
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (value) {elem.value=value}
    if (placeholder) {elem.placeholder=placeholder}
    parent.append(elem)
    return elem
}

export function createButton(parent, type, id, cl, value, name) {
    let elem = document.createElement("button")
    elem.type=type
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (value) {elem.value=value}
    if (name) {elem.name=name}
    parent.append(elem)
    return elem
}

export function createLabel(parent, id, cl, text) {
    let elem = document.createElement("label")
    if (id) {elem.id=id}
    if (cl) {elem.className=cl}
    if (text) {elem.textContent=text}
    parent.append(elem)
    return elem
}