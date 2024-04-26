document.addEventListener('DOMContentLoaded', function() {
    axios.get('http://localhost:7000/api/fetchSpells')
        .then(response => {
            allSpells = response.data;
            const groupedAndSortedSpells = groupAndSortSpells(allSpells);
            displaySpells(groupedAndSortedSpells);
        })
        .catch(error => {
            console.error('Error fetching spells:', error);
        });

    setupModal();
});

function filterSpells() {
    const searchText = document.getElementById('spellSearch').value.toLowerCase();
    const filteredSpells = allSpells.filter(spell => 
        spell.spell_name.toLowerCase().includes(searchText)
    );
    const groupedAndSortedSpells = groupAndSortSpells(filteredSpells);
    displaySpells(groupedAndSortedSpells);
}

function groupAndSortSpells(spells) {
    // Group spells by level
    const grouped = spells.reduce((acc, spell) => {
        const levelKey = spell.spell_level === '0' ? 'Cantrip' : `Level ${spell.spell_level}`;
        if (!acc[levelKey]) {
            acc[levelKey] = [];
        }
        acc[levelKey].push(spell);
        return acc;
    }, {});

    // Sort spells within each level alphabetically
    Object.keys(grouped).forEach(level => {
        grouped[level].sort((a, b) => a.spell_name.localeCompare(b.spell_name));
    });

    return grouped;
}

function displaySpells(groupedSpells) {
    const spellsContainer = document.getElementById('spellsContainer');
    spellsContainer.innerHTML = '';  // Clear previous entries

    Object.keys(groupedSpells).sort().forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'spell-level';

        const levelHeader = document.createElement('h3');
        levelHeader.textContent = level;
        levelDiv.appendChild(levelHeader);

        const spellList = document.createElement('ul');
        groupedSpells[level].forEach(spell => {
            const spellItem = document.createElement('li');
            spellItem.className = 'spell-item';
            spellItem.textContent = spell.spell_name;
            spellItem.setAttribute('data-id', spell.spell_id);  // Set data-id attribute for reference

            const star = document.createElement('span');  // Icon for favoriting
            star.innerHTML = spell.is_favorite ? '★' : '☆';  // Conditionally render based on favorite status
            star.className = 'favorite-icon';
            star.onclick = (event) => {
                event.stopPropagation();  // Prevent triggering the spell detail view
                toggleFavorite(spell);
            };
            spellItem.appendChild(star);
            spellItem.onclick = () => showSpellDetails(spell);
            spellList.appendChild(spellItem);
        });

        levelDiv.appendChild(spellList);
        spellsContainer.appendChild(levelDiv);
    });
}

function addFavorite(spell) {
    const url = `http://localhost:7000/api/favorites`;
    axios.post(url, { spell_id: spell.spell_id })
        .then(response => {
            console.log('Added to favorites:', response.data);
            spell.is_favorite = true; // Update the state to reflect the favorite status
            updateSpellDisplay(spell);
            //alert(`${spell.spell_name} added to favorites!`);
        })
        .catch(error => {
            console.error('Error adding spell to favorites:', error);
        });
}

function removeFavorite(spell) {
    const url = `http://localhost:7000/api/favorites/${spell.spell_id}`;
    console.log(spell.spell_id)
    axios.delete(url)
        .then(response => {
            console.log('Removed from favorites:', response.data);
            spell.is_favorite = false; // Update the state to reflect the non-favorite status
            updateSpellDisplay(spell);
            //alert(`${spell.spell_name} removed from favorites!`);
        })
        .catch(error => {
            console.error('Error removing spell from favorites:', error.response ? error.response.data : 'Unknown error');
            alert(`Failed to remove ${spell.spell_name} from favorites: ${error.response ? error.response.data.message : 'Unknown error'}`);
        });
}

function toggleFavorite(spell) {
    if (spell.is_favorite) {
        removeFavorite(spell);
        spell.is_favorite = false;
    } else {
        addFavorite(spell);
        spell.is_favorite = true;
    }
    updateSpellDisplay(spell);
}

function updateSpellDisplay(spell) {
    const spellDiv = document.querySelector(`.spell-item[data-id="${spell.spell_id}"]`);
    if (spellDiv) {
        const star = spellDiv.querySelector('.favorite-icon');
        star.innerHTML = spell.is_favorite ? '★' : '☆'; // Update the star based on favorite status
    }
}

function showSpellDetails(spell) {
    const spellModal = document.getElementById('spellModal');
    const spellTitle = document.getElementById('spellTitle');
    const spellDetails = document.getElementById('spellDetails');
    const favoriteIcon = document.querySelector('.favorite-icon');

    spellTitle.textContent = spell.spell_name;
    spellDetails.innerHTML = `
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
    
    // Update the favorite icon based on whether the spell is a favorite
    favoriteIcon.classList.toggle('active', spell.is_favorite);
    favoriteIcon.onclick = () => toggleFavorite(spell); // Attach the toggle functionality

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