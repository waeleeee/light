# Guide Rapide - Simulateur Murphi (Français)

## 🚀 Démarrage Rapide

### Lancer l'Application
```bash
cd c:\Users\Wael_\Murphi_Traffic_light
npm run dev
```

**Ouvrir:** `http://localhost:5174/`

---

## 🎮 Guide d'Utilisation

### Layout Principal (Une Seule Page)

**En-tête (Haut - Fixe):**
- 🚦 Titre: Simulateur de Feu Tricolore Murphi
- Description: Vérification formelle et détection de violations

**Zone Principale (4 Colonnes):**
1. **Feu Tricolore** - Affichage visuel de l'état
2. **Règles Murphi** - Code et règles actives
3. **Règles Murphi** - Suite (plus de détails)
4. **État du Système** - État courant + Invariant

**Contrôles:**
- Étape Suivante
- Lecture Auto / Arrêter
- Réinitialiser
- Vérifier Modèle

**Scénarios (Choix):**
- ✓ Fonctionnement Normal
- ⚠️ Violation
- 🔒 Blocage

**Analyse (2 Colonnes):**
- Chronologie d'État (gauche)
- Journal d'Exécution (droite)

**Info:**
- Scénario Actuel et Description

---

## 📖 Description des Scénarios

### 1. ✓ Fonctionnement Normal
**Qu'est-ce que c'est?**
- Feu tricolore qui fonctionne correctement
- Suit la séquence: ROUGE → VERT → JAUNE → ROUGE

**Résultat Expected:**
- ✓ Invariant OK (vert)
- Pas d'erreurs
- Système fonctionne normalement

**Use Case:**
- Montrez le bon fonctionnement
- Comparez avec les autres scénarios

---

### 2. ⚠️ Scénario de Violation
**Qu'est-ce que c'est?**
- Feu tricolore avec règles cassées
- ROUGE → JAUNE (saute VERT!)
- JAUNE → VERT (mauvais ordre!)

**Résultat Expected:**
- ✗ VIOLATION DÉTECTÉE (rouge, clignote)
- Messages d'erreur dans le journal
- Système détecte immédiatement le problème

**Use Case:**
- Montrez comment Murphi détecte les bugs
- Expliquez l'importance des invariants

---

### 3. 🔒 Scénario de Blocage
**Qu'est-ce que c'est?**
- Feu tricolore qui se bloque
- ROUGE → VERT (OK)
- VERT → VERT (self-loop = blocage!)

**Résultat Expected:**
- ✓ Première transition OK
- ✗ Ensuite système bloqué
- "Aucune règle applicable - Système arrêté"

**Use Case:**
- Montrez les deadlocks
- Expliquez les systèmes non-réactifs

---

## 🎯 Démo Complète (3 minutes)

### 1. Normal (1 min)
```
1. Cliquez: Fonctionnement Normal
2. Cliquez: Lecture Auto
3. Regardez le feu cycler
4. Remarquez: Invariant OK (vert)
5. Cliquez: Arrêter après 2-3 cycles
```

### 2. Violation (1 min)
```
1. Cliquez: Scénario de Violation
2. Cliquez: Lecture Auto
3. Regardez: ROUGE → JAUNE (saut!)
4. Remarquez: Invariant tourne au rouge
5. Regardez le journal: VIOLATION D'INVARIANT
```

### 3. Blocage (1 min)
```
1. Cliquez: Scénario de Blocage
2. Cliquez: Lecture Auto
3. Regardez: ROUGE → VERT (OK)
4. Puis: Vert → Vert → Vert (boucle infinie)
5. Journal: "Aucune règle applicable - Système arrêté"
```

---

## 🎨 Légende Couleurs

### Feu Tricolore
- 🔴 **ROUGE** - Stop
- 🟡 **JAUNE** - Attention
- 🟢 **VERT** - Allez

### Invariant Status
- 🟢 **OK** - Invariants satisfaits
- 🔴 **VIOLATION** - Invariants cassés (clignote)

### Journal d'Exécution
- 🔵 **Info** - Information générale
- 🟢 **Succès** - Opération réussie
- 🔴 **Erreur** - Erreur détectée
- 🟡 **Avertissement** - Attention requise

### Messages
- ✓ = Bon (invariant OK)
- ✗ = Mauvais (violation)
- ⚠️ = Attention (avertissement)

---

## 🕹️ Contrôles Détaillés

### Étape Suivante
- Exécute UNE transition
- Manual step-by-step
- Bon pour suivre le détail

### Lecture Auto
- Exécute automatiquement
- Rythme: 1.5 secondes par transition
- Idéal pour les présentations

### Arrêter
- Pause la lecture automatique
- Ne réinitialise pas
- Vous pouvez continuer avec "Étape Suivante"

### Réinitialiser
- Retour à ROUGE
- Efface l'historique
- Nouveau journal vierge

### Vérifier Modèle
- Exécution complète du scénario
- Teste TOUS les états
- Affiche le rapport final
- Indique les violations trouvées

---

## 📊 Chronologie d'État

**Affichage:** Suite d'états visités
**Couleurs:**
- 🔴 ROUGE
- 🟡 JAUNE
- 🟢 VERT

**Numérotation:** #0, #1, #2, ...
**Animations:** Entrée progressive

**Utilité:** Voir la trace complète des états

---

## 📝 Journal d'Exécution

**Affichage:** Flux d'exécution en temps réel

**Exemple de Logs:**
```
Simulateur de Feu Tricolore Murphi initialisé
État initial: ROUGE
Passage à: Fonctionnement Normal
Cycle standard du feu tricolore
Lecture automatique démarrée
Règle appliquée: RED_TO_GREEN
Transition: ROUGE → VERT
Invariant OK ✓
Règle appliquée: GREEN_TO_YELLOW
Transition: VERT → JAUNE
Invariant OK ✓
```

---

## 💡 Conseils pour Votre Équipe

### Pour Développeurs:
"Ceci montre comment les outils formels détectent les bugs
que le testing traditionnel pourrait manquer."

### Pour Managers:
"Formal verification réduit les coûts de correction
en trouvant les bugs avant le déploiement."

### Pour Étudiants:
"Ceci est la vérification de modèles en action.
Utilisée dans les systèmes critiques."

---

## 🔧 Troubleshooting

### Le serveur ne démarre pas?
```bash
npm install
npm run dev
```

### Port 5174 déjà utilisé?
Vite essaie 5175, 5176, etc.
Vérifiez l'output du terminal

### Les français ne s'affichent pas?
Rechargez la page (Ctrl+F5)

### Animations saccadées?
Vérifiez les onglets ouverts (consomment CPU)

---

## 📱 Responsive Design

**Desktop:** Tous les éléments côte à côte
**Tablette:** Grille adaptée
**Mobile:** Empilement vertical

Testez en redimensionnant la fenêtre!

---

## ⚡ Raccourcis Utiles

**Étape Suivante:** Alt+N (selon navigateur)
**Réinitialiser:** Alt+R
**Vérifier:** Alt+M

(Raccourcis standards navigateur - adaptez selon besoins)

---

## 🎓 Concepts Clés Expliqués

### Murphi
- Outil de vérification de modèles
- Vérifie les invariants automatiquement
- Explore tous les états possibles

### Invariant
- Condition qui doit TOUJOURS être vraie
- "Un seul feu peut être actif à la fois"
- Si faux = violation

### État
- Configuration du système à un moment
- Notre système: ROUGE, JAUNE, ou VERT
- Chaque état est visité une fois

### Règle
- Action autorisée
- Condition (guard) + Action
- "Si ROUGE alors devenir VERT"

### Violation
- Invariant devient faux
- Détectée automatiquement
- Murphi signale le problème

### Blocage (Deadlock)
- Système ne peut plus progresser
- Aucune règle ne s'applique
- Le système "gèle"

---

## 🌐 Ressources

**Repository:** `https://github.com/waeleeee/Murphi_Traffic_light`
**Langue:** 🇫🇷 Français / 🇬🇧 Anglais (dans le code)
**Technologie:** React + TypeScript + Tailwind CSS

---

**Version:** 2.0 (Monopage + Français)
**Date:** Décembre 2025
**Auteur:** Wael

