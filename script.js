const fretboard = document.getElementById("fretboard");
const keySelect = document.getElementById("keySelect");

// Guitar tuning (standard)
const tuning = ["E", "B", "G", "D", "A", "E"]; // string 1 to 6
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Major scale intervals
const majorScaleSteps = [0, 2, 4, 5, 7, 9, 11];

// Build fretboard
const totalFrets = 12;

function buildFretboard() {
  fretboard.innerHTML = "";
  for (let string = 0; string < 6; string++) {
    const openNote = tuning[string];
    const openIndex = notes.indexOf(openNote);
    for (let fret = 0; fret <= totalFrets; fret++) {
      const note = notes[(openIndex + fret) % notes.length];
      const div = document.createElement("div");
      div.classList.add("fret");
      div.dataset.note = note;
      div.dataset.string = 6 - string;
      div.dataset.fret = fret;
      div.textContent = note;
      fretboard.appendChild(div);
    }
  }
}

// Get notes for selected key
function getMajorScaleNotes(root) {
  const rootIndex = notes.indexOf(root);
  return majorScaleSteps.map(step => notes[(rootIndex + step) % notes.length]);
}

function highlightKey(key) {
  const scaleNotes = getMajorScaleNotes(key);
  document.querySelectorAll(".fret").forEach(fret => {
    const note = fret.dataset.note;
    fret.classList.toggle("highlight", scaleNotes.includes(note));
  });
}

keySelect.addEventListener("change", e => {
  highlightKey(e.target.value);
});

// Initialize
buildFretboard();
highlightKey("C");
