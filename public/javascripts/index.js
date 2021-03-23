function ScrollToBottom(pageIndex){
    if (pageIndex > 1){
        let footer = document.querySelector("#footercontent");
        window.scrollTo(0, footer.offsetTop);
    }
}

function showContent(elementId) {
    let element = document.getElementById(elementId);
    element.classList.toggle("hidden");
}


function loadMore(pageIndex){
    console.log("xyz");
    
    console.log(pageIndex);
    pageIndex++;
    $("#pageIndex").attr("value",pageIndex);
    console.log(pageIndex);
    $("#form_productList").submit();
    
}
