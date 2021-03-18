function ScrollToBottom(pageIndex){
    if (pageIndex > 1){
        let footer = document.querySelector("#footercontent")
        window.scrollTo(0, footer.offsetTop);
    }
}

function showContent(elementId) {
    let element = document.getElementById(elementId);
    element.classList.toggle("hidden")
}
