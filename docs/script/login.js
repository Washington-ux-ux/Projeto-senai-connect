const loginContainer = document.getElementById("login-container");

const token = localStorage.getItem("token");
if (token) {
  showLoggedInUser();
} else {
  showLoginForm();
}

function showLoginForm() {
  loginContainer.innerHTML = `
        <button id="btn-login-open" class="btn-nav-login">Entrar</button>
    `;

  const btnOpen = document.getElementById("btn-login-open");

  btnOpen.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

function showLoggedInUser() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("Usuário logado:", user);
  console.log("Role do usuário:", user.role);
  const hasAdminPrivileges =
    user.role === "ADMIN" ||
    user.role === "COORDINATOR" ||
    user.role === "admin" ||
    user.role === "coordinator";
  console.log("Tem privilégios de admin?", hasAdminPrivileges);

  let dropdownContent = "";

  if (hasAdminPrivileges) {
    dropdownContent = `
            <a href="#" id="btn-create-post">Criar Post/Evento</a>
            <a href="#" id="btn-create-user">Registrar Novo Usuário</a>
            <a href="#" id="btn-logout">Sair</a>
        `;
  } else {
    dropdownContent = `
            <a href="#" id="btn-logout">Sair</a>
        `;
  }

  loginContainer.innerHTML = `
        <div class="user-menu">
            <button id="btn-user-menu" class="btn-nav-user">
                <i class="fa-solid fa-user"></i>
                <span>${user.name || "Usuário"}</span>
            </button>
            <div id="user-dropdown" class="dropdown-menu">
                ${dropdownContent}
            </div>
        </div>
        
        <!-- Modal para criar post/evento -->
        <div id="create-post-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-create-post-close" class="close-btn">&times;</span>
                <h2>Criar Post/Evento</h2>
                <form id="create-post-form">
                    <div class="input-group">
                        <label>Selecione Layout:</label>
                        <div class="image-selector">
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso1.png" checked>
                                <img src="./assets/images/aviso1.png" alt="Aviso 1">
                                <span>Aviso 1</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso2.png">
                                <img src="./assets/images/aviso2.png" alt="Aviso 2">
                                <span>Aviso 2</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso3.png">
                                <img src="./assets/images/aviso3.png" alt="Aviso 3">
                                <span>Aviso 3</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="custom">
                                <img src="./assets/images/aviso1.png" alt="Imagem própria" style="opacity: 0.5;">
                                <span>Imagem própria</span>
                            </label>
                        </div>
                        <input type="file" id="custom-image-upload" accept="image/*" style="display: none;">
                    </div>
                    <div class="input-group">
                        <input type="text" id="post-title" placeholder="Título" required>
                    </div>
                    <div class="input-group">
                        <textarea id="post-summary" placeholder="Aviso" required></textarea>
                    </div>
                    <div class="input-group">
                        <label>Data do evento:</label>
                        <input type="date" id="post-date" required>
                    </div>
                    <div class="input-group">
                        <label>Local do evento:</label>
                        <input type="text" id="post-location" value="SENAI Areias">
                    </div>
                    <div class="input-group">
                        <label>Selecione a categoria:</label>
                        <div class="category-selector">
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="EVENT" checked>
                                <span>Evento</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="INTERNSHIP">
                                <span>Empregabilidade</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="ANNOUNCEMENT">
                                <span>Comunicado</span>
                            </label>
                        </div>
                    </div>
                    <label>Selecione a visibilidade:</label>
                    <div class="visibility-container">
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="ALL">
                            <span>Todos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="STUDENT">
                            <span>Alunos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="TEACHER">
                            <span>Professores</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="COORDINATOR">
                            <span>Coordenadores</span>
                        </label>
                    </div>
                    <button type="submit" class="btn-submit">Criar</button>
                </form>
                <p id="create-post-error" class="error-message"></p>
            </div>
        </div>
        
        <!-- Modal para criar aluno -->
        <div id="create-user-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-create-user-close" class="close-btn">&times;</span>
                <h2>Registrar Novo Usuário</h2>
                <form id="create-user-form">
                    <div class="input-group">
                        <input type="text" id="user-name" placeholder="Nome completo" required>
                    </div>
                    <div class="input-group">
                        <input type="email" id="user-email" placeholder="E-mail" required>
                    </div>
                    <div class="input-group">
                        <input type="password" id="user-password" placeholder="Senha" required>
                    </div>
                    <div class="input-group">
                        <input type="text" id="user-cpf" placeholder="CPF" required>
                    </div>
                    <div class="input-group">
                        <input type="text" id="user-registration" placeholder="Matrícula" required>
                    </div>
                    <div class="input-group">
                        <select id="user-role" required>
                            <option value="">Selecione o cargo</option>
                            <option value="STUDENT">Aluno</option>
                            <option value="TEACHER">Professor</option>
                            <option value="COORDINATOR">Coordenador</option>
                        </select>
                    </div>
                    <div class="input-group" id="user-course-group">
                        <input type="text" id="user-course" placeholder="Curso">
                    </div>
                    <div class="input-group">
                        <label>Sexo:</label>
                        <div class="sex-options">
                            <label>
                                <input type="radio" name="user-gender" value="Masculino">
                                <span>Masculino</span>
                            </label>
                            <label>
                                <input type="radio" name="user-gender" value="Feminino">
                                <span>Feminino</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn-submit">Criar</button>
                </form>
                <p id="create-user-error" class="error-message"></p>
            </div>
        </div>
    `;

  const btnUserMenu = document.getElementById("btn-user-menu");
  const userDropdown = document.getElementById("user-dropdown");
  const btnLogout = document.getElementById("btn-logout");

  btnUserMenu.addEventListener("click", () => {
    userDropdown.classList.toggle("active");
  });

  btnLogout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  });

  if (hasAdminPrivileges) {
    const btnCreatePost = document.getElementById("btn-create-post");
    const btnCreateUser = document.getElementById("btn-create-user");
    const createPostModal = document.getElementById("create-post-modal");
    const createUserModal = document.getElementById("create-user-modal");
    const btnCreatePostClose = document.getElementById("btn-create-post-close");
    const btnCreateUserClose = document.getElementById("btn-create-user-close");
    const createPostForm = document.getElementById("create-post-form");
    const createUserForm = document.getElementById("create-user-form");
    const createPostError = document.getElementById("create-post-error");
    const createUserError = document.getElementById("create-user-error");

    console.log('Verificando se modal de edição existe...');
    if (!document.getElementById('edit-post-modal')) {
      console.log('Modal não encontrado, injetando...');
      const editModalHTML = `
        <div id="edit-post-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-edit-post-close" class="close-btn">&times;</span>
                <h2>Editar Post/Evento</h2>
                <form id="edit-post-form">
                    <input type="hidden" id="edit-post-id">
                    <div class="input-group">
                        <label>Selecione Layout:</label>
                        <div class="image-selector">
                            <label class="image-checkbox">
                                <input type="checkbox" name="edit-post-image" value="aviso1.png">
                                <img src="./assets/images/aviso1.png" alt="Aviso 1">
                                <span>Aviso 1</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="edit-post-image" value="aviso2.png">
                                <img src="./assets/images/aviso2.png" alt="Aviso 2">
                                <span>Aviso 2</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="edit-post-image" value="aviso3.png">
                                <img src="./assets/images/aviso3.png" alt="Aviso 3">
                                <span>Aviso 3</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="edit-post-image" value="custom">
                                <img src="./assets/images/aviso1.png" alt="Imagem própria" style="opacity: 0.5;">
                                <span>Imagem própria</span>
                            </label>
                        </div>
                        <input type="file" id="edit-custom-image-upload" accept="image/*" style="display: none;">
                    </div>
                    <div class="input-group">
                        <input type="text" id="edit-post-title" placeholder="Título" required>
                    </div>
                    <div class="input-group">
                        <textarea id="edit-post-summary" placeholder="Aviso" required></textarea>
                    </div>
                    <div class="input-group">
                        <label>Data do evento:</label>
                        <input type="date" id="edit-post-date" required>
                    </div>
                    <div class="input-group">
                        <label>Local do evento:</label>
                        <input type="text" id="edit-post-location" value="SENAI Areias">
                    </div>
                    <div class="input-group">
                        <label>Selecione a categoria:</label>
                        <div class="category-selector">
                            <label class="category-checkbox">
                                <input type="checkbox" name="edit-post-category" value="EVENT">
                                <span>Evento</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="edit-post-category" value="INTERNSHIP">
                                <span>Empregabilidade</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="edit-post-category" value="ANNOUNCEMENT">
                                <span>Comunicado</span>
                            </label>
                        </div>
                    </div>
                    <label>Selecione a visibilidade:</label>
                    <div class="visibility-container">
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="edit-post-visibility" value="ALL">
                            <span>Todos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="edit-post-visibility" value="STUDENT">
                            <span>Alunos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="edit-post-visibility" value="TEACHER">
                            <span>Professores</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="edit-post-visibility" value="COORDINATOR">
                            <span>Coordenadores</span>
                        </label>
                    </div>
                    <button type="submit" class="btn-submit">Salvar Alterações</button>
                </form>
                <p id="edit-post-error" class="error-message"></p>
            </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', editModalHTML);
    }

    btnCreatePost.addEventListener("click", (e) => {
      e.preventDefault();
      userDropdown.classList.remove("active");
      createPostModal.classList.add("active");

      const today = new Date().toISOString().split("T")[0];
      document.getElementById("post-date").value = today;
    });

    btnCreateUser.addEventListener("click", (e) => {
      e.preventDefault();
      userDropdown.classList.remove("active");
      createUserModal.classList.add("active");
    });

    btnCreatePostClose.addEventListener("click", () => {
      createPostModal.classList.remove("active");
      createPostForm.reset();
      createPostError.textContent = "";
    });

    const btnEditPostClose = document.getElementById("btn-edit-post-close");
    const editPostModal = document.getElementById("edit-post-modal");
    const editPostForm = document.getElementById("edit-post-form");
    const editPostError = document.getElementById("edit-post-error");
    const editCustomImageUpload = document.getElementById("edit-custom-image-upload");

    if (btnEditPostClose) {
      btnEditPostClose.addEventListener("click", () => {
        editPostModal.classList.remove("active");
        editPostForm.reset();
        editPostError.textContent = "";
      });
    }

    const editImageCheckboxes = document.querySelectorAll('input[name="edit-post-image"]');
    editImageCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        editImageCheckboxes.forEach(cb => cb.checked = false);
        e.target.checked = true;
        
        if (e.target.value === 'custom') {
          const customImg = e.target.parentElement.querySelector('img');

          if (customImg && (customImg.style.opacity === '0.5' || customImg.style.opacity === '')) {
            editCustomImageUpload.click();
          }
        }
      });
    });

    editCustomImageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const customCheckbox = document.querySelector('input[name="edit-post-image"][value="custom"]');
          const customImg = customCheckbox.parentElement.querySelector('img');
          customImg.src = event.target.result;
          customImg.style.opacity = '1';
        };
        reader.readAsDataURL(file);
      }
    });

    const editCategoryCheckboxes = document.querySelectorAll('input[name="edit-post-category"]');
    editCategoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        editCategoryCheckboxes.forEach(cb => cb.checked = false);
        e.target.checked = true;
      });
    });

    const editVisibilityCheckboxes = document.querySelectorAll('input[name="edit-post-visibility"]');
    editVisibilityCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.value === "ALL" && e.target.checked) {
          editVisibilityCheckboxes.forEach((cb) => {
            if (cb.value !== "ALL") {
              cb.checked = false;
            }
          });
        } else if (e.target.value !== "ALL" && e.target.checked) {
          const allCheckbox = document.querySelector(
            'input[name="edit-post-visibility"][value="ALL"]',
          );
          if (allCheckbox) {
            allCheckbox.checked = false;
          }
        }
      });
    });

    editPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const editVisibilityCheckboxes = document.querySelectorAll(
        'input[name="edit-post-visibility"]:checked',
      );
      const visibilityArray = Array.from(editVisibilityCheckboxes).map(
        (cb) => cb.value,
      );

      if (visibilityArray.length === 0) {
        editPostError.textContent = "Selecione pelo menos uma visibilidade";
        return;
      }

      const selectedImageCheckbox = document.querySelector(
        'input[name="edit-post-image"]:checked',
      );
      const selectedImage = selectedImageCheckbox
        ? selectedImageCheckbox.value
        : "aviso1.png";

      const selectedCategoryCheckbox = document.querySelector(
        'input[name="edit-post-category"]:checked',
      );
      const selectedCategory = selectedCategoryCheckbox
        ? selectedCategoryCheckbox.value
        : "EVENT";

      let imageUrl = selectedImage;
      
      if (selectedImage === 'custom') {
        const customCheckbox = document.querySelector('input[name="edit-post-image"][value="custom"]');
        const customImg = customCheckbox.parentElement.querySelector('img');

        if (customImg && customImg.style.opacity === '1') {
          imageUrl = customImg.src;
        } else {
          const file = editCustomImageUpload.files[0];
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              editPostError.textContent = "A imagem é muito grande. Máximo 5MB.";
              return;
            }
            
            const reader = new FileReader();
            imageUrl = await new Promise((resolve) => {
              reader.onload = (e) => {
                resolve(e.target.result);
              };
              reader.onerror = () => {
                editPostError.textContent = "Erro ao ler a imagem.";
                resolve(selectedImage);
              };
              reader.readAsDataURL(file);
            });
          } else {
            editPostError.textContent = "Selecione uma imagem para upload";
            return;
          }
        }
      }

      const postId = document.getElementById('edit-post-id').value;
      const postData = {
        title: document.getElementById('edit-post-title').value,
        summary: document.getElementById('edit-post-summary').value,
        category: selectedCategory,
        visibility: visibilityArray,
        imageUrl: imageUrl,
        eventDate: document.getElementById('edit-post-date').value,
        location: document.getElementById('edit-post-location').value
      };

      try {
        const response = await fetch(`https://projeto-senai-connect.onrender.com/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          editPostModal.classList.remove("active");
          editPostForm.reset();
          editPostError.textContent = "";
          editCustomImageUpload.value = '';
          
          const customCheckbox = document.querySelector('input[name="edit-post-image"][value="custom"]');
          const customImg = customCheckbox.parentElement.querySelector('img');
          customImg.src = './assets/images/aviso1.png';
          customImg.style.opacity = '0.5';
          
          alert('Post atualizado com sucesso!');
          window.location.reload();
        } else {
          editPostError.textContent = "Erro ao atualizar post";
        }
      } catch (error) {
        console.error('Erro ao atualizar post:', error);
        editPostError.textContent = "Erro ao atualizar post";
      }
    });

    const visibilityCheckboxes = document.querySelectorAll(
      'input[name="post-visibility"]',
    );
    visibilityCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.value === "ALL" && e.target.checked) {
          visibilityCheckboxes.forEach((cb) => {
            if (cb.value !== "ALL") {
              cb.checked = false;
            }
          });
        } else if (e.target.value !== "ALL" && e.target.checked) {
          const allCheckbox = document.querySelector(
            'input[name="post-visibility"][value="ALL"]',
          );
          if (allCheckbox) {
            allCheckbox.checked = false;
          }
        }
      });
    });

    const imageCheckboxes = document.querySelectorAll(
      'input[name="post-image"]',
    );
    const customImageUpload = document.getElementById('custom-image-upload');
    
    imageCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          imageCheckboxes.forEach((cb) => {
            if (cb !== e.target) {
              cb.checked = false;
            }
          });

          if (e.target.value === 'custom') {
            customImageUpload.click();
          }
        }
      });
    });
    
    customImageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const customCheckbox = document.querySelector('input[name="post-image"][value="custom"]');
          const customImg = customCheckbox.parentElement.querySelector('img');
          customImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    const categoryCheckboxes = document.querySelectorAll(
      'input[name="post-category"]',
    );
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          categoryCheckboxes.forEach((cb) => {
            if (cb !== e.target) {
              cb.checked = false;
            }
          });
        }
      });
    });

    btnCreateUserClose.addEventListener("click", () => {
      createUserModal.classList.remove("active");
      createUserForm.reset();
      createUserError.textContent = "";
    });

    const userRoleSelect = document.getElementById("user-role");
    const userCourseGroup = document.getElementById("user-course-group");

    if (userRoleSelect && userCourseGroup) {
      const toggleCourseField = () => {
        const selectedRole = userRoleSelect.value;
        if (selectedRole === "STUDENT") {
          userCourseGroup.style.display = "block";
          document.getElementById("user-course").required = true;
        } else {
          userCourseGroup.style.display = "none";
          document.getElementById("user-course").required = false;
          document.getElementById("user-course").value = "";
        }
      };

      userRoleSelect.addEventListener("change", toggleCourseField);
      toggleCourseField();
    }

    createPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const visibilityCheckboxes = document.querySelectorAll(
        'input[name="post-visibility"]:checked',
      );
      const visibilityArray = Array.from(visibilityCheckboxes).map(
        (cb) => cb.value,
      );

      if (visibilityArray.length === 0) {
        createPostError.textContent = "Selecione pelo menos uma visibilidade";
        return;
      }

      const selectedImageCheckbox = document.querySelector(
        'input[name="post-image"]:checked',
      );
      const selectedImage = selectedImageCheckbox
        ? selectedImageCheckbox.value
        : "aviso1.png";

      const selectedCategoryCheckbox = document.querySelector(
        'input[name="post-category"]:checked',
      );
      const selectedCategory = selectedCategoryCheckbox
        ? selectedCategoryCheckbox.value
        : "EVENT";

      let imageUrl = selectedImage;
      
     
      if (selectedImage === 'custom') {
        const file = customImageUpload.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            createPostError.textContent = "A imagem é muito grande. Máximo 5MB.";
            return;
          }
          
          const reader = new FileReader();
          imageUrl = await new Promise((resolve) => {
            reader.onload = (e) => {
              resolve(e.target.result);
            };
            reader.onerror = () => {
              createPostError.textContent = "Erro ao ler a imagem.";
              resolve(selectedImage);
            };
            reader.readAsDataURL(file);
          });
        } else {
          createPostError.textContent = "Selecione uma imagem para upload";
          return;
        }
      }

      const postData = {
        title: document.getElementById("post-title").value,
        summary: document.getElementById("post-summary").value,
        category: selectedCategory,
        visibility: visibilityArray,
        imageUrl: imageUrl,
        eventDate: document.getElementById("post-date").value,
        location: document.getElementById("post-location").value,
      };

      try {
        const response = await fetch("https://projeto-senai-connect.onrender.com/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (response.ok) {
          createPostModal.classList.remove("active");
          createPostForm.reset();
          createPostError.textContent = "";

          customImageUpload.value = '';

          const customCheckbox = document.querySelector('input[name="post-image"][value="custom"]');
          const customImg = customCheckbox.parentElement.querySelector('img');
          customImg.src = './assets/images/aviso1.png';
          customImg.style.opacity = '0.5';
          
          alert("Post/Evento criado com sucesso!");
          if (window.location.pathname.includes("eventos.html")) {
            window.location.reload();
          }
        } else {
          createPostError.textContent =
            data.message || "Erro ao criar post/evento";
        }
      } catch (error) {
        createPostError.textContent = "Erro de conexão com o servidor";
      }
    });

    createUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const selectedGender = document.querySelector(
        'input[name="user-gender"]:checked',
      );
      const userData = {
        name: document.getElementById("user-name").value,
        email: document.getElementById("user-email").value,
        password: document.getElementById("user-password").value,
        cpf: document.getElementById("user-cpf").value,
        registration: document.getElementById("user-registration").value,
        role: document.getElementById("user-role").value,
        course: document.getElementById("user-course").value,
        gender: selectedGender ? selectedGender.value : "",
        birthdate: document.getElementById("user-birthdate")
          ? document.getElementById("user-birthdate").value
          : "",
      };

      try {
        const response = await fetch(
          "https://projeto-senai-connect.onrender.com/api/user/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          },
        );

        const data = await response.json();

        if (response.ok) {
          createUserModal.classList.remove("active");
          createUserForm.reset();
          createUserError.textContent = "";
          alert("Usuário registrado com sucesso!");
        } else {
          createUserError.textContent =
            data.message || "Erro ao registrar usuário";
        }
      } catch (error) {
        createUserError.textContent = "Erro de conexão com o servidor";
      }
    });

    window.addEventListener("click", (event) => {
      if (event.target === createPostModal) {
        createPostModal.classList.remove("active");
        createPostForm.reset();
        createPostError.textContent = "";
      }
      if (event.target === createUserModal) {
        createUserModal.classList.remove("active");
        createUserForm.reset();
        createUserError.textContent = "";
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (!event.target.closest(".user-menu")) {
      userDropdown.classList.remove("active");
    }
  });
}
