const fretboard = document.getElementById("fretboard");
const rootSelect = document.getElementById("rootSelect");
const scaleSelect = document.getElementById("scaleSelect");

const tuning = ["E", "B", "G", "D", "A", "E"]; // string 1 → 6
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Scale patterns in semitones
const scalePatterns = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentMajor: [0, 2, 4, 7, 9],
  pentMinor: [0, 3, 5, 7, 10]
};

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

function getScaleNotes(root, pattern) {
  const rootIndex = notes.indexOf(root);
  return pattern.map(step => notes[(rootIndex + step) % notes.length]);
}

function highlightScale(root, scaleType) {
  const pattern = scalePatterns[scaleType];
  const scaleNotes = getScaleNotes(root, pattern);

  document.querySelectorAll(".fret").forEach(fret => {
    const note = fret.dataset.note;
    fret.classList.toggle("highlight", scaleNotes.includes(note));
  });
}

// Populate root note dropdown
function populateRootNotes() {
  notes.forEach(note => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    rootSelect.appendChild(option);
  });
}

rootSelect.addEventListener("change", updateScale);
scaleSelect.addEventListener("change", updateScale);

function updateScale() {
  highlightScale(rootSelect.value, scaleSelect.value);
}

// Initialize
populateRootNotes();
buildFretboard();
rootSelect.value = "C";
scaleSelect.value = "major";
highlightScale("C", "major");
