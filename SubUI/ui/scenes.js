/* SubUI JS - Scene Manager */

let currentPage = 0;
let previousPage = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Podíváme se, co je v URL za hashem (např. z "#/settings" získáme "settings")
    // Pokud tam nic není, hashSlug bude prázdný text ""
    const hashSlug = window.location.hash.replace("#/", "");
    
    let page = "page1"; // Výchozí stránka

    // Pokud v URL něco bylo, zkusíme najít stránku s tímto data-url
    if (hashSlug) {
        const matchedPage = document.querySelector(`.hrefPage[data-url="${hashSlug}"]`);
        
        // Pokud jsme takovou stránku našli, vezmeme její ID (např. "page2")
        if (matchedPage) {
            page = matchedPage.id;
        }
    }

    showPage(page);
    topbarLayout();
});

window.addEventListener("popstate", () => {
    const hashSlug = window.location.hash.replace("#/", "");
    let page = "page1";

    if (hashSlug) {
        const matchedPage = document.querySelector(`.hrefPage[data-url="${hashSlug}"]`);
        if (matchedPage) {
            page = matchedPage.id;
        }
    }

    showPage(page);
});

window.addEventListener("resize", topbarLayout);

// Main function to switch pages
function showPage(targetId) {
    const activePage = document.getElementById(targetId);
    if (!activePage) return;

    // Switch active class on pages
    const pages = document.querySelectorAll(".hrefPage");
    pages.forEach(page => page.classList.remove("active"));
    activePage.classList.add("active");

    // Track pages
    previousPage = currentPage;
    currentPage = targetId;

    // Handle bottombar visibility
    const bottombar = document.querySelector(".bottombar");
    if (bottombar) {
        if (activePage.dataset.bottombar === "none") {
            bottombar.style.display = "none";
        } else {
            bottombar.style.display = "flex";
        }
    }

    // Handle topbar visibility
    const topbar = document.querySelector(".topbar");
    if (topbar) {
        if (activePage.dataset.topbar === "none") {
            topbar.style.display = "none";
        } else {
            topbar.style.display = "flex";
        }
    }

    // Update topbar title dynamic text from data-topbar attribute
    const titleText = activePage.dataset.topbar;
    const topbarTitle = document.querySelector(".topbar h1");
    if (topbarTitle && titleText && titleText !== "none" && titleText !== "show") {
        topbarTitle.innerText = titleText;
    }

    const urlSlug = activePage.dataset.url; // Načte hodnotu z data-url

    // Pokud data-url existuje a není nastaveno na "none"
    if (urlSlug && urlSlug !== "none") {
        // Vytvoříme novou cestu (např. /menu nebo /settings)
        const newUrl = window.location.origin + window.location.pathname + "#/" + urlSlug;
        
        // pushState změní URL v prohlížeči bez reloadu stránky
        // Používáme hash (#/), protože to funguje skvěle na GitHub Pages i lokálně na PC
        window.history.pushState({ pageId: targetId }, "", newUrl);
    } else {
        const newUrl = window.location.origin + window.location.pathname + "#/";
        window.history.pushState({ pageId: targetId }, "", newUrl);
    }

    const bottombarButtons = document.querySelectorAll(".bottombar button");
    
    bottombarButtons.forEach(button => {
        const onClickText = button.getAttribute("onclick") || "";
        
        // Kontrola, jestli onclick obsahuje ID stránky v uvozovkách
        if (onClickText.includes(`'${targetId}'`) || onClickText.includes(`"${targetId}"`)) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// .backButton function
const backButtons = document.querySelectorAll(".backButton");
backButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showPage(previousPage);
    });
});

function topbarLayout() {
    const topbarMain = document.querySelector(".topbarMain");
    const h1 = document.querySelector(".topbarMain h1");
    
    const sides = document.querySelectorAll(".topbarMain .topbarSide");
    
    if (!topbarMain || !h1 || sides.length < 2) return;
    if (window.innerWidth >= 768) {
        sides[0].after(sides[1]);
        topbarMain.appendChild(h1);
    } else {
        topbarMain.insertBefore(h1, sides[1]);
    }
}

// Debug shortcut (Ctrl + Y)
window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "y" && event.ctrlKey) {
        console.log(currentPage + " currentPage");
        console.log(previousPage + " previousPage");
    }
});