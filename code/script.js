
// === Variables globales ===
let score = 0;               // Score du joueur (nombre de paires trouvées)
let deplacements = 0;        // Nombre de déplacements effectués
let temps = 0;               // Temps écoulé en secondes
let premierClic = false;     // Indicateur pour le premier clic
let premierIndex = null;     // Index de la première carte cliquée
let intervalle;              // Intervalle pour le chronomètre

// === Liste des images pour les cartes ===
const images = [
    'images/image1.jpg', 'images/image1.jpg',
    'images/image2.jpg', 'images/image2.jpg',
    'images/image3.jpg', 'images/image3.jpg',
    'images/image4.jpg', 'images/image4.jpg',
    'images/image5.jpg', 'images/image5.jpg',
    'images/image6.jpg', 'images/image6.jpg',
    'images/image7.jpg', 'images/image7.jpg',
    'images/image8.jpg', 'images/image8.jpg'
];

// Mélange aléatoire des images
let cartes = [...images].sort(() => 0.5 - Math.random());

// === Fonction pour démarrer le chronomètre ===
function startTimer() {
    intervalle = setInterval(() => {
        temps++;
        document.getElementById('temps').innerText = `Temps: ${temps} secondes`;
    }, 1000);
}

// === Fonction pour recommencer la partie ===
function recommencer() {
    location.reload(); // Recharge la page pour réinitialiser le jeu
}

// === Création des cartes et gestion des clics ===
cartes.forEach((image, index) => {
    // Création de la div représentant la carte
    const div = document.createElement('div');
    div.classList.add('carte', 'cachée'); // Carte initialement cachée
    div.id = `carte-${index}`;            // ID unique pour chaque carte
    div.dataset.image = image;            // Stocke l'image de la carte dans un attribut personnalisé

    // Gestion du clic sur la carte
    div.addEventListener('click', () => {
        // Ignore le clic si la carte est déjà découverte
        if (!div.classList.contains('cachée') || index === premierIndex) return;

        // Démarre le chronomètre au premier clic
        if (!premierClic) {
            startTimer(); // Démarre le chronomètre
            premierClic = true; // Marque que le premier clic a eu lieu
        }

        // Affiche l'image de la carte
        div.classList.remove('cachée');
        div.classList.add('découverte');
        const img = document.createElement('img');
        img.src = div.dataset.image;
        img.style.display = 'block'; // Assure que l'image est visible
        img.style.width = '100px';  // Ajustez les dimensions si nécessaire
        img.style.height = '100px'; 
        div.appendChild(img); // Ajoute l'image à la carte
        

        // Si c'est le premier clic
        if (premierIndex === null) {
            premierIndex = index; // Stocke l'index de la première carte cliquée
        } else {
            // Si c'est le deuxième clic
            const index1 = premierIndex;
            const index2 = index;
            premierIndex = null; // Réinitialise l'index pour le prochain tour

            // Incrémente le nombre de déplacements
            deplacements++;
            document.getElementById('deplacements').innerText = `Déplacements: ${deplacements}`;

            // Vérifie si les cartes sont identiques
            if (cartes[index1] === cartes[index2]) {
                score++; // Augmente le score
                document.getElementById('score').innerText = `Score: ${score}`;

                // Vérifie si toutes les paires ont été trouvées
                if (score === 8) {
                    clearInterval(intervalle); // Arrête le chronomètre
                    document.getElementById('fin').style.display = 'block'; // Affiche le message de fin
                }
            } else {
                // Si les cartes ne sont pas identiques, les cache après 1 seconde
                setTimeout(() => {
                    const carte1 = document.getElementById(`carte-${index1}`);
                    const carte2 = document.getElementById(`carte-${index2}`);
                    carte1.classList.add('cachée');
                    carte2.classList.add('cachée');
                    carte1.classList.remove('découverte');
                    carte2.classList.remove('découverte');
                    carte1.innerHTML = '';
                    carte2.innerHTML = '';
                }, 1000); // Cache les cartes après 1 seconde
            }
        }
    });

    // Ajoute la carte à la grille
    document.getElementById('grille').appendChild(div);
});
