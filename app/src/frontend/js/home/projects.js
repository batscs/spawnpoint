document.addEventListener('DOMContentLoaded', function () {
    const topicLinks = document.querySelectorAll('.project-topics a');
    const projectsContainer = document.querySelector('.projects');
    const defaultTopic = "software";

    // Function to handle topic selection
    function handleTopicClick(topic) {
        // Disable all topic links while loading
        topicLinks.forEach(link => link.disabled = true);

        const body = topic === "all" ? {} : { filter: topic };

        fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(async data => {
                // Clear the projects container
                projectsContainer.innerHTML = '';

                // Fetch and append each project's HTML content
                for (const project of data.projects) {
                    const response = await fetch(`/api/html/project/${project.id}`);
                    const html = await response.text();

                    projectsContainer.insertAdjacentHTML('beforeend', html);
                }

                // Re-enable the topic links after loading is complete
                topicLinks.forEach(link => link.disabled = false);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                // Re-enable the topic links in case of error
                topicLinks.forEach(link => link.disabled = false);
            });
    }

    // Attach click event listeners to each topic link
    topicLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior

            // If the link is disabled, prevent click
            if (this.disabled) return;

            const topic = this.textContent.trim(); // Get the topic text

            // Remove the .selected class from all links
            topicLinks.forEach(link => link.classList.remove('selected'));

            // Add the .selected class to the clicked link
            this.classList.add('selected');

            // Fetch projects for the selected topic
            handleTopicClick(topic);
        });
    });

    // Automatically load the default topic when the page loads
    const defaultLink = Array.from(topicLinks).find(link => link.textContent.trim() === defaultTopic);
    if (defaultLink) {
        defaultLink.classList.add('selected'); // Add .selected to the default topic
        handleTopicClick(defaultTopic); // Load the projects for the default topic
    }
});
