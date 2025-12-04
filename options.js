document.addEventListener("DOMContentLoaded", async function () {
  const emailInput = document.getElementById("email-input");
  const tagInput = document.getElementById("tag-input");
  const noDefaultTagCheckbox = document.getElementById("no-default-tag");
  const saveButton = document.getElementById("save");

  let {emails, tags, noDefaultTag} = await chrome.storage.sync.get(["emails", "tags", "noDefaultTag"]);
  if (emails) emailInput.value = emails.join("\n");
  if (tags) tagInput.value = tags.join("\n");
  if (noDefaultTag) noDefaultTagCheckbox.checked = true;

  saveButton.addEventListener("click", async () => {
    let emails = emailInput.value.split("\n").map(e => e.trim()).filter(e => e);
    let tags = tagInput.value.split("\n").map(t => t.trim()).filter(t => t);
    let noDefaultTag = noDefaultTagCheckbox.checked;
    await chrome.storage.sync.set({emails, tags, noDefaultTag});
    alert("Saved!");
  });
});
