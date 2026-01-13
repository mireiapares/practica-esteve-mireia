const components = [
    { id: 'header-placeholder', file: 'components/header.html' },
    { id: 'club-placeholder', file: 'components/club.html' },
    { id: 'socis-placeholder', file: 'components/socis.html' },
    { id: 'historia-placeholder', file: 'components/historia.html' },
    { id: 'entrades-placeholder', file: 'components/entrades.html' }
];

async function loadPage() {
    for (const item of components) {
        try {
            const response = await fetch(item.file);
            if (!response.ok) throw new Error("No s'ha trobat: " + item.file);
            const html = await response.text();
            const placeholder = document.getElementById(item.id);
            if (placeholder) placeholder.innerHTML = html;
        } catch (error) {
            console.error("Error carregant component:", error);
        }
    }
    initAllFunctions();
}

function initAllFunctions() {
    initGallery();           
    initBotoInteractiu();    
    initCountdown();         
    initSocisInteractiu();   // Ara farà funcionar "Més informació"
    initHistoriaToggle();    // Ara farà funcionar "Obrir Galeria"
}

function initSocisInteractiu() {
    // Busquem l'ID que m'has passat: btn-info-socis
    const btnSocis = document.getElementById('btn-info-socis');
    // Busquem l'ID del contenidor: info-extra-socis
    const extraInfo = document.getElementById('info-extra-socis'); 

    if (btnSocis && extraInfo) {
        btnSocis.onclick = () => {
            if (extraInfo.classList.contains('hidden')) {
                extraInfo.classList.remove('hidden');
                btnSocis.querySelector('span').innerText = 'MENYS INFORMACIÓ';
                btnSocis.querySelector('.arrow-icon').innerText = '↑';
            } else {
                extraInfo.classList.add('hidden');
                btnSocis.querySelector('span').innerText = 'MÉS INFORMACIÓ';
                btnSocis.querySelector('.arrow-icon').innerText = '→';
            }
        };
    }
}

// 2. FUNCIONAMENT D'HISTÒRIA (Obrir Galeria)
function initHistoriaToggle() {
    // Assegura't que el botó a historia.html tingui id="toggle-gallery"
    const btn = document.getElementById('toggle-gallery');
    // Assegura't que el div de la galeria tingui la classe "galeria-hidden"
    const galeria = document.querySelector('.galeria-hidden');
    
    if (btn && galeria) {
        btn.onclick = () => {
            galeria.classList.toggle('visible');
            const isVisible = galeria.classList.contains('visible');
            
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            
            if (span) span.innerText = isVisible ? "TANCAR GALERIA" : "OBRIR GALERIA";
            if (icon) icon.innerText = isVisible ? "↑" : "↓";
            
            if (isVisible) {
                setTimeout(() => {
                    galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };
    }
}

// 3. SLIDER DE FOTOS (Història)
function initGallery() {
    document.querySelectorAll('.cine-card').forEach(card => {
        const images = card.querySelectorAll('.slide-img');
        const next = card.querySelector('.next');
        const prev = card.querySelector('.prev');
        let i = 0;

        if (next && prev && images.length > 0) {
            next.onclick = (e) => {
                e.stopPropagation();
                images[i].classList.remove('active');
                i = (i + 1) % images.length;
                images[i].classList.add('active');
            };
            prev.onclick = (e) => {
                e.stopPropagation();
                images[i].classList.remove('active');
                i = (i - 1 + images.length) % images.length;
                images[i].classList.add('active');
            };
        }
    });
}

// 4. CALENDARI (Entrades)
function initBotoInteractiu() {
    const btn = document.querySelector('.btn-toggle-calendar');
    const extraContainer = document.getElementById('extra-matches');
    
    if (btn && extraContainer) {
        let estaObert = false; 

        btn.onclick = function() {
            if (!estaObert) {
                const llista = [
                    { data: "15 MAR", hora: "18:30H", rival: "GIRONA FC" },
                    { data: "22 MAR", hora: "21:00H", rival: "VALENCIA CF" }
                ];
                
                extraContainer.innerHTML = llista.map(p => `
                    <div class="match-card-item">
                        <div style="min-width: 100px; text-align: left;">
                            <span style="color: white; font-weight: 900; font-size: 1.4rem; display: block;">${p.data}</span>
                            <span style="color: #ffcc00; font-weight: 700;">${p.hora}</span>
                        </div>
                        <div style="flex: 1; text-align: left;">
                            <span style="color: white; font-weight: 800; font-size: 1.4rem;">BARÇA <span style="color:#ffcc00">vs</span> ${p.rival}</span>
                        </div>
                        <button class="btn-buy-mini">ENTRADES</button>
                    </div>
                `).join('');
                
                btn.innerText = "AMAGA EL CALENDARI";
                estaObert = true;
            } else {
                extraContainer.innerHTML = ""; 
                btn.innerText = "VEURE CALENDARI COMPLET";
                estaObert = false;
            }
        };
    }
}

// 5. COMPTE ENRERE
function initCountdown() {
    const dataPartit = new Date("Feb 12, 2026 16:30:00").getTime();
    setInterval(() => {
        const ara = new Date().getTime();
        const dist = dataPartit - ara;
        const d = document.getElementById("days");
        if (d) {
            d.innerText = Math.floor(dist / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById("hours").innerText = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("seconds").innerText = Math.floor((dist % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);
}

loadPage();