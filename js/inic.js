function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.getElementById(id).innerHTML = data)
    .catch(error => console.error("Error al cargar el componente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Cargar componentes
    loadComponent("head", "../assets/head.html");
    loadComponent("header", "../assets/header.html");
    loadComponent("footer", "../assets/footer.html");

    const linkMov = document.getElementById("linkMov");
    const linkInv = document.getElementById("linkInv");
    
    let bodegas = JSON.parse(localStorage.getItem('bodegas'));

    if (!bodegas || !Array.isArray(bodegas)) {
      bodegas = [
        { codigo: "B001", nombre: "Caicedonia", valorSaco: 0 },
        { codigo: "B002", nombre: "Tulua", valorSaco: 0 },
        { codigo: "B003", nombre: "Sevilla", valorSaco: 0 }
      ];

      localStorage.setItem('bodegas', JSON.stringify(bodegas));

    }

  const preciosCargados = bodegas.every(b => Number(b.valorSaco) > 0);

  if (!preciosCargados) {
    [linkMov, linkInv].forEach(link => {
      link.classList.add("disabled");
      link.addEventListener("click", e => {
        e.preventDefault();
        alert("⚠️ No puedes acceder hasta que todas las bodegas tengan su precio por saco cargado.");
      });
    });
  } else {
    [linkMov, linkInv].forEach(link => link.classList.remove("disabled"));
  }
});

