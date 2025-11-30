# 🎨 Visualisation du Layout Monopage

## Structure Complète de la Page

```
┌───────────────────────────────────────────────────────────────────────┐
│                         🎯 EN-TÊTE (FIXE)                           │
│                  🚦 Simulateur de Feu Tricolore Murphi               │
│            Vérification formelle et détection de violations            │
└───────────────────────────────────────────────────────────────────────┘
                                    ↓↓↓
┌───────────────────────────────────────────────────────────────────────┐
│                    📊 SECTION 1: AFFICHAGE PRINCIPAL                  │
├────────────────┬──────────────────────────┬──────────────────────────┤
│  🚦 FEU        │   📜 RÈGLES MURPHI      │  📜 RÈGLES MURPHI (suite)│
│                │                          │                          │
│  [Tricolore]   │  • RED_TO_GREEN         │  • GREEN_TO_YELLOW       │
│  Animé         │    [Code...]            │    [Code...]             │
│                │                          │                          │
│  Couleurs:     │  • YELLOW_TO_RED        │  🔐 Invariants:          │
│  🔴 ROUGE      │    [Code...]            │    [Code...]             │
│  🟡 JAUNE      │                          │                          │
│  🟢 VERT       │  [Surlignage: Règle     │  [Affichage scrollable]  │
│                │   Active Actuellement]   │                          │
│  État: ROUGE   │                          │                          │
└────────────────┴──────────────────────────┴──────────────────────────┘
                                    ↓↓↓
┌─────────────────────────────────────────────────────────────────────────┐
│                   ⚙️ SECTION 2: CONTRÔLES                              │
├────────────────┬────────────────┬────────────────┬────────────────┐
│ Étape Suivante │ Lecture Auto   │ Réinitialiser │ Vérifier Modèle│
│  (Manuel)      │ /Arrêter       │               │                │
└────────────────┴────────────────┴────────────────┴────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                ⚡ SCÉNARIOS DE DÉMONSTRATION                           │
├────────────────────────────┬─────────────────────┬──────────────────────┤
│  ✓ Fonctionnement Normal   │ ⚠️ Violation        │  🔒 Blocage          │
│  • Fonctionne correctement │  • Invariants brisés│ • Système bloqué      │
│                            │                     │                      │
└────────────────────────────┴─────────────────────┴──────────────────────┘
                                    ↓↓↓
┌─────────────────────────────────────────────────────────────────────────┐
│                 📈 SECTION 3: ANALYSE ET JOURNALISATION               │
├────────────────────────────────┬────────────────────────────────────────┤
│  ⏱️ CHRONOLOGIE D'ÉTAT          │   📋 JOURNAL D'EXÉCUTION             │
│  (Timeline)                     │   (Log Console)                      │
│                                 │                                      │
│  #0: 🔴 ROUGE                   │  [12:45:30] → État initial: ROUGE    │
│    ↓                            │  [12:45:31] ✓ Règle appliquée...     │
│  #1: 🟢 VERT                    │  [12:45:32] ✓ Invariant OK ✓         │
│    ↓                            │  [12:45:33] → Transition: ROUGE→VERT │
│  #2: 🟡 JAUNE                   │  [12:45:34] ✓ Invariant OK ✓         │
│    ↓                            │  [12:45:35] → Transition: VERT→JAUNE │
│  #3: 🔴 ROUGE                   │  [Scroll pour plus...]               │
│                                 │                                      │
│  [Animations entrée]            │  [Code couleur par type]             │
│                                 │  🔵 Info  🟢 Succès                  │
│                                 │  🔴 Erreur  🟡 Avertissement         │
└────────────────────────────────┴────────────────────────────────────────┘
                                    ↓↓↓
┌─────────────────────────────────────────────────────────────────────────┐
│                  📋 SECTION 4: INFORMATIONS SCÉNARIO                   │
├──────────────────────────────────────────────────────────────────────────┤
│  NOM DU SCÉNARIO:  Fonctionnement Normal                               │
│  DESCRIPTION:      Cycle standard du feu tricolore                     │
│                                                                         │
│  [Mise à jour dynamique quand on change de scénario]                  │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↓↓↓
┌─────────────────────────────────────────────────────────────────────────┐
│              © Simulateur Murphi - Vérification Formelle 2025          │
│        Détection automatique de violations et de blocages               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## État du Système - Détail Colonne 4

```
┌────────────────────────────────┐
│   État du Système              │
├────────────────────────────────┤
│ ÉTAT COURANT                   │
│ ════════════════════════════   │
│        ROUGE                   │
│                                │
├────────────────────────────────┤
│ DERNIÈRE RÈGLE                 │
│ ════════════════════════════   │
│   RED_TO_GREEN                 │
│   (ou — si aucune)             │
│                                │
├────────────────────────────────┤
│ INVARIANT STATUS               │
│ ════════════════════════════   │
│        ✓ OK                    │
│   (ou ✗ VIOLATION clignote)    │
│                                │
└────────────────────────────────┘
```

---

## Responsive Design - Breakpoints

### Desktop (≥1024px) - Comme ci-dessus

### Tablet (768px - 1023px)
```
┌─────────────────────────────────┐
│         EN-TÊTE                 │
└─────────────────────────────────┘
    ↓
┌────────────────┬────────────────┐
│  Feu + Règles  │  État du Sys   │
├────────────────┴────────────────┤
│      Contrôles                  │
├────────────────────────────────┤
│   Scénarios (empilés)          │
├────────────────┬────────────────┤
│  Timeline      │    Logs        │
├────────────────┴────────────────┤
│     Info Scénario              │
├────────────────────────────────┤
│      Pied de Page              │
└────────────────────────────────┘
```

### Mobile (<768px) - Full Vertical Stack
```
┌──────────────────┐
│   EN-TÊTE        │
│   (collant)      │
├──────────────────┤
│  Feu Tricolore   │
├──────────────────┤
│  Règles Murphi   │
├──────────────────┤
│ État du Système  │
├──────────────────┤
│  Contrôles       │
├──────────────────┤
│  Scénarios       │
│  (empilés)       │
├──────────────────┤
│  Chronologie     │
├──────────────────┤
│  Logs            │
├──────────────────┤
│  Info Scénario   │
├──────────────────┤
│ Pied de Page     │
└──────────────────┘
```

---

## Couleurs et Thème

### Palette Principale
```
Arrière-plan global:    Gradient bleu-indigo (from-blue-50 to-indigo-100)
Cartes principales:     Blanc avec ombre
Header/Footer:          Gris foncé (gray-800/900)

État Courant:
  Fond:    Bleu ciel
  Texte:   Bleu foncé

Invariant Status:
  OK:      Vert clair (bg-green-50, border-green-400)
  VIOLATION: Rouge clair (bg-red-50, border-red-400 + animation)

Règles Murphi:
  Fond:    Gradient gris (from-gray-900 to-gray-800)
  Règle   
    Inactive: Gris
    Active:   Bleu + Shadow glow

Légende Feu Tricolore:
  ROUGE:   bg-red-500
  JAUNE:   bg-yellow-400
  VERT:    bg-green-500
  Border:  Slightly darker shade

Journal d'Exécution:
  Fond:    Noir (gray-900)
  Info:    Bleu (blue-400)
  Succès:  Vert (green-400)
  Erreur:  Rouge (red-400)
  Warn:    Jaune (yellow-400)
```

---

## Interactions et Animations

### Boutons
```
Repos:        Couleur unie
Hover:        Légère augmentation (scale 1.05)
Tap:          Réduction (scale 0.95)
Transition:   Smooth 200ms
```

### Cartes
```
Apparition:   Fade-in avec slide (framer-motion)
Survol:       Légère surélevation (shadow)
Violation:    Animation pulse infini (clignote)
```

### Timeline
```
Éléments:     Entrée progressive avec délai
Connecteurs:  Animation scale-in avec delay offset
Numérotation: Sequential (#0, #1, #2...)
```

### Journal
```
Nouvelles:    Slide-in depuis gauche
Supprimées:   Fade-out avec réduction hauteur
Animation:    Max 200ms
Max 50 logs:  Puis suppression des plus anciens
```

---

## Navigation et Flux Utilisateur

```
DÉMARRAGE
   ↓
1. Choisir scénario (Normal/Violation/Deadlock)
   ↓
2. Voir description mise à jour
   ↓
3. Exécuter (Manual ou Auto)
   ├── Next Step → Une transition
   ├── Auto Play → Plusieurs transitions
   └── Model Check → Tout explorer
   ↓
4. Observer:
   - Feu change de couleur
   - Règle surlignée
   - Journal mis à jour
   - Timeline augmente
   ↓
5. Résultat:
   - Invariant OK (vert) ou VIOLATION (rouge)
   - Journal détaillé
   - Timeline complète
   ↓
6. Actions possibles:
   ├── Reset → Recommencer
   ├── Changer scénario → Nouveau test
   └── Model Check → Analyse complète
```

---

## Taille et Espacements

```
En-tête:          py-6, shadow-md
Sections:         mb-8 (40px margin bottom)
Cartes:           p-6 (24px padding), shadow-lg
Boutons:          px-4 py-3 (16px x 12px)
Gap entre éléments: gap-6 (24px)
Border-radius:    rounded-lg (8px)

Responsive:
  Grid cols desktop:     4, 2, 3
  Grid cols tablet:      2, 1-2, 2
  Grid cols mobile:      1 (full width)
```

---

## États Visuels

### État Normal
```
✓ Invariant OK (vert)
Pas d'animation
Texte gris normal
```

### État Violation
```
✗ VIOLATION (rouge)
Animation pulse (clignote)
Bordure rouge épaisse
Texte rouge foncé
```

### État Actif (Règle)
```
Fond bleu (blue-900)
Bordure bleue (blue-400)
Shadow glow bleue
Texte blanc/clair
Badge "ACTIVE"
```

### État Blocage
```
Journal: "Aucune règle applicable"
Timeline: Dernière transition visible
Invariant: Peut être "OK" ou violation
Aucune progression possible
```

---

## Exemple Complet - Normal Workflow

```
ÉCRAN INITIAL (au chargement)
├─ En-tête: 🚦 Simulateur Murphi
├─ Feu: 🔴 ROUGE
├─ Scénario: ✓ Fonctionnement Normal (sélectionné)
├─ État: ROUGE, Invariant: ✓ OK
├─ Journal: "Initialisation... État initial: ROUGE"
└─ Timeline: #0 ROUGE

UTILISATEUR CLIQUE "Étape Suivante"
├─ Applique rule RED_TO_GREEN
├─ Feu change: 🔴 → 🟢 VERT
├─ État: VERT
├─ Journal: + "Transition: ROUGE → VERT" + "Invariant OK ✓"
├─ Timeline: + #1 VERT
└─ Règle active: surlignée en bleu

UTILISATEUR CLIQUE "Étape Suivante" ENCORE
├─ Applique rule GREEN_TO_YELLOW
├─ Feu change: 🟢 → 🟡 JAUNE
├─ État: JAUNE
├─ Journal: + 2 lignes
├─ Timeline: + #2 JAUNE
└─ Règle active: GREEN_TO_YELLOW surlignée

[... Continuer ...]

UTILISATEUR CLIQUE "Vérifier Modèle"
├─ Exécute complètement
├─ Affiche: "X états visités, Y transitions"
├─ Résultat: "Aucune violation trouvée" (green)
└─ Timeline: Pleine avec tous les états

UTILISATEUR CHANGE DE SCÉNARIO (Violation)
├─ Layout reste identique
├─ Règles changent
├─ Invariant change
├─ Timeline: reset
├─ Journal: "Passage à: Violation Scenario"
```

---

## Améliorations par Rapport à l'Avant

```
AVANT                          |  APRÈS
───────────────────────────────┼───────────────────────
Sections séparées             | Tout sur une page
Scroll vertical long          | Une seule colonne
Français partial             | 100% français
Boutons mélangés             | Sections organisées
Pas d'icônes claires         | Icônes emoji 🎯
Design basique               | Design professionnel
Pas d'info scénario          | Section dédiée
Couleurs basiques            | Palette harmonieuse
Pas d'animations             | Animations fluides
Mobile non-optimisé          | Responsive 100%
Peu de feedback              | Feedback visuel complet
```

---

Vous avez maintenant une compréhension visuelle complète du layout! 🎨

