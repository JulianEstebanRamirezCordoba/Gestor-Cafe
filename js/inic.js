function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.getElementById(id).innerHTML = data)
    .catch(error => console.error("Error al cargar el componente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("head", "../assets/head.html");
  loadComponent("header", "../assets/header.html");
  loadComponent("footer", "../assets/footer.html");
});
