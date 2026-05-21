document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     UTILIDAD: aplica el tema y sincroniza todos los íconos
     ===================================================== */
  function applyTheme(isDark) {
    document.documentElement.classList.toggle("dark-theme", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    // Sincronizar todos los botones de toggle (navbar + FAB)
    document.querySelectorAll(".theme-toggle-icon").forEach(function (icon) {
      icon.className = isDark ? "bi bi-sun theme-toggle-icon" : "bi bi-moon-stars theme-toggle-icon";
    });
  }

  /* =====================================================
     BOTÓN DE TEMA EN EL NAVBAR (pantallas lg+)
     ===================================================== */
  var navToggle = document.getElementById("themeToggle");
  if (navToggle) {
    // Aseguramos que el ícono tenga la clase utilitaria
    var navIcon = navToggle.querySelector("i");
    if (navIcon) navIcon.classList.add("theme-toggle-icon");

    navToggle.addEventListener("click", function () {
      var isDark = document.documentElement.classList.contains("dark-theme");
      applyTheme(!isDark);
    });
  }

  /* =====================================================
     FAB FLOTANTE MODO CLARO/OSCURO (sm + md)
     ===================================================== */
  var fabTheme = document.getElementById("fabThemeToggle");
  if (fabTheme) {
    var fabIcon = fabTheme.querySelector("i");
    if (fabIcon) fabIcon.classList.add("theme-toggle-icon");

    fabTheme.addEventListener("click", function () {
      var isDark = document.documentElement.classList.contains("dark-theme");
      applyTheme(!isDark);
    });
  }

  // Sincronizar íconos según el tema guardado al cargar la página
  var savedTheme = localStorage.getItem("theme");
  var isDarkOnLoad = savedTheme === "dark";
  document.querySelectorAll(".theme-toggle-icon").forEach(function (icon) {
    icon.className = isDarkOnLoad ? "bi bi-sun theme-toggle-icon" : "bi bi-moon-stars theme-toggle-icon";
  });

  /* =====================================================
     FAB VOLVER ARRIBA
     ===================================================== */
  var fabScrollTop = document.getElementById("fabScrollTop");
  if (fabScrollTop) {
    // Mostrar/ocultar según scroll
    window.addEventListener("scroll", function () {
      if (window.scrollY > 250) {
        fabScrollTop.classList.add("visible");
      } else {
        fabScrollTop.classList.remove("visible");
      }
    }, { passive: true });

    // Click: scroll suave al inicio
    fabScrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =====================================================
     FORMULARIO NEWSLETTER (sin alerts, sin recargas)
     ===================================================== */
  var form = document.querySelector("#newsletterModal form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var modalBody = form.closest(".modal-body");

      // Crear o reutilizar el banner de éxito
      var alertMsg = document.getElementById("newsletterSuccessAlert");
      if (!alertMsg) {
        alertMsg = document.createElement("div");
        alertMsg.id = "newsletterSuccessAlert";
        alertMsg.className = "alert alert-success mt-3 text-center py-3";
        alertMsg.role = "alert";
        alertMsg.innerHTML =
          '<i class="bi bi-patch-check-fill mr-2"></i> ¡Gracias por suscribirte a El Observador!';
        modalBody.appendChild(alertMsg);
      }

      // Ocultar formulario y mostrar mensaje
      form.style.display = "none";
      alertMsg.style.display = "block";

      // Cerrar modal y resetear tras 2 segundos
      setTimeout(function () {
        if (typeof $ !== "undefined") {
          $("#newsletterModal").modal("hide");
        }
        setTimeout(function () {
          form.reset();
          form.style.display = "block";
          alertMsg.style.display = "none";
        }, 500);
      }, 2000);
    });
  }
});
