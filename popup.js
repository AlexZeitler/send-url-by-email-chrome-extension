document.addEventListener("DOMContentLoaded", async function () {
  const emailListDiv = document.getElementById("email-list");
  const sendButton = document.getElementById("send-email");

  let {emails} = await chrome.storage.sync.get("emails");
  if (!emails) emails = [];

  emails.forEach(email => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = email;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(email));
    emailListDiv.appendChild(label);
    emailListDiv.appendChild(document.createElement("br"));
  });

  sendButton.addEventListener("click", async () => {
    let selectedEmails = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
      .map(cb => cb.value);
    if (selectedEmails.length === 0) return;

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) return;

    let subject = encodeURIComponent(tab.title);
    let body = encodeURIComponent(tab.url);
    window.location.href = `mailto:${selectedEmails.join(",")}?subject=${subject}&body=${body}`;
  });
});
