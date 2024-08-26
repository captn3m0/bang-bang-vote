let talks = [];
let totalPoints = 0;
const maxPoints = 11;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function truncateText(text, extraText, maxLength) {
    if (text.length + extraText.length <= maxLength) return text;
    return text.substr(0, maxLength - extraText.length ) + '...';
}

function updateTotalPoints() {
    document.getElementById('submit-btn').disabled = totalPoints !== maxPoints;
    document.getElementById('submit-data').value = getSubmitData();
}

function createCard(talk) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${talk.title}</h2>
        <p class="description">${truncateText(talk.description, talk.title, 300)}</p>
        <button class="expand-btn">Read More</button>
        <button class="downvote-btn">-</button>
        <button class="upvote-btn">+</button>
        <span class="points">0</span>
    `;

    const expandBtn = card.querySelector('.expand-btn');
    expandBtn.addEventListener('click', () => showModal(talk));
    document.getElementById('modal').addEventListener('click', ()=>{
        document.getElementById('modal').style.display = 'none';
    });

    const upvoteBtn = card.querySelector('.upvote-btn');
    const pointsSpan = card.querySelector('.points');
    upvoteBtn.addEventListener('click', () => {
        if (totalPoints < maxPoints) {
            totalPoints++;
            const currentPoints = parseInt(pointsSpan.textContent) + 1;
            pointsSpan.textContent = currentPoints;
            updateTotalPoints();
            updatePointsLeft();
            if (currentPoints > 0) {
                card.classList.add('voted');
            }
        }
    });

    const downvoteBtn = card.querySelector('.downvote-btn');
    downvoteBtn.addEventListener('click', () => {
        if (parseInt(pointsSpan.textContent) == 0) {
            card.classList.remove('voted');
            return;
        }
        if (totalPoints > 0) {
            totalPoints--;
            pointsSpan.textContent = parseInt(pointsSpan.textContent) - 1;
            updateTotalPoints();
            updatePointsLeft();
        }
    });

    return card;
}

function showModal(talk) {
    const modal = document.getElementById('modal');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close');

    modalDescription.textContent = talk.description;
    modal.style.display = 'block';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function getSubmitData() {
    const votes = Array.from(document.querySelectorAll('.card')).map(card => ({
        title: card.querySelector('h2').textContent,
        points: parseInt(card.querySelector('.points').textContent)
    })).filter(vote => vote.points > 0);

    return JSON.stringify(votes);
}

let visibleCardIndex = 0;

function updateScrollMeter() {
    const scrollPosition = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = documentHeight - windowHeight;
    
    const scrollPercentage = Math.min(100, Math.round((scrollPosition / scrollableDistance) * 100));
    
    const scrollMeter = document.getElementById('scroll-meter');
    const scrollCount = document.getElementById('scroll-count');
    
    scrollMeter.value = scrollPercentage;
}

function updatePointsLeft() {
    const pointsLeftElement = document.getElementById('points-left');
    pointsLeftElement.textContent = maxPoints - totalPoints;
}

// Add these event listeners at the end of your script
window.addEventListener('scroll', updateScrollMeter);
window.addEventListener('resize', updateScrollMeter);

// Modify the existing fetch call to include these new function calls
fetch('/talks.json')
    .then(response => response.json())
    .then(data => {
        talks = data;
        shuffleArray(talks);
        const container = document.getElementById('cards-container');
        talks.forEach(talk => {
            container.appendChild(createCard(talk));
        });
        updateScrollMeter();
        updatePointsLeft();
    });
