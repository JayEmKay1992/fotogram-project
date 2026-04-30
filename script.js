/* 1. Array mit Bilddaten für die Galerie, meine "Basisdaten" */

const images = [
    {id: "cherry-blossoms", url: "./img/cherry-blossoms.jpg", title: "Cherry Blossom", alt: "Kirschblüten am Baum"},
    {id: "coastal-path", url: "./img/coastal-path.jpg", title: "Coastal Path", alt: "Klippenpfad am Meer"},
    {id: "forest-road", url: "./img/forest-road.jpg", title: "Forest Road", alt: "Waldweg"},
    {id: "fox", url: "./img/fox.jpg", title: "Fox", alt: "Fuchs"},
    {id: "highland-cow", url: "./img/highland-coo.jpg", title: "Highland Cow", alt: "Highland Kuh"},
    {id: "lighthouse", url: "./img/lighthouse.jpg", title: "Lighthouse", alt: "Leuchtturm in Dänemark"},
    {id: "lynx", url: "./img/lynx.jpg", title: "Lynx", alt: "Luchs"},
    {id: "mountain-lake", url: "./img/mountain-lake.jpg", title: "Mountain Lake", alt: "Bergsee"},
    {id: "nightsky", url: "./img/nightsky.jpg", title: "Night Sky", alt: "Nachthimmel"},
    {id: "scotland", url: "./img/scotland.jpg", title: "Scotland", alt: "Highlands in Schottland"},
    {id: "sunset-beach", url: "./img/sunset-beach.jpg", title: "Sunset Beach", alt: "Sonnenuntergang an der Küste"},
    {id: "wave", url: "./img/wave.jpg", title: "Wave", alt: "Welle"}
];

/* Globale Variablen (Global Scope) für den Zugriff durch jede nachfolgende Funktion */

let shuffledImages = []; // Array für die zufällig angeordneten Bilder, quasi eine "softe Kopie" des originalen images-Arrays, das ich mischen kann, ohne die Originalreihenfolge zu verändern
let currentPhotoIndex = 0; // Index des aktuell angezeigten Fotos im Modal

function init() {
    shuffledImages = [...images].sort(() => 0.5 - Math.random()); // Bilder zufällig anordnen, indem ich eine Kopie des originalen images-Arrays erstelle und diese mische
    renderGallery();
    setupEventListeners();
}

function renderGallery() {
    const photoGrid = document.getElementById("photo-grid");

    let galleryHTML = ""; // Variable für die HTML-Struktur der Galerie

    shuffledImages.forEach((img, index) => {
        galleryHTML += `
            <div class="photo-item" tabindex="0" role="button" onclick="openModal(${index})">
                <img src="${img.url}" alt="${img.alt}" title="${img.title}">
            </div>
        `; // HTML-Struktur für jedes Bild in der Galerie erstellen
    });

    photoGrid.innerHTML = galleryHTML; // HTML-Struktur in das DOM einfügen
}

/* Nachfolgend erstelle ich die Funktion für das Modal, das geöffnet wird, 
wenn ein Bild angeklickt wird. Diese Funktion erhält den Index des angeklickten Bildes als Parameter, 
damit ich die entsprechenden Daten aus dem shuffledImages-Array abrufen kann. */

function openModal (index) {
    currentPhotoIndex = index; // Aktuellen Index des angeklickten Bildes speichern

    const imgData = shuffledImages[index]; // Bilddaten aus dem shuffledImages-Array abrufen

    const modal = document.getElementById("photo-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const photoCounter = document.getElementById("photo-counter"); 

    // Modal mit den entsprechenden Bilddaten füllen 

    modalImg.src = imgData.url; // Bildquelle im Modal setzen
    modalImg.alt = imgData.alt; // Alt-Text im Modal setzen
    modalCaption.textContent = imgData.title; // Titel im Modal setzen

    photoCounter.textContent = `${currentPhotoIndex + 1} / ${shuffledImages.length}`; // Fotocounter aktualisieren

    modal.style.display = "flex"; // Modal anzeigen

    updateLikeStatus(); // Like-Status aktualisieren, wenn Modal geöffnet wird
}

function closeModal() {
    const modal = document.getElementById("photo-modal");
    modal.style.display = "none"; // Modal ausblenden
}

/**
 * @param {number} direction - Richtung der Navigation, entweder -1 für vorheriges Foto oder 1 für nächstes Foto
 */

function changePhoto(direction){
    currentPhotoIndex = (currentPhotoIndex + direction + shuffledImages.length) % shuffledImages.length; // Berechnung des neuen Index unter Berücksichtigung der Array-Länge
    openModal(currentPhotoIndex); // Modal mit dem neuen Foto öffnen
}

function updateLikeStatus() {
    const heartIcon = document.getElementById("heart-icon");
    const currentImgData = shuffledImages[currentPhotoIndex];
    const likes = JSON.parse(localStorage.getItem("fotogram_likes")) || {}; // Objekt aus localStorage abrufen oder leeres Objekt erstellen, wenn keine Daten vorhanden sind

    if (likes[currentImgData.id]) {
        heartIcon.classList.add("liked"); // Herz-Icon als "geliked" markieren
    } else {
        heartIcon.classList.remove("liked"); // Herz-Icon als "nicht geliked" markieren
    }
}

function toggleLike() {
    const currentImg = shuffledImages[currentPhotoIndex];

    let likes = JSON.parse(localStorage.getItem("fotogram_likes")) || {}; // Objekt aus localStorage abrufen oder leeres Objekt erstellen, wenn keine Daten vorhanden sind

    if (likes[currentImg.id]) {
        delete likes[currentImg.id]; // Like entfernen, wenn bereits geliked
    } else {
        likes[currentImg.id] = true; // Like hinzufügen, wenn noch nicht geliked
    }

    localStorage.setItem("fotogram_likes", JSON.stringify(likes)); // Aktualisiertes Objekt zurück in localStorage speichern

    updateLikeStatus(); // Like-Status im Modal aktualisieren
}

function setupEventListeners() {

    document.querySelector(".close-modal").addEventListener("click", closeModal); // Event-Listener für das Schließen des Modals hinzufügen

    document.getElementById("photo-grid").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Standardverhalten verhindern, z.B. Scrollen bei Leertaste
            const item = e.target.closest(".photo-item"); // Überprüfen, ob das fokussierte Element ein Foto-Item ist
            if (item) {
                const index = Array.from(item.parentNode.children).indexOf(item); // Index des angeklickten Foto-Items ermitteln
                openModal(index); // Modal mit dem entsprechenden Foto öffnen
            }
        }
    }); // Event-Listener für die Galerie hinzufügen, um auch per Tastatur Fotos öffnen zu können

    document.getElementById("prev-photo").addEventListener("click", () => changePhoto(-1)); // Event-Listener für vorheriges Foto hinzufügen

    document.getElementById("next-photo").addEventListener("click", () => changePhoto(1)); // Event-Listener für nächstes Foto hinzufügen

    document.getElementById("like-btn").addEventListener("click", toggleLike); // Event-Listener für Like-Button hinzufügen


    window.addEventListener("click", (e) => {
        const modal = document.getElementById("photo-modal");
        if (e.target === modal) {
            closeModal(); // Modal schließen, wenn außerhalb des Bildes geklickt wird
        }
    });

    window.addEventListener("keydown", (e) => {
        const modal = document.getElementById("photo-modal");
        if (modal.style.display !== "flex") return; // Überprüfen, ob das Modal geöffnet ist

        if (e.key === "Escape" || e.key === " ") {
            e.preventDefault(); // Standardverhalten verhindern, z.B. Scrollen bei Leertaste
            closeModal(); // Modal schließen
        }

        if (e.key === "ArrowRight") {
            changePhoto(1); // Zum nächsten Foto wechseln
        }

        if (e.key === "ArrowLeft") {
            changePhoto(-1); // Zum vorherigen Foto wechseln
        }
    });
}

/* Der Like-Button wurde mit tabindex="-1" aus der Tastatur-Reihenfolge genommen, um einen 
"Focus Trap" zu vermeiden. Derzeit ist er nur per Maus bedienbar. In einer zukünftigen Version 
könnte ich hier für vollständige Barrierefreiheit/Tastaturunterstützung noch eine Lösung implementieren, 
um den Like-Button auch per Tastatur erreichbar 
zu machen, ohne dass Tastatur-User versehentlich Elemente im Hintergrund fokusieren */

init(); // Initialisierungsfunktion aufrufen, um die Galerie zu starten 