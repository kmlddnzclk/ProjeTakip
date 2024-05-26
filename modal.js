// ====================== Modal Kapatma ======================
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
    }
  }
  
  // ====================== Modal Fonksiyonları ======================
  function showAddProjectModal(status = null) { 
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Proje Ekle</h2>
            <input type="text" id="projectName" placeholder="Proje Adı">
            <select id="projectStatus">
                ${columnStatuses
                  .map(
                    (s) =>
                      `<option value="${s}" ${
                        s === status ? 'selected' : ''
                      }>${s.replace(/-/g, ' ').toUpperCase()}</option>`
                  )
                  .join('')}
            </select>
            <button onclick="addProject()">Ekle</button>
            <button onclick="closeModal()">Kapat</button> 
        </div>
    `;
    document.body.appendChild(modal);
  }
  
  function showAddPersonModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Personel Ekle</h2>
            <input type="text" id="personName" placeholder="Personel Adı">
            <button onclick="addPerson()">Ekle</button>
            <button onclick="closeModal()">Kapat</button> 
        </div>
    `;
    document.body.appendChild(modal);
  }
  
  function showAddColumnModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Sütun Ekle</h2>
            <input type="text" id="columnName" placeholder="Sütun Adı">
            <button onclick="addColumn()">Ekle</button>
            <button onclick="closeModal()">Kapat</button> 
        </div>
    `;
    document.body.appendChild(modal);
  }