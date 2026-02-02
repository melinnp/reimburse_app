document.addEventListener("DOMContentLoaded", function () {
   
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll(".nav-link-custom");
    const navTitle = document.getElementById("nav-title");

    navLinks.forEach((link) => {
   
        link.classList.remove("nav-active");

        const linkHref = link.getAttribute("href");

       
        if (currentUrl.includes(linkHref) && linkHref !== "") {
            link.classList.add("nav-active");

           
            if (navTitle) {
                const pageName = link.innerText.trim();
                navTitle.innerHTML = `REIMBURSE<span class="text-info">APP</span> | ${pageName}`;
            }
        }
    });
});