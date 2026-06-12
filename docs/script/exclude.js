function injectDeleteConfirmModal() {
  if (!document.getElementById('delete-confirm-modal')) {
    const modalHTML = `
      <div id="delete-confirm-modal" class="modal-overlay">
        <div class="modal-box confirm-modal">
          <span id="btn-delete-confirm-close" class="close-btn">&times;</span>
          <h2>Confirmar Exclusão</h2>
          <p>Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>
          <div class="confirm-buttons">
            <button id="btn-cancel-delete" class="btn-cancel">Cancelar</button>
            <button id="btn-confirm-delete" class="btn-confirm-delete">Excluir</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

window.deleteTarget = null;

function openDeleteConfirmModal(id, type, deleteCallback) {
  window.deleteTarget = { id, type, deleteCallback };
  
  const modal = document.getElementById('delete-confirm-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function setupDeleteConfirmModal() {
  injectDeleteConfirmModal();
  
  const modal = document.getElementById('delete-confirm-modal');
  const closeBtn = document.getElementById('btn-delete-confirm-close');
  const cancelBtn = document.getElementById('btn-cancel-delete');
  const confirmBtn = document.getElementById('btn-confirm-delete');

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      window.deleteTarget = null;
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      window.deleteTarget = null;
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!window.deleteTarget) {
        modal.classList.remove('active');
        return;
      }

      if (window.deleteTarget.deleteCallback && typeof window.deleteTarget.deleteCallback === 'function') {
        await window.deleteTarget.deleteCallback(window.deleteTarget.id, window.deleteTarget.type);
      }

      modal.classList.remove('active');
      window.deleteTarget = null;
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      window.deleteTarget = null;
    }
  });
}

window.addEventListener('DOMContentLoaded', setupDeleteConfirmModal);
