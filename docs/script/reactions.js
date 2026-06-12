function loadReactions() {
  const reactions = JSON.parse(localStorage.getItem("eventReactions") || "{}");
  const userReactions = JSON.parse(localStorage.getItem("userReactions") || "{}");
  const reactionContainers = document.querySelectorAll(".event-reactions");

  reactionContainers.forEach((container) => {
    const eventId = container.getAttribute("data-event-id");
    const eventReactions = reactions[eventId] || {};
    const userEventReactions = userReactions[eventId] || [];

    container.querySelectorAll(".reaction-btn").forEach((btn) => {
      const reaction = btn.getAttribute("data-reaction");
      const count = eventReactions[reaction] || 0;
      const countSpan = btn.querySelector(".reaction-count");
      countSpan.textContent = count;

      if (userEventReactions.includes(reaction)) {
        btn.classList.add("active");
      }
    });
  });
}

function setupReactionButtons() {
  const reactionButtons = document.querySelectorAll(".reaction-btn");

  reactionButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const container = btn.closest(".event-reactions");
      const eventId = container.getAttribute("data-event-id");
      const reaction = btn.getAttribute("data-reaction");

      const reactions = JSON.parse(localStorage.getItem("eventReactions") || "{}");
      const userReactions = JSON.parse(localStorage.getItem("userReactions") || "{}");

      if (!reactions[eventId]) {
        reactions[eventId] = {};
      }

      if (!reactions[eventId][reaction]) {
        reactions[eventId][reaction] = 0;
      }

      if (!userReactions[eventId]) {
        userReactions[eventId] = [];
      }

      if (userReactions[eventId].includes(reaction)) {
        reactions[eventId][reaction]--;
        userReactions[eventId] = userReactions[eventId].filter(r => r !== reaction);
        btn.classList.remove("active");
      } else {
        reactions[eventId][reaction]++;
        userReactions[eventId].push(reaction);
        btn.classList.add("active");
      }

      localStorage.setItem("eventReactions", JSON.stringify(reactions));
      localStorage.setItem("userReactions", JSON.stringify(userReactions));

      const countSpan = btn.querySelector(".reaction-count");
      countSpan.textContent = reactions[eventId][reaction];
    });
  });
}

function setupShareButtons() {
  const shareButtons = document.querySelectorAll(".share-btn");

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const container = btn.closest(".event-reactions");
      const eventId = container.getAttribute("data-event-id");
      const eventCard = container.closest(".event-card");
      const eventTitle = eventCard.querySelector("h2").textContent;
      const eventDescription = eventCard.querySelector("p").textContent;

      const shareUrl = window.location.href;
      const shareText = `${eventTitle} - ${eventDescription}`;

      if (navigator.share) {
        navigator.share({
          title: eventTitle,
          text: shareText,
          url: shareUrl,
        }).catch((error) => {
          console.log("Erro ao compartilhar:", error);
        });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("URL copiada para a área de transferência!");
        }).catch(() => {
          alert("Não foi possível compartilhar. Copie a URL manualmente.");
        });
      }
    });
  });
}

function initReactions() {
  loadReactions();
  setupReactionButtons();
  setupShareButtons();
}
