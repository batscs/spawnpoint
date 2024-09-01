const form = document.getElementById("form");
const save = document.getElementById("save");

document.getElementById('banner').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'Upload Banner';
    document.getElementById('file-name').textContent = fileName;
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // TODO Eventuell save button disablen bis response vom server zurück ist
    save.disable = true;

    const name = document.querySelector("[name='name']").value;
    const topics = document.querySelector("[name='topics']").value.split(",").map(e => e.trim());
    const categories = document.querySelector("[name='categories']").value.split(",").map(e => e.trim());
    const description = document.querySelector("[name='description']").value;
    const startDate = document.querySelector("[name='startDate']").value;
    const endDate = document.querySelector("[name='endDate']").value;
    const source = document.querySelector("[name='source']").value;
    const preview = document.querySelector("[name='preview']").value;
    const published = document.querySelector("[name='published']").checked;
    const banner = document.querySelector("[name='banner']").files[0];

    try {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("topics", topics);
        formData.append("categories", categories);
        formData.append("description", description);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("source", source);
        formData.append("preview", preview);
        formData.append("published", published);
        formData.append("banner", banner);

        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        save.disable = false;

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
