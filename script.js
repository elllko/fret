const fretboard = document.getElementById("fretboard");
const rootSelect = document.getElementById("rootSelect");
const scaleSelect = document.getElementById("scaleSelect");
const tuningSelect = document.getElementById("tuningSelect");
const customTuningInputs = document.getElementById("customTuningInputs");
const stringInputsContainer = document.querySelector(".string-inputs");

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const scalePatterns = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentMajor: [0, 2, 4, 7, 9],
  pentMinor: [0, 3, 5, 7, 10],
  diminished: [0, 1, 3, 4, 6, 7, 9, 10]
};

const tunings = {
  EADGBE: ["E", "B", "G", "D", "A", "E"],
  DADGBE: ["E", "B", "G", "D", "A", "D"],
  DADGAD: ["D", "A", "G", "D", "A", "D"],
  EbAbDbGbBbEb: ["D#", "A#", "F#", "C#", "G#", "D#"]
};

let currentTuning = tunings.EADGBE;
const totalFrets = 12;

// Initialize dropdowns
function populateRootNotes() {
  notes.forEach(note => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    rootSelect.appendChild(option);
  });
}

// Build fretboard
function buildFretboard() {
  fretboard.innerHTML = "";
  for (let string = 0; string < 6; string++) {
    const openNote = currentTuning[string];
    const openIndex = notes.indexOf(openNote.replace("b", "#")) >= 0
      ? notes.indexOf(openNote.replace("b", "#"))
      : notes.indexOf(openNote);

    for (let fret = 0; fret <= totalFrets; fret++) {
      const note = notes[(openIndex + fret) % notes.length];
      const div = document.createElement("div");
      div.classList.add("fret");

      if (fret === 0) div.classList.add("zero-fret");
      
      div.dataset.note = note;
      div.dataset.string = 6 - string;
      div.dataset.fret = fret;
      div.textContent = note;
      fretboard.appendChild(div);
    }
  }

  addFretMarkers();
}

function addFretMarkers() {
  const markerPositions = [3, 5, 7, 9, 12];
  const markerRow = document.createElement("div");
  markerRow.classList.add("fret-markers");

  for (let fret = 0; fret <= totalFrets; fret++) {
    const marker = document.createElement("div");
    marker.classList.add("marker");

    if (markerPositions.includes(fret)) {
      if (fret === 12) marker.classList.add("double");
    } else {
      marker.style.visibility = "hidden";
    }

    markerRow.appendChild(marker);
  }

  fretboard.appendChild(markerRow);
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

function updateScale() {
  highlightScale(rootSelect.value, scaleSelect.value);
}

function updateTuning(selected) {
  if (selected === "custom") {
    showCustomTuningInputs();
    return;
  }

  customTuningInputs.style.display = "none";
  currentTuning = tunings[selected];
  buildFretboard();
  updateScale();
}

// Custom tuning input UI
function showCustomTuningInputs() {
  stringInputsContainer.innerHTML = "";
  customTuningInputs.style.display = "block";

  for (let i = 0; i < 6; i++) {
    const input = document.createElement("input");
    input.placeholder = currentTuning[i];
    input.value = currentTuning[i];
    stringInputsContainer.appendChild(input);
  }

  const applyButton = document.createElement("button");
  applyButton.textContent = "Apply";
  applyButton.style.marginLeft = "10px";
  applyButton.onclick = () => {
    const newTuning = Array.from(stringInputsContainer.querySelectorAll("input"))
      .map(input => input.value.trim());
    currentTuning = newTuning;
    buildFretboard();
    updateScale();
  };
  stringInputsContainer.appendChild(applyButton);
}

// Event listeners
rootSelect.addEventListener("change", updateScale);
scaleSelect.addEventListener("change", updateScale);
tuningSelect.addEventListener("change", e => updateTuning(e.target.value));

// Initialize
populateRootNotes();
rootSelect.value = "C";
scaleSelect.value = "major";
tuningSelect.value = "EADGBE";
buildFretboard();
highlightScale("C", "major");
