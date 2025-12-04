document.addEventListener("DOMContentLoaded", async function () {
  const emailListDiv = document.getElementById("email-list");
  const tagListDiv = document.getElementById("tag-list");
  const sendButton = document.getElementById("send-email");

  let {emails, tags, noDefaultTag} = await chrome.storage.sync.get(["emails", "tags", "noDefaultTag"]);
  if (!emails) emails = ["example@example.com", "test@test.com"]; // Default emails
  if (!tags) tags = ["Important", "Work", "Personal"]; // Default tags

  tags.forEach((tag, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    if (index === 0 && !noDefaultTag) checkbox.checked = true; // First tag preselected unless disabled
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(tag));
    tagListDiv.appendChild(label);
    tagListDiv.appendChild(document.createElement("br"));
  });

  emails.forEach((email, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = email;
    if (index === 0) checkbox.checked = true; // First email preselected
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(email));
    emailListDiv.appendChild(label);
    emailListDiv.appendChild(document.createElement("br"));
  });

  sendButton.addEventListener("click", async () => {
    let selectedTags = Array.from(document.querySelectorAll("#tag-list input[type='checkbox']:checked"))
      .map(cb => `[${cb.value}]`).join(" ");
    let selectedEmails = Array.from(document.querySelectorAll("#email-list input[type='checkbox']:checked"))
      .map(cb => cb.value);
    if (selectedEmails.length === 0) return;

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) return;

    let subject = encodeURIComponent(`${selectedTags} ${tab.title}`.trim());
    let body = encodeURIComponent(tab.url);
    let mailtoLink = `mailto:${selectedEmails.join(",")}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  });
});
