document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.contents-list a[href^="#"]');
    const sections = {};
    let scrolling = false;

    // Sammle alle Abschnitte
    sidebarLinks.forEach(link => {
        const id = link.getAttribute('href');
        const section = document.querySelector(id);
        if (section) {
            sections[id] = section;
        }
    });

    // Smooth Scroll Funktion mit zusätzlichem visuellen Feedback
    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                scrolling = true;
                
                // Entferne alle aktiven Klassen
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Füge aktive Klasse zum geklickten Link hinzu
                link.classList.add('active');
                
                // Scroll zum Ziel
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset für Header-Höhe
                    behavior: 'smooth'
                });
            }
        });
    });

    // Aktualisiere aktiven Link beim Scrollen
    window.addEventListener('scroll', () => {
        if (scrolling) return; // Überspringe während der Animation
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset
        
        // Finde den aktuellen Abschnitt
        Object.entries(sections).forEach(([id, section]) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = id;
            }
        });
        
        // Aktualisiere aktive Klasse
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
                
                // Öffne übergeordnete Listen
                let parent = link.parentElement;
                while (parent && !parent.classList.contains('contents-list')) {
                    if (parent.parentElement && parent.parentElement.classList.contains('has-children')) {
                        parent.parentElement.classList.add('open');
                    }
                    parent = parent.parentElement;
                }
            }
        });
    });
    
    // Initiale Markierung des aktiven Abschnitts
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);

    // Seitenleisten-Toggle für mobile Ansicht
    const sidebarHeader = document.querySelector('.contents-header');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarHeader && sidebar) {
        // Initial auf mobilen Geräten minimieren
        if (window.innerWidth <= 900) {
            sidebar.classList.add('collapsed');
        }
        
        sidebarHeader.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Bei Bildschirmgrößenänderung anpassen
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
        }
    });
});