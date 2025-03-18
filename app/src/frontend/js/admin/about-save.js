document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.querySelector("button[type='submit']");

    saveButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const techstackInput = document.querySelector("input.techstack").value.trim();
        const interestsInput = document.querySelector("input.interests").value.trim();
        const emailInput = document.querySelector("input.email").value.trim();

        // Clean the inputs by removing square brackets and extra quotes
        const cleanInput = (input) => {
            // Remove the surrounding square brackets and extra quotes
            input = input.replace(/^\[|\]$/g, ""); // Remove the outer brackets
            return input.split(",").map(item => item.replace(/^"|"$/g, "").trim()); // Remove quotes and trim spaces
        };

        const techstackArray = techstackInput ? cleanInput(techstackInput) : [];
        const interestsArray = interestsInput ? cleanInput(interestsInput) : [];

        const about = {
            techstack: techstackArray,
            interests: interestsArray,
            email: emailInput
        };

        const requestData = {about};

        const response = await fetch("/admin/about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.error) {
            alert("error: " + data.error);
        } else {
            alert("saved successfully.");
        }
    });
});
