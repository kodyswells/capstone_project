document.addEventListener('DOMContentLoaded', function() {
    const classIndex = localStorage.getItem('selectedClassIndex');
    if (classIndex) {
        axios.get(`http://localhost:7000/api/classes/${classIndex}`)
            .then(function(response) {
                const classInfo = response.data;
                displayClassDetails(classInfo);
            })
            .catch(function(error) {
                console.error('Error fetching class details:', error);
            });
    }
});

function displayClassDetails(classInfo) {
    const container = document.getElementById('class-info-container');  // Make sure this container exists in your HTML
    container.innerHTML = `
        <h1>${classInfo.class_name}</h1>
        <p>Hit Die: ${classInfo.hit_die}</p>
        <p>Proficiency Choices: ${classInfo.proficiency_choices}</p>
        <p>Saving Throws: ${classInfo.saving_throws}</p>
    `;
}