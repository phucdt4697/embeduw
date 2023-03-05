const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    .w-100 { width: 100%; height: 100%; } .w-fill { width: 100px; height: 100px; } .w-uw { width: 600px; height: 100%; }
    #hook-iframe { position: absolute !important; bottom: 0px !important; right: 0px !important; border: none !important; z-index: 100000 !important; }
`;
document.getElementsByTagName('head')[0].appendChild(style);
window.addEventListener('load', () => {
    const iframe = document.getElementById('hook-iframe');
    iframe.src="https://arterisk-uw.coachingworkspace.com";
    iframe.className='w-uw';
    iframe.contentWindow.postMessage('requestValidateClosedUW', "*");
})
window.addEventListener("resize", () => {
    const iframe = document.getElementById('hook-iframe');
    iframe.contentWindow.postMessage('requestValidateClosedUW', "*");
});
window.addEventListener("message", (event) => {
    const iframe = document.getElementById('hook-iframe');
    const resizeFixedUW = window.innerWidth > 434;
    const { name = '', isClosed = false } = event.data;
    switch (name) {
        case 'responseClosedUw':
            iframe.className = isClosed ? 'w-fill' : `${resizeFixedUW ? 'w-uw' : 'w-100'}`;
            break;
        default:
            break;
    }
}, false);