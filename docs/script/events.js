let allEventsData = [];
let eventsPerPage = 8;
let currentEventsPage = 1;

async function loadEvents() {
  const eventsContainer = document.querySelector(".events-container");
  if (!eventsContainer) return;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const hasAdminPrivileges =
      user.role === "ADMIN" ||
      user.role === "COORDINATOR" ||
      user.role === "admin" ||
      user.role === "coordinator";

    const postsResponse = await fetch(`${window.API_BASE_URL}/api/posts`);
    const posts = await postsResponse.json();

    allEventsData = [];

    posts.forEach((post) => {
      if (
        post.category === "INTERNSHIP" ||
        post.category === "EVENT" ||
        post.category === "PRESENTATION" ||
        post.category === "ANNOUNCEMENT"
      ) {
        const postVisibility = Array.isArray(post.visibility)
          ? post.visibility
          : [post.visibility];
        const canView =
          !postVisibility ||
          postVisibility.includes("ALL") ||
          postVisibility.includes(user.role) ||
          user.role === "ADMIN" ||
          user.role === "COORDINATOR";

        if (canView) {
          allEventsData.push({
            type: "post",
            id: post.id,
            title: post.title,
            description: post.summary || post.content,
            date: post.createdat,
            eventdate: post.eventdate,
            category: post.category,
            imageurl: post.imageurl || "aviso1.png",
            location: post.location || "SENAI Areias",
          });
        }
      }
    });

    allEventsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    currentEventsPage = 1;
    renderEvents(eventsContainer, hasAdminPrivileges);
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    eventsContainer.innerHTML = "<p>Erro ao carregar eventos.</p>";
  }
}

function renderEvents(eventsContainer, hasAdminPrivileges) {
  eventsContainer.innerHTML = "";

  if (allEventsData.length === 0) {
    eventsContainer.innerHTML = "<p>Nenhum evento encontrado.</p>";
    return;
  }

  const startIndex = 0;
  const endIndex = currentEventsPage * eventsPerPage;
  const eventsToShow = allEventsData.slice(startIndex, endIndex);

  eventsToShow.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.className = "event-card";

    const dateToDisplay = event.eventdate || event.createdat;
    const dateParts = dateToDisplay.split('T')[0].split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    let deleteButton = "";
    let editButton = "";
    if (hasAdminPrivileges) {
      deleteButton = `<button class="btn-delete-event" data-id="${event.id}" data-type="post">Excluir</button>`;
      editButton = `<button class="btn-edit-event" data-id="${event.id}" data-type="post">Editar</button>`;
    }

    const imageUrl = event.imageurl || "aviso1.png";

    let imageSrc;
    if (imageUrl.startsWith("data:image")) {
      imageSrc = imageUrl;
    } else if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      imageSrc = imageUrl;
    } else if (imageUrl.startsWith("./assets/uploads/")) {
      imageSrc = `../../assets/uploads/${imageUrl.replace("./assets/uploads/", "")}`;
    } else {
      imageSrc = `../../assets/images/${imageUrl}`;
    }

    const categoryTranslations = {
      INTERNSHIP: "Empregabilidade",
      EVENT: "Evento",
      PRESENTATION: "Apresentação",
      ANNOUNCEMENT: "Comunicado",
    };
    const translatedCategory =
      categoryTranslations[event.category] || event.category;

    eventCard.innerHTML = `
            <div class="event-image-wrapper">
                <img src="${imageSrc}" alt="${event.title}">
            </div>
            <h2>${event.title}</h2>
            <hr>
            <p>${event.description}</p>
            <p> <i class="fa-solid fa-check icon-orange"></i> Data do evento: ${formattedDate}</p>
            ${event.location ? `<p> <i class="fa-solid fa-check icon-orange"></i> Local: ${event.location}</p>` : ""}
            <p> <i class="fa-solid fa-check icon-orange"></i> Categoria: ${translatedCategory}</p>
            <div class="event-reactions" data-event-id="${event.id}">
                <button class="reaction-btn" data-reaction="👍" title="Curtir">👍 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="❤️" title="Amei">❤️ <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="😂" title="Engraçado">😂 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="😮" title="Impressionante">😮 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="🎉" title="Celebrar">🎉 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="👎" title="Não curti">👎 <span class="reaction-count">0</span></button>
                <button class="share-btn" title="Compartilhar"><i class="fa-solid fa-share-nodes"></i></button>
            </div>
            <div class="event-actions">
                ${editButton}
                ${deleteButton}
            </div>
        `;

    eventsContainer.appendChild(eventCard);
  });

  if (allEventsData.length > eventsPerPage * currentEventsPage) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.className = "btn-load-more";
    loadMoreButton.textContent = "Mostrar mais eventos";
    loadMoreButton.addEventListener("click", () => {
      currentEventsPage++;
      renderEvents(eventsContainer, hasAdminPrivileges);
    });
    eventsContainer.appendChild(loadMoreButton);
  }

  if (typeof initReactions === 'function') {
    initReactions();
  }

  if (hasAdminPrivileges) {
    const editButtons = document.querySelectorAll(".btn-edit-event");
    console.log(
      "Botões de editar encontrados (events.js):",
      editButtons.length,
    );

    editButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const eventId = button.getAttribute("data-id");
        const eventType = button.getAttribute("data-type");

        console.log(
          "Clicou em editar (events.js) - ID:",
          eventId,
          "Tipo:",
          eventType,
        );

        try {
          const response = await fetch(
            `${window.API_BASE_URL}/api/posts/${eventId}`,
          );

          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
          }

          const post = await response.json();
          console.log("Dados do post carregados:", post);

          const editPostModal = document.getElementById("edit-post-modal");

          if (!editPostModal) {
            alert(
              "Modal de edição não encontrado. Verifique se o login.js foi carregado corretamente.",
            );
            return;
          }

          const editPostId = document.getElementById("edit-post-id");
          const editPostTitle = document.getElementById("edit-post-title");
          const editPostSummary = document.getElementById("edit-post-summary");
          const editPostDate = document.getElementById("edit-post-date");
          const editPostLocation =
            document.getElementById("edit-post-location");

          editPostId.value = post.id;
          editPostTitle.value = post.title;
          editPostSummary.value = post.summary;
          editPostDate.value = post.eventdate
            ? post.eventdate.split("T")[0]
            : new Date().toISOString().split("T")[0];
          editPostLocation.value = post.location || "SENAI Areias";

          const categoryCheckboxes = document.querySelectorAll(
            'input[name="edit-post-category"]',
          );
          categoryCheckboxes.forEach((checkbox) => {
            checkbox.checked = checkbox.value === post.category;
          });

          const visibilityCheckboxes = document.querySelectorAll(
            'input[name="edit-post-visibility"]',
          );
          const postVisibility = Array.isArray(post.visibility)
            ? post.visibility
            : [post.visibility];
          visibilityCheckboxes.forEach((checkbox) => {
            checkbox.checked = postVisibility.includes(checkbox.value);
          });

          const imageCheckboxes = document.querySelectorAll(
            'input[name="edit-post-image"]',
          );
          let imageFound = false;
          imageCheckboxes.forEach((checkbox) => {
            if (checkbox.value === post.imageurl) {
              checkbox.checked = true;
              imageFound = true;
            } else {
              checkbox.checked = false;
            }
          });

          if (!imageFound && post.imageurl) {
            const customCheckbox = document.querySelector(
              'input[name="edit-post-image"][value="custom"]',
            );
            if (customCheckbox) {
              customCheckbox.checked = true;
              const customImg =
                customCheckbox.parentElement.querySelector("img");
              if (customImg) {
                if (
                  post.imageurl.startsWith("http://") ||
                  post.imageurl.startsWith("https://")
                ) {
                  customImg.src = post.imageurl;
                  customImg.style.opacity = "1";
                } else if (
                  post.imageurl.startsWith("data:image") ||
                  post.imageurl.startsWith("./assets/uploads/")
                ) {
                  customImg.src = post.imageurl.startsWith("./assets/uploads/") 
                    ? `../../assets/uploads/${post.imageurl.replace("./assets/uploads/", "")}`
                    : post.imageurl;
                  customImg.style.opacity = "1";
                } else {
                  customImg.src = `../../assets/images/${post.imageurl}`;
                  customImg.style.opacity = "1";
                }
              }
            }
          }

          editPostModal.classList.add("active");
        } catch (error) {
          console.error("Erro ao carregar post para edição:", error);
          alert("Erro ao carregar dados do post para edição");
        }
      });
    });

    const deleteButtons = document.querySelectorAll(".btn-delete-event");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const eventId = button.getAttribute("data-id");

        if (typeof openDeleteConfirmModal === 'function') {
          openDeleteConfirmModal(eventId, "post", async (id, type) => {
            const token = localStorage.getItem("token");

            try {
              const response = await fetch(
                `${window.API_BASE_URL}/api/posts/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (response.ok) {
                loadEvents();
              } else {
                const data = await response.json();
                alert(data.message || "Erro ao excluir post/evento");
              }
            } catch (error) {
              alert("Erro de conexão com o servidor");
            }
          });
        }
      });
    });
  }
}

window.addEventListener("DOMContentLoaded", loadEvents);
