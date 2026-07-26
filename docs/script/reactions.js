async function loadReactions() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const reactionContainers = document.querySelectorAll(".event-reactions");

  for (const container of reactionContainers) {
    const eventId = container.getAttribute("data-event-id");

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/reactions/${eventId}`);
      if (!response.ok) continue;

      const reactionData = await response.json();
      const eventReactions = reactionData.reactions || {};
      const userEventReactions = reactionData.userReactions?.[userId] || [];

      container.querySelectorAll(".reaction-btn").forEach((btn) => {
        const reaction = btn.getAttribute("data-reaction");
        const count = eventReactions[reaction] || 0;
        const countSpan = btn.querySelector(".reaction-count");
        countSpan.textContent = count;

        if (userEventReactions.includes(reaction)) {
          btn.classList.add("active");
        }
      });
    } catch (error) {
      console.error("Erro ao carregar reações:", error);
    }
  }
}

function setupReactionButtons() {
  const reactionButtons = document.querySelectorAll(".reaction-btn");

  reactionButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const container = btn.closest(".event-reactions");
      const eventId = container.getAttribute("data-event-id");
      const reaction = btn.getAttribute("data-reaction");

      const token = localStorage.getItem("token");

      const isReacted = btn.classList.contains("active");
      const action = isReacted ? "remove" : "add";

      try {
        const response = await fetch(`${window.API_BASE_URL}/api/reactions/${eventId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ emoji: reaction, action }),
        });

        if (response.ok) {
          const reactionData = await response.json();
          const eventReactions = reactionData.reactions || {};
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          const userId = user.id;
          const userEventReactions = reactionData.userReactions?.[userId] || [];

          container.querySelectorAll(".reaction-btn").forEach((btn) => {
            const btnReaction = btn.getAttribute("data-reaction");
            const count = eventReactions[btnReaction] || 0;
            const countSpan = btn.querySelector(".reaction-count");
            countSpan.textContent = count;

            if (userEventReactions.includes(btnReaction)) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        } else {
          alert("Erro ao reagir: " + response.statusText);
        }
      } catch (error) {
        alert("Erro ao reagir: " + error.message);
      }
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
      const eventImage = eventCard.querySelector("img");

      const shareUrl = window.location.href;
      const shareText = `${eventTitle} - ${eventDescription}`;

      if (navigator.share) {
        const shareData = {
          title: eventTitle,
          text: shareText,
          url: shareUrl,
        };

        // Adicionar imagem se disponível e suportado pelo navegador
        if (eventImage && eventImage.src) {
          // Alguns navegadores suportam sharing de arquivos
          fetch(eventImage.src)
            .then(response => response.blob())
            .then(blob => {
              const file = new File([blob], 'event-image.jpg', { type: 'image/jpeg' });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                shareData.files = [file];
              }
              navigator.share(shareData).catch((error) => {
                console.error("Erro ao compartilhar:", error);
              });
            })
            .catch(() => {
              // Se falhar ao carregar a imagem, compartilhar sem ela
              navigator.share(shareData).catch((error) => {
                console.error("Erro ao compartilhar:", error);
              });
            });
        } else {
          navigator.share(shareData).catch((error) => {
            console.error("Erro ao compartilhar:", error);
          });
        }
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("URL copiada para a área de transferência!");
        }).catch((error) => {
          console.error("Erro ao copiar URL:", error);
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
