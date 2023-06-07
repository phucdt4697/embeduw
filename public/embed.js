var tagIds = {
    style: '_universal-widget',
    iframe: 'hook-iframe',
    script: 'script-embed',
}
var types = {
    css: 'text/css',
}
var title = 'universal-widget';
var classes = {
    wuw: 'w-uw',
    w100: 'w-100',
    wfill: 'w-fill',
}
var postmessage = {
    validateClose: 'requestValidateClosedUW',
    closed: 'responseClosedUw'
}

if (document.body && !document.getElementById(tagIds.iframe)) {
    generateIframe();
}
if (!document.getElementById(tagIds.style)) {
    generateStyle();
}

function generateStyle() {
    const style = document.createElement('style');
    style.type = types.css;
    style.id = tagIds.style;
    style.innerHTML = `
    .w-100 { width: 100%; height: min(870px, 80%); } .w-fill { width: 100px; height: 100px; } .w-uw { width: 446px; height: min(870px, 80%); }
    #hook-iframe { 
        position: fixed !important; bottom: 0px !important; right: 0px !important; border: none !important; z-index: 100000 !important;
        rgba(0, 0, 0, 0.1) -55px -45px 25px -55px
    }
    `;
    document.head.insertBefore(style, document.head.firstElementChild);
}

function _pipe(fa, fb) { return function (arg) { return fa(fb(arg)) } };
function pipe(...funcs) { return funcs.reduce(_pipe) }

function fomartToQueryString(query) {
    const [key, value] = query;
    return `${key}=${value}`;
}

function convertIterableToArray(qs) {
    return Array.from(qs);
}

function buildQueryString(values) {
    return values.map(fomartToQueryString).join('&');
}

function generateIframe() {
    // dynamic create iframe
    const qs = new URLSearchParams(new URL(document.getElementById(tagIds.script).src).search);
    const endpoint = qs.get('endpoint');
    qs.delete('endpoint');
    if (endpoint) {
        const iframe = document.createElement("iframe");
        iframe.id = tagIds.iframe;
        iframe.title = title;
        iframe.src = `${endpoint}/?${pipe(buildQueryString, convertIterableToArray)(qs.entries())}`;
        iframe.className = classes.wuw;
        document.body.appendChild(iframe);
        // push message to uw
        setTimeout(() => {
            resizeWindow();
            iframe.contentWindow.postMessage(postmessage.validateClose, "*");
        }, 5000)
    }
}

function resizeWindow() {
    const iframe = document.getElementById(tagIds.iframe);
    iframe.contentWindow.postMessage(postmessage.validateClose, "*");
}

window.addEventListener('load', () => {
    generateIframe();
});

window.addEventListener("resize", () => {
    resizeWindow();
});

window.addEventListener("message", (event) => {
    const iframe = document.getElementById(tagIds.iframe);
    const resizeFixedUW = window.innerWidth > 434;
    const { name = '', isClosed = false } = event.data;
    switch (name) {
        case postmessage.closed:
            iframe.className = isClosed ? classes.wfill : `${resizeFixedUW ? classes.wuw : classes.w100}`;
            break;
        default:
            break;
    }
}, false);