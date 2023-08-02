document.addEventListener("DOMContentLoaded", function() {
    getNotes();
});

function getNotes() {
    document.querySelector(".noteinput").value = "";
    if(localStorage.getItem("notes")) {
        document.querySelector(".notes").innerHTML = localStorage.getItem("notes");
    }

}

function addNote() {
    localStorage.setItem("notes", document.querySelector(".noteinput").value);
    getNotes();
}