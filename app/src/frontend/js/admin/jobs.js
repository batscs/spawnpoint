document.addEventListener("DOMContentLoaded", function () {
    const jobsContainer = document.querySelector("form.jobs");
    let draggedItem = null;

    // Helper: Resize textareas inside a given parent.
    function resizeTextareas(parent) {
        parent.querySelectorAll("textarea").forEach(textarea => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    }

    // Helper: Remove the drag-over class from all job elements.
    function removeDragOverFromAll() {
        document.querySelectorAll(".job.drag-over").forEach(job => {
            job.classList.remove("drag-over");
        });
    }

    // Helper: Determine after which element the dragged item should be inserted.
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".job:not(.dragging)")];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Attach all necessary event listeners to a job element.
    function attachJobListeners(job) {
        // Initially ensure the job is not draggable.
        job.draggable = false;

        // When mousedown occurs, only enable dragging if the click did NOT occur on an interactive element.
        job.addEventListener("mousedown", function (event) {
            const interactiveTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"];
            if (interactiveTags.includes(event.target.tagName)) {
                job.draggable = false;
            } else {
                job.draggable = true;
            }
        });

        // Drag & Drop events.
        job.addEventListener("dragstart", function (event) {
            // If dragging wasn’t enabled, cancel the drag.
            if (!job.draggable) {
                event.preventDefault();
                return;
            }
            draggedItem = job;
            job.classList.add("dragging");
            event.dataTransfer.effectAllowed = "move";

            // Calculate the mouse offset relative to the job element.
            const rect = job.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            // Create a ghost image to improve dragging visuals.
            const ghost = job.cloneNode(true);
            ghost.style.position = "absolute";
            ghost.style.top = "-1000px";
            ghost.style.left = "-1000px";
            document.body.appendChild(ghost);
            event.dataTransfer.setDragImage(ghost, offsetX, offsetY);
            setTimeout(() => document.body.removeChild(ghost), 0);
            // Firefox workaround.
            event.dataTransfer.setData("text/plain", "");
        });

        job.addEventListener("dragend", function () {
            job.classList.remove("dragging");
            draggedItem = null;
            job.draggable = false; // disable dragging until next mousedown on a non-interactive element
            removeDragOverFromAll();
        });

        // Visual feedback when dragging over a job.
        job.addEventListener("dragenter", function () {
            if (job !== draggedItem) {
                job.classList.add("drag-over");
            }
        });
        job.addEventListener("dragleave", function () {
            job.classList.remove("drag-over");
        });
        job.addEventListener("drop", function () {
            job.classList.remove("drag-over");
        });

        // Collapse/Expand functionality.
        const collapsable = job.querySelector(".collapsable");
        if (collapsable) {
            // Start collapsed.
            collapsable.classList.add("collapsed");
            collapsable.addEventListener("click", function (event) {
                // Only toggle if not clicking on an interactive element.
                const interactiveTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"];
                if (interactiveTags.includes(event.target.tagName)) return;
                collapsable.classList.toggle("collapsed");
                if (!collapsable.classList.contains("collapsed")) {
                    resizeTextareas(collapsable);
                }
            });
        }

        // Delete functionality.
        const deleteButton = job.querySelector(".delete");
        if (deleteButton) {
            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                job.remove();
            });
        }
    }

    // Attach listeners to all existing job elements.
    document.querySelectorAll(".job").forEach(job => {
        attachJobListeners(job);
    });

    // Container dragover: reorder jobs on drag.
    jobsContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
        if (!draggedItem) return;
        const afterElement = getDragAfterElement(jobsContainer, event.clientY);
        if (!afterElement) {
            jobsContainer.appendChild(draggedItem);
        } else {
            jobsContainer.insertBefore(draggedItem, afterElement);
        }
    });

    jobsContainer.addEventListener("drop", function (event) {
        event.preventDefault();
    });

    // Create new job element on clicking the .create button.
    const createButton = document.querySelector(".create");
    if (createButton) {
        createButton.addEventListener("click", function (event) {
            event.preventDefault();
            const newJob = document.createElement("div");
            newJob.classList.add("job", "draggable");
            newJob.innerHTML = `
        <div class="job-details collapsable collapsed">
          <a class="not-collapsable">Name</a>
          <input class="job-name not-collapsable" value="">
          <a>Title</a>
          <input class="job-title" value="">
          <a>Timeline</a>
          <input class="job-timeline" value="">
          <a>Description</a>
          <textarea class="job-description"></textarea>
        </div>
        <a class="delete">X</a>
      `;
            jobsContainer.appendChild(newJob);
            attachJobListeners(newJob);
        });
    }
});
