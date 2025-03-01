document.addEventListener("DOMContentLoaded", async function () {
    const emailInput = document.getElementById("email-input");
    const saveButton = document.getElementById("save");

    let { emails } = await chrome.storage.sync.get("emails");
    if (emails) emailInput.value = emails.join("\n");

    saveButton.addEventListener("click", async () => {
        let emails = emailInput.value.split("\n").map(e => e.trim()).filter(e => e);
        await chrome.storage.sync.set({ emails });
        alert("Saved!");
    });
});