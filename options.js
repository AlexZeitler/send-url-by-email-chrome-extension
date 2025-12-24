document.addEventListener("DOMContentLoaded", async function () {
  const compactModeCheckbox = document.getElementById("compact-mode");
  const stickyHeaderCheckbox = document.getElementById("sticky-header");
  const showTopSendButtonCheckbox = document.getElementById("show-top-send-button");
  const showBottomSendButtonCheckbox = document.getElementById("show-bottom-send-button");
  const emailInput = document.getElementById("email-input");
  const showNameOnlyCheckbox = document.getElementById("show-name-only");
  const emailsGridLayoutCheckbox = document.getElementById("emails-grid-layout");
  const tagInput = document.getElementById("tag-input");
  const noDefaultTagCheckbox = document.getElementById("no-default-tag");
  const tagsGridLayoutCheckbox = document.getElementById("tags-grid-layout");
  const tagsInSubjectCheckbox = document.getElementById("tags-in-subject");
  const tagsInBodyCheckbox = document.getElementById("tags-in-body");
  const saveButton = document.getElementById("save");

  // Parse mailbox format: "Name <email>" -> displayName
  function getDisplayName(mailbox) {
    const match = mailbox.match(/^(.+?)\s*<[^>]+>$/);
    return match ? match[1].trim() : mailbox;
  }

  let {emails, tags, compactMode, stickyHeader, showTopSendButton, showBottomSendButton, showNameOnly, emailsGridLayout, noDefaultTag, tagsGridLayout, tagsInSubject, tagsInBody, tagPositionSubject, tagPositionBody} =
    await chrome.storage.sync.get(["emails", "tags", "compactMode", "stickyHeader", "showTopSendButton", "showBottomSendButton", "showNameOnly", "emailsGridLayout", "noDefaultTag", "tagsGridLayout", "tagsInSubject", "tagsInBody", "tagPositionSubject", "tagPositionBody"]);

  if (!emails || emails.length === 0) emails = [
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
  if (!tags || tags.length === 0) tags = [
    "Work", "Personal", "Urgent", "Follow-up", "Research",
    "Dev", "Documentation", "Bug", "Feature", "Review",
    "Later", "Archive", "Inspiration", "Tools", "Learning",
    "News", "Reference", "Ideas", "Meeting", "Project"
  ];

  emailInput.value = emails.join("\n");
  tagInput.value = tags.join("\n");
  if (compactMode) compactModeCheckbox.checked = true;
  if (stickyHeader) stickyHeaderCheckbox.checked = true;
  if (showTopSendButton) showTopSendButtonCheckbox.checked = true;
  showBottomSendButtonCheckbox.checked = showBottomSendButton !== false; // Default true
  if (showNameOnly) showNameOnlyCheckbox.checked = true;
  if (emailsGridLayout) emailsGridLayoutCheckbox.checked = true;
  if (noDefaultTag) noDefaultTagCheckbox.checked = true;
  if (tagsGridLayout) tagsGridLayoutCheckbox.checked = true;

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
    let compactMode = compactModeCheckbox.checked;
    let showNameOnly = showNameOnlyCheckbox.checked;

    // Check for duplicate display names in emails (only relevant for show name only)
    if (showNameOnly) {
      const displayNames = emails.map(getDisplayName);
      const duplicates = displayNames.filter((name, index) => displayNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        alert(`Duplicate names found: ${[...new Set(duplicates)].join(", ")}\nPlease use unique names.`);
        return;
      }
    }

    let stickyHeader = stickyHeaderCheckbox.checked;
    let showTopSendButton = showTopSendButtonCheckbox.checked;
    let showBottomSendButton = showBottomSendButtonCheckbox.checked;
    let emailsGridLayout = emailsGridLayoutCheckbox.checked;
    let noDefaultTag = noDefaultTagCheckbox.checked;
    let tagsGridLayout = tagsGridLayoutCheckbox.checked;
    let tagsInSubject = tagsInSubjectCheckbox.checked;
    let tagsInBody = tagsInBodyCheckbox.checked;
    let tagPositionSubject = document.querySelector('input[name="tag-position-subject"]:checked').value;
    let tagPositionBody = document.querySelector('input[name="tag-position-body"]:checked').value;
    await chrome.storage.sync.set({emails, tags, compactMode, stickyHeader, showTopSendButton, showBottomSendButton, showNameOnly, emailsGridLayout, noDefaultTag, tagsGridLayout, tagsInSubject, tagsInBody, tagPositionSubject, tagPositionBody});
    alert("Saved!");
  });
});
