// (Önemli: Fonksiyonları window nesnesine ekleyin)
window.addColumn = addColumn;
window.createKanbanColumn = createKanbanColumn;
window.updateAddColumnButtonVisibility = updateAddColumnButtonVisibility;
window.showEditColumnModal = showEditColumnModal;
window.editColumn = editColumn;
window.deleteColumn = deleteColumn;
window.positionAddProjectButton = positionAddProjectButton;
// ====================== Sütun Ekleme ======================
function addColumn() {
  if (columnStatuses.length < maxKanbanColumns) {
    const columnName = document.getElementById('columnName').value;
    if (columnName) {
      const formattedColumnName = columnName
        .toLowerCase()
        .replace(/\s/g, '-');
      columnStatuses.push(formattedColumnName);
      const kanbanBoard = document.querySelector('.kanban-board');
      kanbanBoard.appendChild(createKanbanColumn(formattedColumnName));
      closeModal();
      updateAddColumnButtonVisibility();
    }
  } else {
    alert(`Maksimum ${maxKanbanColumns} sütun ekleyebilirsiniz.`);
  }
}

// ====================== Sütun Oluşturma ======================
function createKanbanColumn(status) {
  const column = document.createElement('div');
  column.classList.add('kanban-column');
  column.setAttribute('id', status);

  const columnHeader = document.createElement('div');
  columnHeader.classList.add('column-header');

  const title = document.createElement('h2');
  title.textContent = status.replace(/-/g, ' ').toUpperCase();
  columnHeader.appendChild(title);

  const columnControls = document.createElement('div');
  columnControls.classList.add('column-controls');

  const editColumnBtn = document.createElement('button');
  editColumnBtn.classList.add('edit-column-btn');
  editColumnBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editColumnBtn.onclick = () => showEditColumnModal(status);
  columnControls.appendChild(editColumnBtn);

  const deleteColumnBtn = document.createElement('button');
  deleteColumnBtn.classList.add('delete-column-btn');
  deleteColumnBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteColumnBtn.onclick = () => deleteColumn(status);
  columnControls.appendChild(deleteColumnBtn);

  columnHeader.appendChild(columnControls);
  column.appendChild(columnHeader); 

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('kanban-cards');
  cardsContainer.setAttribute('data-status', status);
  cardsContainer.addEventListener('dragover', dragOver);
  cardsContainer.addEventListener('drop', drop);

  column.appendChild(cardsContainer);

  // Sütun sonuna ekleme butonu ekle
  const addProjectBtnAfterColumn = document.createElement('i'); 
  addProjectBtnAfterColumn.classList.add('add-project-btn', 'fas', 'fa-plus', 'column-add-btn'); 
  addProjectBtnAfterColumn.onclick = () => {
    showAddProjectModal(status);
  };
  column.appendChild(addProjectBtnAfterColumn);
    
  return column;
}

// ====================== Sütun Ekleme Butonu Görünürlüğü ======================
function updateAddColumnButtonVisibility() {
  addColumnBtn.style.display =
    columnStatuses.length < maxKanbanColumns ? 'inline-block' : 'none';
}

// ====================== Sütun Düzenleme ======================
function showEditColumnModal(status) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
      <div class="modal-content">
          <h2>Sütun Düzenle</h2>
          <input type="text" id="newColumnName" placeholder="Yeni Sütun Adı" value="${status
            .replace(/-/g, ' ')
            .toUpperCase()}">
          <input type="color" id="newColumnColor" value="#3498db">
          <button onclick="editColumn('${status}')">Düzenle</button>
          <button onclick="closeModal()">Kapat</button> 
      </div>
  `;
  document.body.appendChild(modal);
}

// ====================== Sütun Güncelleme ======================
function editColumn(oldStatus) {
  const newColumnName = document.getElementById('newColumnName').value;
  const newColumnColor = document.getElementById('newColumnColor').value;
  if (newColumnName) {
    const newStatus = newColumnName.toLowerCase().replace(/\s/g, '-');

    // Sütun durumunu güncelle
    const statusIndex = columnStatuses.indexOf(oldStatus);
    if (statusIndex !== -1) {
      columnStatuses[statusIndex] = newStatus;
    }

    // Projelerin durumlarını güncelle
    projects.forEach((project) => {
      if (project.status === oldStatus) {
        project.status = newStatus;
      }
    });

    // Sütunun başlığını ve rengini güncelle
    const column = document.getElementById(oldStatus);
    if (column) {
      column.querySelector('h2').textContent =
        newColumnName.toUpperCase();
      column.style.backgroundColor = newColumnColor;
      column.id = newStatus; 
    }

    closeModal();
    renderProjects(); 
  }
}

// ====================== Sütun Silme ======================
function deleteColumn(status) {
  if (confirm(`"${status}" sütununu silmek istediğinizden emin misiniz? Bu sütundaki tüm projeler "Çalışılıyor" sütununa taşınacaktır.`)) {
      
    // Sütun durumunu diziden kaldır
    const statusIndex = columnStatuses.indexOf(status);
    if (statusIndex > -1) {
      columnStatuses.splice(statusIndex, 1);
    }

    // Bu sütunda bulunan projeleri "working" sütununa taşı
    projects.forEach((project) => {
      if (project.status === status) {
        project.status = 'working';
      }
    });

    renderProjects();
    updateAddColumnButtonVisibility(); 
  }
}

// ====================== Buton Konumlandırma ======================
function positionAddProjectButton(column) {
  const addProjectButton = column.querySelector('.column-add-btn');
  const cardsContainer = column.querySelector('.kanban-cards');
      
  if (cardsContainer.children.length === 0) { // Kart yoksa
    addProjectButton.style.position = 'absolute'; 
    addProjectButton.style.top = '50%';
    addProjectButton.style.left = '50%';
    addProjectButton.style.transform = 'translate(-50%, -50%)';
  } else { // Kartlar varsa
    addProjectButton.style.position = 'absolute';
    addProjectButton.style.bottom = '10px'; 
    addProjectButton.style.right = '10px'; 
  }
}

// ====================== Fonksiyonları window nesnesine ekle ======================
window.addColumn = addColumn;
window.createKanbanColumn = createKanbanColumn;
window.updateAddColumnButtonVisibility = updateAddColumnButtonVisibility;
window.showEditColumnModal = showEditColumnModal;
window.editColumn = editColumn;
window.deleteColumn = deleteColumn;
window.positionAddProjectButton = positionAddProjectButton;// ====================== Sütun Ekleme ======================
function addColumn() {
  if (columnStatuses.length < maxKanbanColumns) {
    const columnName = document.getElementById('columnName').value;
    if (columnName) {
      const formattedColumnName = columnName
        .toLowerCase()
        .replace(/\s/g, '-');
      columnStatuses.push(formattedColumnName);
      const kanbanBoard = document.querySelector('.kanban-board');
      kanbanBoard.appendChild(createKanbanColumn(formattedColumnName));
      closeModal();
      updateAddColumnButtonVisibility();
    }
  } else {
    alert(`Maksimum ${maxKanbanColumns} sütun ekleyebilirsiniz.`);
  }
}

// ====================== Sütun Oluşturma ======================
function createKanbanColumn(status) {
  const column = document.createElement('div');
  column.classList.add('kanban-column');
  column.setAttribute('id', status);

  const columnHeader = document.createElement('div');
  columnHeader.classList.add('column-header');

  const title = document.createElement('h2');
  title.textContent = status.replace(/-/g, ' ').toUpperCase();
  columnHeader.appendChild(title);

  const columnControls = document.createElement('div');
  columnControls.classList.add('column-controls');

  const editColumnBtn = document.createElement('button');
  editColumnBtn.classList.add('edit-column-btn');
  editColumnBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editColumnBtn.onclick = () => showEditColumnModal(status);
  columnControls.appendChild(editColumnBtn);

  const deleteColumnBtn = document.createElement('button');
  deleteColumnBtn.classList.add('delete-column-btn');
  deleteColumnBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteColumnBtn.onclick = () => deleteColumn(status);
  columnControls.appendChild(deleteColumnBtn);

  columnHeader.appendChild(columnControls);
  column.appendChild(columnHeader); 

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('kanban-cards');
  cardsContainer.setAttribute('data-status', status);
  cardsContainer.addEventListener('dragover', dragOver);
  cardsContainer.addEventListener('drop', drop);

  column.appendChild(cardsContainer);

  // Sütun sonuna ekleme butonu ekle
  const addProjectBtnAfterColumn = document.createElement('i'); 
  addProjectBtnAfterColumn.classList.add('add-project-btn', 'fas', 'fa-plus', 'column-add-btn'); 
  addProjectBtnAfterColumn.onclick = () => {
    showAddProjectModal(status);
  };
  column.appendChild(addProjectBtnAfterColumn);
    
  return column;
}

// ====================== Sütun Ekleme Butonu Görünürlüğü ======================
function updateAddColumnButtonVisibility() {
  addColumnBtn.style.display =
    columnStatuses.length < maxKanbanColumns ? 'inline-block' : 'none';
}

// ====================== Sütun Düzenleme ======================
function showEditColumnModal(status) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
      <div class="modal-content">
          <h2>Sütun Düzenle</h2>
          <input type="text" id="newColumnName" placeholder="Yeni Sütun Adı" value="${status
            .replace(/-/g, ' ')
            .toUpperCase()}">
          <input type="color" id="newColumnColor" value="#3498db">
          <button onclick="editColumn('${status}')">Düzenle</button>
          <button onclick="closeModal()">Kapat</button> 
      </div>
  `;
  document.body.appendChild(modal);
}

// ====================== Sütun Güncelleme ======================
function editColumn(oldStatus) {
  const newColumnName = document.getElementById('newColumnName').value;
  const newColumnColor = document.getElementById('newColumnColor').value;
  if (newColumnName) {
    const newStatus = newColumnName.toLowerCase().replace(/\s/g, '-');

    // Sütun durumunu güncelle
    const statusIndex = columnStatuses.indexOf(oldStatus);
    if (statusIndex !== -1) {
      columnStatuses[statusIndex] = newStatus;
    }

    // Projelerin durumlarını güncelle
    projects.forEach((project) => {
      if (project.status === oldStatus) {
        project.status = newStatus;
      }
    });

    // Sütunun başlığını ve rengini güncelle
    const column = document.getElementById(oldStatus);
    if (column) {
      column.querySelector('h2').textContent =
        newColumnName.toUpperCase();
      column.style.backgroundColor = newColumnColor;
      column.id = newStatus; 
    }

    closeModal();
    renderProjects(); 
  }
}

// ====================== Sütun Silme ======================
function deleteColumn(status) {
  if (confirm(`"${status}" sütununu silmek istediğinizden emin misiniz? Bu sütundaki tüm projeler "Çalışılıyor" sütununa taşınacaktır.`)) {
      
    // Sütun durumunu diziden kaldır
    const statusIndex = columnStatuses.indexOf(status);
    if (statusIndex > -1) {
      columnStatuses.splice(statusIndex, 1);
    }

    // Bu sütunda bulunan projeleri "working" sütununa taşı
    projects.forEach((project) => {
      if (project.status === status) {
        project.status = 'working';
      }
    });

    renderProjects();
    updateAddColumnButtonVisibility(); 
  }
}

// ====================== Buton Konumlandırma ======================
function positionAddProjectButton(column) {
  const addProjectButton = column.querySelector('.column-add-btn');
  const cardsContainer = column.querySelector('.kanban-cards');
      
  if (cardsContainer.children.length === 0) { // Kart yoksa
    addProjectButton.style.position = 'absolute'; 
    addProjectButton.style.top = '50%';
    addProjectButton.style.left = '50%';
    addProjectButton.style.transform = 'translate(-50%, -50%)';
  } else { // Kartlar varsa
    addProjectButton.style.position = 'absolute';
    addProjectButton.style.bottom = '10px'; 
    addProjectButton.style.right = '10px'; 
  }
}
