const form = document.getElementById("form");
const save = document.getElementById("save");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // TODO Eventuell save button disablen bis response vom server zurück ist

    try {
        const formData = new FormData(form);
        console.log(formData);

        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            alert("error: " + data.error);
        } else {
            alert("saved successfully.");
        }
    } catch (error) {
        console.error("Error: " + error);
        return false;
    }
})
