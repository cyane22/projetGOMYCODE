
// === Variables globales ===
let score = 0;               // Score du joueur (nombre de paires trouvées)
let deplacements = 0;        // Nombre de déplacements effectués
let temps = 0;               // Temps écoulé en secondes
let premierClic = false;     // Indicateur pour le premier clic (booléen pour démarrer le temps seulement au premier clic)
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

// retourne toutes les cartes brièvement au chargement de la page, puis les cache après quelques secondes
document.addEventListener("DOMContentLoaded", () => {
    revealCardsTemporary(); // Révèle les cartes au chargement de la page
});

function revealCardsTemporary() {
    const cards = document.querySelectorAll('.carte');
    cards.forEach(card => {
        // Révèle la carte
        card.classList.remove('cachée');
        card.classList.add('découverte'); // Ajoutez une classe "découverte" pour styliser les cartes visibles

        const img = document.createElement('img');
        img.src = card.dataset.image; // Récupère l'image correspondante
        img.style.display = 'block'; // Assure que l'image est visible
        img.style.width = '100px'; 
        img.style.height = '100px'; 
        card.appendChild(img);
    });

    // Cache les cartes après 3 secondes
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('découverte');
            card.classList.add('cachée'); // Cache à nouveau les cartes
            card.innerHTML = ''; // Supprime l'image pour éviter les duplications
        });
    }, 2000); // Changez 2000 (ms) pour ajuster la durée si nécessaire
}


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

    // Ajoutez des écouteurs d’événements aux cartes pour capturer les clics des utilisateurs
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
                    afficherCommentaires(); // Affiche la note et commentaire du joueur

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

// === Affiche un commentaire selon la performance du joueur ===
function afficherCommentaires() {
    let commentaire = '';
    let nombreEtoiles = 0;

    // Évaluation basée sur le nombre de déplacements
    if (deplacements <= 16) {
        commentaire = "🌟 Excellent(e)🎉, vous êtes un(e) maître(sse) du jeu de mémoire ! 🧠✨ !";
        nombreEtoiles = 3;
    } else if (deplacements <= 24) {
        commentaire = "👍 Très bien joué ! Tu as une bonne mémoire !";
        nombreEtoiles = 2;
    } else {
        commentaire = "🙂 Bien joué ! Essaie de faire moins de coups la prochaine fois.";
        nombreEtoiles = 1;
    }

   // Insère le texte dans la div prévue
   const commentaireDiv = document.getElementById('commentaire-performance');
   commentaireDiv.innerHTML = `<h2>${commentaire}</h2>`;

   // Affiche les étoiles de performance
   let etoiles = '';
   for (let i = 0; i < nombreEtoiles; i++) {
       etoiles += '⭐';
   }
   const etoilesDiv = document.createElement('p');
   etoilesDiv.innerText = etoiles;
   commentaireDiv.appendChild(etoilesDiv);
}
