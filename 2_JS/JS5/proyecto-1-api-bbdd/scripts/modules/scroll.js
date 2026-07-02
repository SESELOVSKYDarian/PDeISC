export function controlarBotonSubir(botonSubir) {
  if (window.scrollY > 220) {
    botonSubir.classList.add("visible");
    return;
  }

  botonSubir.classList.remove("visible");
}

export function subirArriba() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

