// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get all the topic links
    const topicLinks = document.querySelectorAll('.project-topics a');
    const projectsContainer = document.querySelector('.projects');

    // Attach click event listeners to each topic link
    topicLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior

            const topic = this.textContent.trim(); // Get the topic text

            // Fetch projects based on the selected topic
            fetch('/api/work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filter: topic }) // Send the selected topic as a filter
            })
                .then(response => response.json())
                .then(data => {
                    // Clear the projects container
                    projectsContainer.innerHTML = '';

                    // For each project ID, fetch its corresponding HTML content
                    data.projects.forEach(project => {
                        fetch(`/api/html/project/${project.id}`)
                            .then(response => response.text()) // We expect HTML content
                            .then(html => {
                                // Directly append the HTML without wrapping it in a div
                                projectsContainer.insertAdjacentHTML('beforeend', html);
                            })
                            .catch(error => console.error('Error fetching project HTML:', error));
                    });
                })
                .catch(error => console.error('Error fetching projects:', error));
        });
    });
});
