document.addEventListener("DOMContentLoaded", async function () {
  const emailInput = document.getElementById("email-input");
  const tagInput = document.getElementById("tag-input");
  const saveButton = document.getElementById("save");

  let {emails, tags} = await chrome.storage.sync.get(["emails", "tags"]);
  if (emails) emailInput.value = emails.join("\n");
  if (tags) tagInput.value = tags.join("\n");

  saveButton.addEventListener("click", async () => {
    let emails = emailInput.value.split("\n").map(e => e.trim()).filter(e => e);
    let tags = tagInput.value.split("\n").map(t => t.trim()).filter(t => t);
    await chrome.storage.sync.set({emails, tags});
    alert("Saved!");
  });
});
