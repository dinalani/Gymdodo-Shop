"use strict";

let searchTimeout = null; 

async function initShop() {
    await fetchAllTags();
    initEventListeners();
    updateUIFromURL();
    ladeShop();
}

function initEventListeners() {
    document.querySelectorAll('.sidebar-category').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            updateFilters({ category: this.getAttribute('data-category') });
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => updateFilters({ search: this.value.trim() }), 300);
        });
    }
}

function updateFilters(updates) {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(updates)) {
        if (!value) urlParams.delete(key);
        else urlParams.set(key, value);
    }
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({}, '', newUrl);
    updateUIFromURL();
    ladeShop();
}

function toggleTagFilter(tag) {
    const urlParams = new URLSearchParams(window.location.search);
    updateFilters({ tag: urlParams.get('tag') === tag ? "" : tag });
}

function updateUIFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentTag = urlParams.get('tag');
    const currentCategory = urlParams.get('category');
    const currentSearch = urlParams.get('search');

    document.querySelectorAll('.sidebar-category').forEach(el => {
        const cat = el.getAttribute('data-category');
        el.classList.toggle('active', cat === currentCategory || (!cat && !currentCategory));
    });
    document.querySelectorAll('.sidebar-tag').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tag') === currentTag);
    });
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value !== currentSearch) searchInput.value = currentSearch || "";
}

async function fetchAllTags() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error();
        const produkte = await response.json();
        const allTags = new Set();
        produkte.forEach(p => { if (p.labels) p.labels.forEach(l => allTags.add(l)); });
        renderTagSidebar(Array.from(allTags));
    } catch (error) {
        console.error("Tags konnten nicht geladen werden.");
    }
}

function renderTagSidebar(tags) {
    const container = document.getElementById("tag-list");
    if (!container) return;
    container.innerHTML = tags.map(tag => `<a href="#" class="sidebar-tag" data-tag="${tag}">${tag}</a>`).join("");
    container.querySelectorAll('.sidebar-tag').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTagFilter(this.getAttribute('data-tag'));
        });
    });
}

async function ladeShop() {
    const container = document.getElementById("produkte-container");
    if (!container) return; 

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const response = await fetch(`${API_URL}/products${urlParams.toString() ? '?' + urlParams.toString() : ''}`);
        if (!response.ok) throw new Error(`HTTP-Fehler`);
        
        const alleProdukte = await response.json();
        const cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
        container.innerHTML = ""; 

        const sichtbareProdukte = alleProdukte.filter(p => p.available !== false);

        if (sichtbareProdukte.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1px solid #eaeaea;">
                <h3 style="color: #333; margin-bottom: 10px;">Keine Produkte gefunden</h3>
                <p style="color: #777;">Für diese Filterkombination gibt es aktuell leider keine Ausgrabungen.</p>
                <button onclick="window.location.href='shop.html'" class="btn-primary" style="margin-top: 15px;">Alle Filter löschen</button>
            </div>`;
            return;
        }

        sichtbareProdukte.forEach(produkt => {
            const labelsHtml = produkt.labels.map(label => `<a href="#" class="product-tag-link" data-tag="${label}">${label}</a>`).join("");
            const formatierterPreis = typeof formatPrice === 'function' ? formatPrice(produkt.price) : `${produkt.price}€`;
            
            let preisHtml = `<h3>${formatierterPreis}</h3>`;
            if (produkt.oldPrice) {
                const formatierterAlterPreis = typeof formatPrice === 'function' ? formatPrice(produkt.oldPrice) : `${produkt.oldPrice}€`;
                preisHtml = `
                    <div class="price-container">
                        <span class="old-price">${formatierterAlterPreis}</span>
                        <h3 class="sale-price">${formatierterPreis}</h3>
                    </div>
                `;
            }

            const units = produkt.availableUnits !== undefined ? Number(produkt.availableUnits) : 1;
            const inCart = cart.includes(produkt.name);
            
            let btnText = "Vorbestellen";
            let btnClass = "shop-link";
            let disabledAttr = "";

            if (units <= 0) {
                btnText = "Ausverkauft";
                btnClass = "shop-link sold-out";
                disabledAttr = "disabled";
            } else if (inCart) {
                btnText = "Im Warenkorb ✓";
                btnClass = "shop-link in-cart";
            }

            const htmlString = `
                <article class="shop-card" data-id="${produkt.id}">
                    <div class="shop-media">
                        <img src="../${produkt.image}" alt="${produkt.imageAlt}">
                    </div>
                    <div class="shop-body">
                        <p class="shop-tag">${produkt.name}</p>
                        ${preisHtml}
                        <p class="shop-meta">${produkt.description}</p>
                        <div class="shop-labels">${labelsHtml}</div>
                        <button class="${btnClass}" data-name="${produkt.name}" ${disabledAttr}>${btnText}</button>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML("beforeend", htmlString);
        });

        container.querySelectorAll('.product-tag-link').forEach(el => {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTagFilter(this.getAttribute('data-tag'));
            });
        });
    } catch (error) {
        container.innerHTML = "<p class='error-msg'>Produkte konnten nicht geladen werden.</p>";
    }
}

document.addEventListener("click", function(event) {
    if (event.target.closest(".shop-link")) {
        event.preventDefault(); 
        const btn = event.target.closest(".shop-link");
        
        if (btn.disabled || btn.classList.contains("sold-out")) return;

        const produktName = btn.getAttribute("data-name");
        let cart = JSON.parse(localStorage.getItem("gymdodo_cart")) || [];
        
        if (cart.includes(produktName)) {
            cart = cart.filter(name => name !== produktName);
            btn.classList.remove("in-cart");
            btn.textContent = "Vorbestellen";
        } else {
            cart.push(produktName);
            btn.classList.add("in-cart");
            btn.textContent = "Im Warenkorb ✓";
        }
        
        localStorage.setItem("gymdodo_cart", JSON.stringify(cart));
    }
});

document.addEventListener("DOMContentLoaded", initShop);