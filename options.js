document.addEventListener("DOMContentLoaded", async function () {
  const emailInput = document.getElementById("email-input");
  const tagInput = document.getElementById("tag-input");
  const noDefaultTagCheckbox = document.getElementById("no-default-tag");
  const tagsInSubjectCheckbox = document.getElementById("tags-in-subject");
  const tagsInBodyCheckbox = document.getElementById("tags-in-body");
  const saveButton = document.getElementById("save");

  let {emails, tags, noDefaultTag, tagsInSubject, tagsInBody, tagPositionSubject, tagPositionBody} =
    await chrome.storage.sync.get(["emails", "tags", "noDefaultTag", "tagsInSubject", "tagsInBody", "tagPositionSubject", "tagPositionBody"]);

  if (emails) emailInput.value = emails.join("\n");
  if (tags) tagInput.value = tags.join("\n");
  if (noDefaultTag) noDefaultTagCheckbox.checked = true;

  // Default: tags in subject
  tagsInSubjectCheckbox.checked = tagsInSubject !== false;
  tagsInBodyCheckbox.checked = tagsInBody === true;

  if (tagPositionSubject) {
    document.querySelector(`input[name="tag-position-subject"][value="${tagPositionSubject}"]`).checked = true;
  }
  if (tagPositionBody) {
    document.querySelector(`input[name="tag-position-body"][value="${tagPositionBody}"]`).checked = true;
  }

  saveButton.addEventListener("click", async () => {
    let emails = emailInput.value.split("\n").map(e => e.trim()).filter(e => e);
    let tags = tagInput.value.split("\n").map(t => t.trim()).filter(t => t);
    let noDefaultTag = noDefaultTagCheckbox.checked;
    let tagsInSubject = tagsInSubjectCheckbox.checked;
    let tagsInBody = tagsInBodyCheckbox.checked;
    let tagPositionSubject = document.querySelector('input[name="tag-position-subject"]:checked').value;
    let tagPositionBody = document.querySelector('input[name="tag-position-body"]:checked').value;
    await chrome.storage.sync.set({emails, tags, noDefaultTag, tagsInSubject, tagsInBody, tagPositionSubject, tagPositionBody});
    alert("Saved!");
  });
});
