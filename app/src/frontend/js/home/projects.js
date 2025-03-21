document.addEventListener("DOMContentLoaded", () => {
    filterProjects(); // Ensure only relevant projects are shown on load

    document.querySelector('.search').addEventListener('input', filterProjects);

    // "unclick" a filterer selection box
    document.addEventListener("click", (event) => {
        const filterDivs = document.querySelectorAll('.filter');
        const filterButtons = document.querySelectorAll('.filter-topics button, .filter-years button');

        // If the click is outside the filter container or button, hide the filters
        filterDivs.forEach(filterDiv => {
            const button = filterDiv.previousElementSibling; // Get the button that opened the filter
            if (!filterDiv.contains(event.target) && !button.contains(event.target)) {
                filterDiv.classList.add('hidden');
                button.classList.remove('active');
            }
        });
    });
});

// Toggle filter dropdown visibility
function toggleFilter(event) {
    const button = event.target;
    const filterDiv = button.nextElementSibling;

    if (filterDiv && filterDiv.classList.contains("filter")) {
        filterDiv.classList.toggle("hidden");
        button.classList.toggle("active");
    }
}

// Filtering projects based on selected topics and years
function filterProjects() {
    // Get search query (convert to lowercase for case-insensitive matching)
    const searchQuery = document.querySelector('.search').value.toLowerCase().trim();

    // Get selected topics
    const selectedTopics = Array.from(document.querySelectorAll('.filter-topics input:checked'))
        .map(input => input.value);

    // Get selected years
    const selectedYears = Array.from(document.querySelectorAll('.filter-years input:checked'))
        .map(input => input.value);

    // Get all project cards
    const projects = document.querySelectorAll('.card-project-wrapper');

    projects.forEach(project => {
        const projectName = project.querySelector('.name').textContent.toLowerCase();
        const projectStartDate = project.dataset.startDate;
        const projectEndDate = project.querySelector('.text-mediumsmall:nth-of-type(2)')?.textContent.trim() || "";
        const projectTopics = JSON.parse(project.dataset.topics).map(topic => topic.toLowerCase());
        const projectDetails = Array.from(project.querySelectorAll('.info p')).map(p => p.textContent.toLowerCase());

        // Combine all searchable content
        const projectContent = [
            projectName,
            projectStartDate,
            projectEndDate,
            ...projectTopics,
            ...projectDetails
        ].join(" ");

        // Check if project matches search query
        const matchesSearch = searchQuery === "" || projectContent.includes(searchQuery);

        // Check if project matches selected filters
        const matchesTopics = selectedTopics.length === 0 || projectTopics.some(topic => selectedTopics.includes(topic));
        const matchesYear = selectedYears.length === 0 || selectedYears.includes(projectStartDate.split("-")[0]);

        // Show or hide project based on filters
        project.style.display = matchesSearch && matchesTopics && matchesYear ? "flex" : "none";
    });
}

