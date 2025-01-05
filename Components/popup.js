const popup = document.querySelector("#popup");
const popupContent = document.querySelector("#popup-content");
const settingsIcon = document.querySelector("#settings-icon");

settingsIcon.addEventListener("click", () => {
    popup.classList.toggle("popup-show");
});

popup.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("popup-show");
});

popupContent.addEventListener("click", (e) => {
    console.log("popup content cliked")
    e.stopPropagation();
});