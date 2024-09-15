const form = document.getElementById("form");
const save = document.getElementById("save");
const description = document.getElementById("description");

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
    const details = document.querySelector("[name='details']").value.split(",").map(e => e.trim());
    const description = document.querySelector("[name='description']").value;
    const startDate = document.querySelector("[name='startDate']").value;
    const endDate = document.querySelector("[name='endDate']").value;
    const source = document.querySelector("[name='source']").value;
    const preview = document.querySelector("[name='preview']").value;
    const published = document.querySelector("[name='published']").checked;
    const banner = document.querySelector("[name='banner']");
    const bannerFile = banner.files[0];

    try {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("topics", topics);
        formData.append("details", details);
        formData.append("description", description);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("source", source);
        formData.append("preview", preview);
        formData.append("published", published);
        formData.append("banner", bannerFile);

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
            banner.value = null;
            document.getElementById('file-name').textContent = "📁 Upload Banner";
        }
    } catch (error) {
        console.error("Error: " + error);
        return false;
    }
})

description.addEventListener('paste', async function (event) {
    // Detect if Ctrl+V is pressed
    const clipboardItems = event.clipboardData.items;

    // Loop through clipboard items to find an image
    for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];

        // Check if the item is an image
        if (item.type.indexOf('image') !== -1) {
            // Prevent the default paste behavior
            event.preventDefault();

            const file = item.getAsFile();

            // Disable the text area while uploading
            description.disabled = true;

            // Create a FormData object for uploading
            const formData = new FormData();
            formData.append('image', file);

            try {
                // Simulate an image upload API call
                const response = await fetch('/api/admin/media/upload', {
                    method: 'POST',
                    body: formData,
                });

                // Assuming the response is a JSON object containing the URL of the uploaded image
                const data = await response.json();
                const imageUrl = data.url;

                // Insert the markdown image at the cursor position
                insertMarkdownAtCursor(`![image](${imageUrl})`);

            } catch (error) {
                console.error('Image upload failed:', error);
            } finally {
                // Re-enable the text area after upload
                description.disabled = false;
            }
        }
    }
});

function insertMarkdownAtCursor(markdown) {
    const startPos = description.selectionStart;
    const endPos = description.selectionEnd;

    // Insert the markdown at the cursor position
    const textBefore = description.value.substring(0, startPos);
    const textAfter = description.value.substring(endPos, description.value.length);
    description.value = textBefore + markdown + textAfter;

    // Move the cursor to the end of the inserted markdown
    description.selectionStart = description.selectionEnd = startPos + markdown.length;

    // Focus the textarea again
    description.focus();
}
