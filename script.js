
// --- Theme Toggle ---
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Apply saved theme on load (before DOMContentLoaded if possible for smoother transition)
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (toggleBtn) { 
        toggleBtn.textContent = '☀️';
    }
} else {
    body.classList.remove('dark-mode');
    if (toggleBtn) { 
        toggleBtn.textContent = '🌙';
    }
}


// --- Typewriter Effect ---
const messages = ["A letter to your future self..."]; 
let idx = 0;
let charIndex = 0;
const typingSpeed = 120;
const autoTypeElem = document.getElementById("auto-type");

function type() {
    if (autoTypeElem && charIndex < messages[idx].length) { 
        autoTypeElem.textContent += messages[idx].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    }
}

// --- Sparkle Animation ---
const hero = document.querySelector('.hero');
const sparkleCount = 80;

function createSparkles() {
    if (!hero) return; 

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        const pastelColors = [
            'rgba(255, 200, 250, 0.7)',
            'rgba(255, 240, 180, 0.7)',
            'rgba(210, 240, 255, 0.7)',
            'rgba(230, 200, 255, 0.7)',
            'rgba(255, 255, 200, 0.6)'
        ];
        const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        sparkle.style.backgroundColor = color;
        sparkle.style.boxShadow = `0 0 8px ${color}`;

        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;

        sparkle.style.animationDelay = `${Math.random() * 3}s`;
        sparkle.style.animationDuration = `${1.5 + Math.random()}s`;

        hero.appendChild(sparkle);
    }
}

// --- Carousel Logic ---
const slides = document.querySelectorAll('.carousel-slide');
let slideIndex = 0; 

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        slide.querySelector('.progress-bar').style.animation = 'none'; 
        void slide.offsetWidth; 
    });
    if (slides[i]) { 
        slides[i].classList.add('active');
        slides[i].querySelector('.progress-bar').style.animation = 'progress 5s linear forwards';
    }
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

// Auto-advance carousel
let carouselInterval;
function startCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    carouselInterval = setInterval(nextSlide, 5000); 
}


// --- Snackbar Notification ---
function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    if (!snackbar) return; 
    snackbar.textContent = message;
    snackbar.classList.add("show");
    setTimeout(() => {
        snackbar.classList.remove("show");
    }, 3000); 
}

// --- Letter Saving & Display Logic ---
function displayAllNotes() {
    const notesContainer = document.getElementById("notes-container");
    if (!notesContainer) return; 

    notesContainer.innerHTML = ''; 
    const storedLetters = JSON.parse(localStorage.getItem("futureLetters") || "[]");

    if (storedLetters.length === 0) {
        notesContainer.innerHTML = '<p style="color: gray; font-size: 1.1rem; margin-top: 2rem;">No letters saved yet. Write one above!</p>';
        return;
    }

    storedLetters.forEach((letterData, index) => {
        if (!letterData || !letterData.deliverIn || typeof letterData.deliverIn !== 'string') {
            console.warn(`Skipping malformed entry at index ${index}`, letterData);
            return;
        }
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");

        const date = new Date(letterData.date);
        const savedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
       
        const deliverDate = new Date(date); 
        deliverDate.setFullYear(date.getFullYear() + parseInt(letterData.deliverIn.split(' ')[0]));

        noteCard.innerHTML = `
            <p class="note-text">${letterData.text}</p>
            <div class="note-meta">
                <p>Saved on: ${savedDate}</p>
                <p>Deliver in: ${letterData.deliverIn} (around ${deliverDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})</p>
            </div>
            <button class="read-more" data-index="${index}">Read Full Letter</button>
        `;
        notesContainer.appendChild(noteCard);
    });

    notesContainer.querySelectorAll(".read-more").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            showFullLetter(index);
        });
    });
}


function showFullLetter(index) {
    const storedLetters = JSON.parse(localStorage.getItem("futureLetters") || "[]");
    const letterData = storedLetters[index];

    if (!letterData) {
        showSnackbar("Error: Letter not found.");
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("note-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal-btn">&times;</button>
            <h3>Your Letter to Future You</h3>
            <p>${letterData.text}</p>
            <div class="note-meta">
                <p>Saved on: ${new Date(letterData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Deliver in: ${letterData.deliverIn}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add("active"), 10);

    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
        modal.classList.remove("active");
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            setTimeout(() => modal.remove(), 300);
        }
    });
}


// --- DOMContentLoaded Event Listener ---
document.addEventListener("DOMContentLoaded", () => {
    type(); 
    createSparkles(); 
    showSlide(slideIndex); 
    startCarouselAutoPlay(); 

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            if (body.classList.contains('dark-mode')) {
                toggleBtn.textContent = '☀️';
            } else {
                toggleBtn.textContent = '🌙';
            }
        });
    }

    // Submit button for letters
    const submitBtn = document.getElementById("submit");
    if (submitBtn) {
        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const letterInput = document.getElementById("letter");
            const durationSelect = document.getElementById("duration");
            const envelope = document.getElementById("envelope");
            const sound = document.getElementById("envelopeSound");
            const glassForm = document.querySelector(".glass-form");
            const confirmationDiv = document.getElementById("confirmation");
            const backToHomeBtn = document.getElementById('backToHomeBtn'); 

            if (!letterInput || !durationSelect || !envelope || !sound || !glassForm || !confirmationDiv) {
                console.error("One or more required elements for letter submission are missing.");
                return;
            }

            const letter = letterInput.value.trim();
            const duration = durationSelect.value;

            if (letter === "") {
                showSnackbar("Please write your letter first 🌸");
                return;
            }

            const entry = {
                text: letter,
                deliverIn: `${duration} year(s)`,
                date: new Date().toISOString()
            };

            const existingLetters = JSON.parse(localStorage.getItem("futureLetters") || "[]");
            existingLetters.push(entry);
            localStorage.setItem("futureLetters", JSON.stringify(existingLetters));

            envelope.classList.remove("hidden");
            envelope.classList.add("fly");

            sound.currentTime = 0;
            sound.play();

            glassForm.classList.add("hidden");
            confirmationDiv.classList.remove("hidden");

            // After confirmation, automatically scroll to view notes or display notes
            setTimeout(() => {
                confirmationDiv.classList.add("hidden");
                envelope.classList.remove("fly");
                envelope.classList.add("hidden");

                letterInput.value = ""; 
                durationSelect.value = "1";
                glassForm.classList.remove("hidden"); 

                // Instead of just showing snackbar, navigate/display notes
                // showSnackbar("Letter Sealed! Your words are safe in the universe ✨");
                displayAllNotes(); // Refresh and display all notes
                // Optionally scroll to the notes section
                const listNotesSection = document.getElementById("list-notes");
                if (listNotesSection) {
                    listNotesSection.style.display = 'block'; // Make sure the section is visible
                    listNotesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            }, 3000); 
        });
    }

    // Event Listener for "Write Another Letter" button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            const listNotesSection = document.getElementById("list-notes");
            const writeLetterSection = document.getElementById("write");

            if (listNotesSection) {
                listNotesSection.style.display = 'none'; 
            }
            if (writeLetterSection) {
                writeLetterSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
            
            const glassForm = document.querySelector(".glass-form");
            if (glassForm) {
                glassForm.classList.remove("hidden");
            }
        });
    }

    // Initial display of notes when the page loads
    displayAllNotes();

    // Event listener for showing full letters (delegated)
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
        notesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more')) {
                const index = e.target.dataset.index;
                showFullLetter(index);
            }
        });
    }

    // Close view letter button (from your HTML)
    const closeViewLetterBtn = document.getElementById("closeViewLetter");
    if (closeViewLetterBtn) {
        closeViewLetterBtn.addEventListener('click', () => {
            const viewLetterSection = document.getElementById("view-letter");
            if (viewLetterSection) {
                viewLetterSection.style.display = 'none';
            }
        });
    }
});