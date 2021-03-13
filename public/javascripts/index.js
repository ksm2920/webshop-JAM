function ScrollToBottom(pageIndex){
    if (pageIndex > 1){
        let footer = document.querySelector("#footercontent")
        console.log(footer);
        window.scrollTo(0, footer.offsetTop);
    }
}
