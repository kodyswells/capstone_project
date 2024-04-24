console.log("This is connected")

const classDisplay = () => {
    axios.get('http://localhost:7000/api/fetchClasses')
        .then(function(response) {
            const classes = response.data;
            const dropdown = document.getElementById('classes-dropdown');
            dropdown.innerHTML = '';
            classes.forEach(function(cls) {
                const div = document.createElement('div');
                div.textContent = cls.class_name;
                div.className = 'dropdown-item';
                div.addEventListener('click', function() {
                    // Store the selected class index and redirect
                    localStorage.setItem('selectedClassIndex', cls.class_index);
                    window.location.href = './classes.html';  // Navigate to the class page
                });
                dropdown.appendChild(div);
            });
            dropdown.style.display = 'block';
        })
        .catch(function(error) {
            console.error('Error fetching class names:', error);
        });
};

window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('classes-dropdown');
    if (!dropdown.contains(e.target) && !document.getElementById('classes-btn').contains(e.target)) {
        dropdown.style.display = 'none';
    }
});




const classBtn = document.getElementById('classes-btn').addEventListener('click', classDisplay) 