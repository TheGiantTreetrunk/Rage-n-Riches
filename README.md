# Rage 'n' Riches

**Rage 'n' Riches** is a minimalist, high-stakes 8-bit roguelike arcade crawler designed for quick, 15-minute tactical sessions. Featuring a monochrome "Void" aesthetic, the game focuses on intense resource management, "Chemical Overload" stress mechanics, and brutal turn-based combat.

---

## 🕹️ Core Gameplay Mechanics

### 🎒 The 10-Item "Cargo Bay"
Survival depends on your 10-slot inventory limit. Players must strategically balance combat buffs, healing supplies, and utility items. Every pick-up is a choice.
* **Limited Capacity:** A strict 10-item cap forces constant inventory triage.
* **Consumable Categories:** Including Damage Boosters, Strength Potions, Health Kits, and Stress-Relief Scrolls.

### 🧠 "Chemical Overload" Stress System
Every action has a psychological cost. The Stress System prevents "stat-padding" and forces careful timing.
* **Action-Induced Stress:** Attacking while buffed or consuming performance-enhancing potions increases your Stress Level.
* **Mental Stages:** Transitions through **CALM**, **ANXIOUS**, **STRESSED**, and **PANIC**.
* **Panic State:** Reaching maximum stress triggers a Panic debuff, reducing physical effectiveness and combat accuracy.

### ⚔️ Tactical Combat & Intelligence
Enemies aren't just damage sponges—they possess simple decision-making AI.
* **Reactive AI:** Enemies may "Berserk" at low health or "Sunder" your defenses if you are heavily armored.
* **Quick Actions:** A streamlined 2x3 grid allows for rapid tactical decisions between Attacking, Analyzing, and Consuming.

---

## 🎭 Character Classes

The game features 8 distinct classes, each designed with unique stat distributions and categorized abilities:

1.  **Fighter:** High physical durability and steady damage output.
2.  **Alchemist:** Experts in chemistry; they take reduced stress from potion consumption.
3.  **Theologian:** Focuses on mental fortitude and stress management.
4.  **Ranger:** High mobility and critical strike potential.
5.  **Monk:** Balanced stats with unique self-buffing capabilities.
6.  **Knight:** The ultimate tank, built to soak damage at the cost of mobility.
7.  **Troubadour:** Influences combat flow and enemy morale.
8.  **Artillerist:** High-risk, high-reward glass cannon with massive damage potential.

---

## 🖥️ Technical Design & Aesthetic

### "The Void" UI
* **Monochrome Palette:** A strict Black, White, and Grey aesthetic for high-contrast visibility.
* **Minimalist HUD:** No borders, no clutter. The UI floats in the "void," utilizing a diagnostic terminal style.
* **Mobile-First:** Designed with the Google Pixel 10 (Tensor G5) in mind, featuring large touch-targets and a centered 80% width layout for one-handed play.

### Tech Stack
* **Engine:** Pure HTML5 / CSS3 / JavaScript (No external libraries).
* **UI:** Absolute-centered modals and CSS Grid-based inventory layouts.
* **Art:** ASCII art aesthetics combined with custom 8-bit icon mapping.

---

## 🛠️ Project Evolution (v1.0)
The project is currently in active development, focusing on "Earnest" design and mechanical transparency. Recent updates include:
* Consolidation of the `checkPlayerDeath` safety protocol.
* Implementation of the borderless Monochrome Loot and Stats screens.
* Integration of the "Breathe" action for tactical stress reduction.

---