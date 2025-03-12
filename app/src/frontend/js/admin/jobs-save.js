document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form.jobs").addEventListener("submit", async function (event) {
        event.preventDefault();

        const jobElements = Array.from(document.querySelectorAll(".job")).reverse(); // Von unten nach oben

        const jobsData = jobElements.map((job, index) => {
            return {
                id: index + 1, // ID beginnt unten mit 1 und zählt hoch
                name: job.querySelector(".job-name")?.value.trim() || "",
                title: job.querySelector(".job-title")?.value.trim() || "",
                timeline: job.querySelector(".job-timeline")?.value.trim() || "",
                description: job.querySelector(".job-description")?.innerText.trim() || ""
            };
        });

        console.log(JSON.stringify(jobsData, null, 2)); // Ausgabe als JSON für Debugging

        try {
            const response = await fetch(window.location.href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobs: jobsData })
            });

            const data = await response.json();

            if (data.error) {
                alert("error: " + data.error);
            } else {
                alert("saved successfully.");
            }
        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    });
});
