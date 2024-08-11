let talks = [];
let totalPoints = 0;
const maxPoints = 11;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function updateTotalPoints() {
    document.getElementById('total-points').textContent = `Total Points: ${totalPoints} / ${maxPoints}`;
    document.getElementById('submit-btn').disabled = totalPoints !== maxPoints;
    document.getElementById('submit-data').value = getSubmitData();
}

function createCard(talk) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${talk.title}</h2>
        <p class="description">${truncateText(talk.description, 300)}</p>
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
            pointsSpan.textContent = parseInt(pointsSpan.textContent) + 1;
            updateTotalPoints();
        }
    });

    const downvoteBtn = card.querySelector('.downvote-btn');
    downvoteBtn.addEventListener('click', () => {
        if (parseInt(pointsSpan.textContent) == 0) {
            return;
        }
        if (totalPoints > 0) {
            totalPoints--;
            pointsSpan.textContent = parseInt(pointsSpan.textContent) - 1;
            updateTotalPoints();
        }
    });

    return card;
}

function showModal(talk) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close');

    modalTitle.textContent = talk.title;
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

fetch('/talks.json')
    .then(response => response.json())
    .then(data => {
        talks = data;
        shuffleArray(talks);
        const container = document.getElementById('cards-container');
        talks.forEach(talk => {
            container.appendChild(createCard(talk));
        });
    });

document.getElementById('submit-btn').addEventListener('click', submitVotes);
