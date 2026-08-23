# HemoLab

**An interactive hemodynamics simulator built as a self-directed learning project during a career transition from software engineering to nursing and CRNA practice.**

Live at: [perfusia.github.io/hemodynamics](https://perfusia.github.io/hemodynamics)

---

## What it is

HemoLab is a browser-based hemodynamics simulator designed for nursing students, ICU nurses, and CRNA candidates who want to understand the physiological relationships that drive blood pressure — not just memorize numbers.

The core idea: every lesson teaches a concept first, then makes it interactive. You read about MAP = CO × SVR, and the equation is right there responding to your input as you read. You load a septic shock scenario and watch MAP collapse as SVR crashes. You apply norepinephrine and watch it recover. The lesson and the simulation are inseparable.

---

## Why I built this

I'm a senior Android/software engineer at DoorDash transitioning into nursing with the goal of becoming a Certified Registered Nurse Anesthetist (CRNA). I'm currently completing A&P prerequisites for an accelerated BSN program.

Hemodynamics is foundational to everything a CRNA does — every drug decision, every induction, every crisis response traces back to MAP = CO × SVR. I built HemoLab to learn it deeply, not just well enough to pass an exam. The simulator forced me to understand every equation, every drug mechanism, and every clinical scenario well enough to implement it correctly.

The project is part of a larger platform called [Perfusia](https://github.com/perfusia) — a suite of free, open clinical education tools for advanced nursing practice.

---

## Lessons

### Lesson 1 — MAP = CO × SVR (complete)

The master equation of hemodynamics. Mean Arterial Pressure is the product of Cardiac Output and Systemic Vascular Resistance.

**What you can do:**
- Adjust CO and SVR with zoned sliders that show normal ranges visually
- Watch MAP recalculate in real time with clinical severity color coding
- Load clinical scenarios: normal baseline, septic shock, cardiogenic shock, propofol induction, hypertensive crisis
- Apply vasoactive drugs (norepinephrine, phenylephrine, vasopressin, dobutamine, epinephrine, propofol, nitroprusside) and observe how each shifts CO and SVR based on its receptor mechanism

### Lesson 2 — Cardiac Output: HR × SV *(coming soon)*

Preload, afterload, contractility, and the Frank-Starling curve.

### Lesson 3 — Vascular Resistance and Compensation *(planned)*

Baroreceptor reflex, sympathetic tone, and how the body compensates for hemodynamic instability.

### Lesson 4 — Preload and Volume Status *(planned)*

CVP, fluid responsiveness, and when to give fluid versus pressors.

### Lesson 5 — Drug Effects on Hemodynamics *(planned)*

Vasopressors, inotropes, and anesthetic agents in depth.

### Lesson 6 — Clinical Scenarios *(planned)*

Septic shock, cardiogenic shock, obstructive shock, and anesthesia induction — full scenario engine with decision-making.

---

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Hosted on GitHub Pages

---

## Project structure

```
src/
  components/       React components
  data/             Drug and scenario data
  types/            TypeScript interfaces
  utils/            Hemodynamic equations and helpers
```

---

## Clinical accuracy

Every equation, normal range, and drug effect in this simulator is sourced from standard references:

- Guyton and Hall *Textbook of Medical Physiology* (14th ed.)
- Miller's *Anesthesia* (9th ed.)
- Goodman & Gilman's *Pharmacological Basis of Therapeutics* (13th ed.)
- Surviving Sepsis Campaign guidelines

Drug effects are representative educational approximations. Real clinical responses vary by dose, patient physiology, and context. This tool is for learning, not clinical decision-making.

---

## Part of Perfusia

HemoLab is the first tool in the [Perfusia](https://github.com/perfusia) open clinical education platform. Planned tools include PharmSim (drug mechanism visualizer), VentSim (mechanical ventilation), and ShockLab (shock state differentiation).

All tools are and will remain free and open source.

---

## License

MIT