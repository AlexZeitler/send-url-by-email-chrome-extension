document.addEventListener("DOMContentLoaded", async function () {
  const emailInput = document.getElementById("email-input");
  const tagInput = document.getElementById("tag-input");
  const noDefaultTagCheckbox = document.getElementById("no-default-tag");
  const tagPositionRadios = document.querySelectorAll('input[name="tag-position"]');
  const saveButton = document.getElementById("save");

  let {emails, tags, noDefaultTag, tagPosition} = await chrome.storage.sync.get(["emails", "tags", "noDefaultTag", "tagPosition"]);
  if (emails) emailInput.value = emails.join("\n");
  if (tags) tagInput.value = tags.join("\n");
  if (noDefaultTag) noDefaultTagCheckbox.checked = true;
  if (tagPosition) {
    document.querySelector(`input[name="tag-position"][value="${tagPosition}"]`).checked = true;
  }

  saveButton.addEventListener("click", async () => {
    let emails = emailInput.value.split("\n").map(e => e.trim()).filter(e => e);
    let tags = tagInput.value.split("\n").map(t => t.trim()).filter(t => t);
    let noDefaultTag = noDefaultTagCheckbox.checked;
    let tagPosition = document.querySelector('input[name="tag-position"]:checked').value;
    await chrome.storage.sync.set({emails, tags, noDefaultTag, tagPosition});
    alert("Saved!");
  });
});
