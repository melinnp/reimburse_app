document.addEventListener("DOMContentLoaded", function () {
  
    let currentPath = window.location.pathname.split("/").pop();
    
    if (currentPath === "") {
        currentPath = "admindash.html";
    }

    const navLinks = document.querySelectorAll(".nav-link-custom");
    const navTitle = document.getElementById("nav-title");

    navLinks.forEach((link) => {
        link.classList.remove("nav-active");

        const linkHref = link.getAttribute("href").split("/").pop();

        if (currentPath === linkHref) {
            link.classList.add("nav-active");

            if (navTitle) {
                const pageName = link.innerText.trim();
                navTitle.innerHTML = `REIMBURSE<span class="text-info">APP</span> | ${pageName}`;
            }
        }
    });
});