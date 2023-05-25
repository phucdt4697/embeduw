const tagIds = {
    style: '_universal-widget',
    iframe: 'hook-iframe',
    script: 'script-embed',
}
const types = {
    css: 'text/css',
}
const title = 'universal-widget';
const classes = {
    wuw: 'w-uw',
    w100: 'w-100',
    wfill: 'w-fill',
}
const postmessage = {
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
    .w-100 { width: 100%; height: 100%; } .w-fill { width: 100px; height: 100px; } .w-uw { width: 600px; height: 100%; }
    #hook-iframe { position: fixed !important; bottom: 0px !important; right: 0px !important; border: none !important; z-index: 100000 !important; }
    `;
    document.head.insertBefore(style, document.head.firstElementChild);
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
        iframe.src = `${endpoint}/?${qs.keys().length ? qs.entries((key, value) => `${key}=${value}`).join('&') : ''}`;
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