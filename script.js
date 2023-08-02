document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem("notes")) {
        document.querySelector(".notes").innerHTML = localStorage.getItem("notes");
    }
});

function addNote() {
    localStorage.setItem("notes", document.querySelector(".noteinput").value);
}