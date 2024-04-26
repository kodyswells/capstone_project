document.addEventListener('DOMContentLoaded', function() {
    fetchFavorites();
    setupModal();
});

function fetchFavorites() {
    axios.get('http://localhost:7000/api/favorites')
        .then(response => {
            const favorites = response.data;
            displayFavorites(favorites);
        })
        .catch(error => {
            console.error('Error fetching favorite spells:', error);
        });
}

function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';  // Clear previous entries

    favorites.forEach(spell => {
        const spellItem = document.createElement('div');
        spellItem.className = 'spell-item';
        spellItem.textContent = spell.spell_name;
        spellItem.setAttribute('data-id', spell.spell_id);

        const star = document.createElement('span'); 
        star.innerHTML = '★';  // Always favorite on this page
        star.className = 'favorite-icon';
        star.onclick = (event) => {
            event.stopPropagation();  // Prevent triggering the spell detail view
            removeFavorite(spell);  // Directly call removeFavorite without toggling
        };
        spellItem.appendChild(star);
        spellItem.onclick = () => showSpellDetails(spell);
        container.appendChild(spellItem);
    });
}

function removeFavorite(spell) {
    const url = `http://localhost:7000/api/favorites/${spell.spell_id}`;
    axios.delete(url)
        .then(response => {
            console.log('Removed from favorites:', response.data);
            removeSpellFromDisplay(spell); // Remove the spell from the display
            alert(`${spell.spell_name} removed from favorites!`);
        })
        .catch(error => {
            console.error('Error removing spell from favorites:', error);
        });
}

function removeSpellFromDisplay(spell) {
    const spellDiv = document.querySelector(`.spell-item[data-id="${spell.spell_id}"]`);
    if (spellDiv) {
        spellDiv.parentNode.removeChild(spellDiv); // Remove the spell item from the DOM
    }
}

function showSpellDetails(spell) {
    const spellModal = document.getElementById('spellModal');
    const spellTitle = document.getElementById('spellTitle');
    const spellDetails = document.getElementById('spellDetails');

    spellTitle.textContent = spell.spell_name;
    spellDetails.innerHTML = formatSpellDetails(spell);
    spellModal.style.display = 'block';
}

function setupModal() {
    const modal = document.getElementById('spellModal');
    const closeModal = document.getElementsByClassName('close')[0];
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function formatSpellDetails(spell) {
    return `
        <strong>Description:</strong> ${spell.spell_info}<br>
        <strong>Range:</strong> ${spell.spell_range}<br>
        <strong>Components:</strong> ${spell.spell_components}<br>
        ${spell.spell_material ? `<strong>Materials:</strong> ${spell.spell_material}<br>` : ''}
        <strong>Duration:</strong> ${spell.spell_duration}<br>
        <strong>Casting Time:</strong> ${spell.spell_casting_time}<br>
        <strong>Level:</strong> ${spell.spell_level}<br>
        ${spell.spell_ritual ? '<strong>Ritual:</strong> Yes<br>' : ''}
        ${spell.spell_concentration ? '<strong>Concentration:</strong> Yes<br>' : ''}
        <strong>School of Magic:</strong> ${spell.school_of_magic}<br>
        <strong>Classes:</strong> ${spell.classes}`;
}
