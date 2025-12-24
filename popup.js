document.addEventListener("DOMContentLoaded", async function () {
  const emailListDiv = document.getElementById("email-list");
  const tagListDiv = document.getElementById("tag-list");
  const sendButton = document.getElementById("send-email");

  let {emails, tags, compactMode, stickyHeader, showTopSendButton, showBottomSendButton, showNameOnly, emailsGridLayout, noDefaultTag, tagsInSubject, tagsInBody, tagPositionSubject, tagPositionBody, tagsGridLayout} =
    await chrome.storage.sync.get(["emails", "tags", "compactMode", "stickyHeader", "showTopSendButton", "showBottomSendButton", "showNameOnly", "emailsGridLayout", "noDefaultTag", "tagsInSubject", "tagsInBody", "tagPositionSubject", "tagPositionBody", "tagsGridLayout"]);
  if (!emails) emails = [
    "Alice Cooper <alice.cooper@rockmail.com>",
    "bob.smith@example.org",
    "Charlie Brown <charlie@peanuts.io>",
    "diana.prince@amazon.ws",
    "Edward Norton <ed.norton@fightclub.net>",
    "frank@sinatra.music",
    "Grace Hopper <grace.hopper@navy.mil>",
    "hank.williams@country.fm",
    "Ivy League <ivy@harvard.edu>",
    "jack.sparrow@blackpearl.sea",
    "Karen Miller <k.miller@corporate.biz>",
    "leo@dicaprio.actor",
    "Maria Santos <maria.santos@barcelona.es>",
    "nick.fury@shield.gov",
    "Olivia Pope <olivia@gladiators.dc>"
  ];
  if (!tags) tags = [
    "Work", "Personal", "Urgent", "Follow-up", "Research",
    "Dev", "Documentation", "Bug", "Feature", "Review",
    "Later", "Archive", "Inspiration", "Tools", "Learning",
    "News", "Reference", "Ideas", "Meeting", "Project"
  ];

  // Apply compact mode if enabled
  if (compactMode) {
    document.body.classList.add("compact");
  }

  // Apply sticky header if enabled
  if (stickyHeader) {
    document.querySelector(".sticky-header").classList.add("sticky");
  }

  // Hide bottom send button if disabled
  if (showBottomSendButton === false) {
    sendButton.style.display = "none";
  }

  // Apply grid layout if enabled
  if (tagsGridLayout) {
    tagListDiv.classList.add("grid");
  }

  // Create separate container for emails without mailbox format (plain emails)
  let emailGridDiv = null;
  let emailPlainDiv = null;

  if (showNameOnly && emailsGridLayout) {
    // Split into grid (for mailbox format) and list (for plain emails)
    emailGridDiv = document.createElement("div");
    emailGridDiv.classList.add("list", "grid");
    emailPlainDiv = document.createElement("div");
    emailPlainDiv.classList.add("list");
  }

  // Parse mailbox format: "Name <email>" -> { displayName: "Name", email: "email" }
  function parseMailbox(mailbox) {
    const match = mailbox.match(/^(.+?)\s*<([^>]+)>$/);
    if (match) {
      return { displayName: match[1].trim(), email: match[2].trim() };
    }
    return { displayName: mailbox, email: mailbox };
  }

  tags.forEach((tag, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    if (index === 0 && !noDefaultTag) checkbox.checked = true; // First tag preselected unless disabled
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(tag));
    tagListDiv.appendChild(label);
  });

  emails.forEach((email, index) => {
    const parsed = parseMailbox(email);
    const hasMailboxFormat = parsed.displayName !== parsed.email;
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = parsed.email;
    if (index === 0) checkbox.checked = true; // First email preselected
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(showNameOnly ? parsed.displayName : email));

    // If grid mode: put mailbox format emails in grid, plain emails in list
    if (emailGridDiv && emailPlainDiv) {
      if (hasMailboxFormat) {
        emailGridDiv.appendChild(label);
      } else {
        emailPlainDiv.appendChild(label);
      }
    } else {
      emailListDiv.appendChild(label);
    }
  });

  // Append the split containers if used
  if (emailGridDiv && emailPlainDiv) {
    if (emailGridDiv.children.length > 0) {
      emailListDiv.appendChild(emailGridDiv);
    }
    if (emailPlainDiv.children.length > 0) {
      emailListDiv.appendChild(emailPlainDiv);
    }
  }

  // Send email function
  async function sendEmail() {
    let selectedTags = Array.from(document.querySelectorAll("#tag-list input[type='checkbox']:checked"))
      .map(cb => `[${cb.value}]`).join(" ");
    let selectedEmails = Array.from(document.querySelectorAll("#email-list input[type='checkbox']:checked"))
      .map(cb => cb.value);
    if (selectedEmails.length === 0) return;

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) return;

    // Build subject (default: tags in subject)
    let subjectText;
    if (tagsInSubject !== false && selectedTags) {
      subjectText = tagPositionSubject === "suffix"
        ? `${tab.title} ${selectedTags}`
        : `${selectedTags} ${tab.title}`;
    } else {
      subjectText = tab.title;
    }

    // Build body
    let bodyText;
    if (tagsInBody && selectedTags) {
      bodyText = tagPositionBody === "suffix"
        ? `${tab.url}\n${selectedTags}`
        : `${selectedTags}\n${tab.url}`;
    } else {
      bodyText = tab.url;
    }

    let subject = encodeURIComponent(subjectText.trim());
    let body = encodeURIComponent(bodyText.trim());
    let mailtoLink = `mailto:${selectedEmails.join(",")}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }

  sendButton.addEventListener("click", sendEmail);

  // Add top send button if option is enabled
  if (showTopSendButton) {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      const needsScroll = document.body.scrollHeight > window.innerHeight;
      const noBottomButton = showBottomSendButton === false;
      // Show top button if scrolling needed OR bottom button is hidden
      if (needsScroll || noBottomButton) {
        const topSendButton = document.createElement("button");
        topSendButton.textContent = "Send";
        topSendButton.addEventListener("click", sendEmail);
        const stickyHeader = document.querySelector(".sticky-header");
        stickyHeader.appendChild(topSendButton);
      }
    }, 50);
  }
});
