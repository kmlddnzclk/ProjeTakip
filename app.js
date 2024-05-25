document.addEventListener('DOMContentLoaded', function () {
  // ====================== Değişkenler ======================

    const projects = [
      {
        id: Date.now(),
        name: 'Örnek Proje',
        status: 'yapılacaklar',
        assignedPersons: [1, 2, 3, 4, 5, 6],
        color: '#1abc9c' 
      }
    ];
    const persons = [
      { id: 1, name: 'Ahmet', color: '#f39c12' },
      { id: 2, name: 'Mehmet', color: '#e67e22' },
      { id: 3, name: 'Ayşe', color: '#d35400' },
      { id: 4, name: 'Fatma', color: '#c0392b' },
      { id: 5, name: 'Ali', color: '#9b59b6' },
      { id: 6, name: 'Veli', color: '#f39c12' }
    ];

  const columnStatuses = ['yapılacaklar', 'devam-ediyor', 'beklemede', 'bitti']; 
  const maxKanbanColumns = 5;
  const projectCardColors = ['#1abc9c', '#3498db', '#e74c3c', '#f39c12', '#2ecc71'];
  const personCardColors = ['#f39c12', '#e67e22', '#d35400', '#c0392b', '#9b59b6']; 

  // ====================== Element Seçimi ======================
  const addPersonBtn = document.getElementById('addPersonBtn');
  const addColumnBtn = document.getElementById('addColumnBtn');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const leftSidebar = document.querySelector('.left-sidebar');
  const kanbanBoard = document.querySelector('.kanban-board');

  // ====================== Olay Dinleyicileri ======================
  addPersonBtn.addEventListener('click', showAddPersonModal);
  addColumnBtn.addEventListener('click', showAddColumnModal);
  toggleSidebarBtn.addEventListener('click', toggleSidebar);
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

  // ====================== Sütun Ekleme ======================
  window.addColumn = function () {
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
  };

  // ====================== Proje Ekleme ======================
  window.addProject = function () {
    const projectName = document.getElementById('projectName').value;
    const projectStatus = document.getElementById('projectStatus').value;

    if (projectName) {
      const project = {
        id: Date.now(),
        name: projectName,
        status: projectStatus,
        assignedPersons: [],
        color: projectCardColors[projects.length % projectCardColors.length], 
      };
      projects.push(project);
      renderProjects();
      closeModal();
    }
  };

  // ====================== Personel Ekleme ======================
  window.addPerson = function () {
    const personName = document.getElementById('personName').value;

    if (personName) {
      const person = {
        id: Date.now(),
        name: personName,
        color: personCardColors[persons.length % personCardColors.length], 
      };
      persons.push(person);
      renderPersons();
      closeModal();
    }
  };

  // ====================== Modal Kapatma ======================
  window.closeModal = function () {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
    }
  };

  // ====================== Personel Silme ======================
  window.deletePersonFromProject = function (projectId, personId) {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex > -1) {
      const personIndex = projects[projectIndex].assignedPersons.indexOf(
        personId
      );
      if (personIndex > -1) {
        projects[projectIndex].assignedPersons.splice(personIndex, 1);
        renderProjects();
      }
    }
  };

  // ====================== Personel Silme ======================
  window.deletePerson = function (index) {
    const personId = persons[index].id;
    persons.splice(index, 1);

    projects.forEach((project) => {
      deletePersonFromProject(project.id, personId);
    });

    renderPersons();
  };

  // ====================== Personel Düzenleme ======================
  window.editPerson = function (index) {
    const person = persons[index];
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
            <h2>Personel Düzenle</h2>
            <input type="text" id="newPersonName" placeholder="Personel Adı" value="${person.name}">
            <label for="newPersonColor">Renk Seçimi:</label> <input type="color" id="newPersonColor" value="${person.color}">
            <button onclick="updatePerson(${index})">Güncelle</button>
            <button onclick="closeModal()">Kapat</button> 
        </div>
      `;
      document.body.appendChild(modal);
    };

  // ====================== Personel Güncelleme ======================
  window.updatePerson = function(index) {
    const newPersonName = document.getElementById('newPersonName').value;
    const newPersonColor = document.getElementById('newPersonColor').value;
    persons[index].name = newPersonName;
    persons[index].color = newPersonColor;
    renderPersons();
    renderProjects();
    closeModal();
  };

  // ====================== Personel Listesi Oluşturma ======================
  function renderPersons() {
    const personnelBoard = document.querySelector('.personnel-cards');
    personnelBoard.innerHTML = '';

    persons.forEach((person, index) => {
      const personCard = document.createElement('div');
      personCard.classList.add('personnel-card');
      personCard.setAttribute('data-id', person.id);
      personCard.setAttribute('draggable', true);
      personCard.style.backgroundColor = person.color;
      personCard.addEventListener('dragstart', dragStart);
      personCard.addEventListener('dragend', dragEnd);

      const nameSpan = document.createElement('span');
      nameSpan.textContent = person.name;
      nameSpan.style.display = 'block';

      const buttonsDiv = document.createElement('div');

      const editButton = document.createElement('button');
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.onclick = () => editPerson(index);

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteButton.onclick = () => deletePerson(index);

      buttonsDiv.appendChild(editButton);
      buttonsDiv.appendChild(deleteButton);

      personCard.appendChild(nameSpan);
      personCard.appendChild(buttonsDiv);
      personnelBoard.appendChild(personCard);
    });
  }

  // ====================== Kanban Sütun Oluşturma ======================
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
  window.editColumn = function (oldStatus) {
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
  };

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

  // ====================== Sütun Ekleme Butonu Görünürlüğü ======================
  function updateAddColumnButtonVisibility() {
    addColumnBtn.style.display =
      columnStatuses.length < maxKanbanColumns ? 'inline-block' : 'none';
  }

  // ====================== Proje Düzenleme ======================
  function showEditProjectModal(project) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
          <h2>Proje Düzenle</h2>
          <input type="text" id="editProjectName" placeholder="Proje Adı" value="${project.name}">
          <div id="subtasksContainer">
            <h3>Alt Görevler</h3>
            ${project.subtasks
              .map(
                (subtask, index) => `
                  <div class="subtask">
                    <input type="checkbox" id="subtask-${index}" ${
                      subtask.completed ? 'checked' : ''
                    }>
                    <label for="subtask-${index}">${subtask.name}</label>
                  </div>
                `
              )
              .join('')}
          </div>
          <input type="text" id="newSubtaskName" placeholder="Yeni Alt Görev">
          <button onclick="addSubtask(${project.id})">Ekle</button>
          <button onclick="updateProject(${project.id})">Güncelle</button>
          <button onclick="closeModal()">Kapat</button> 
      </div>
  `;
    document.body.appendChild(modal);

    // Alt görev ekleme butonuna olay dinleyicisi ekle
    const newSubtaskInput = document.getElementById('newSubtaskName');
    newSubtaskInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        addSubtask(project.id);
      }
    });
  }

  // ====================== Alt Görev Ekleme ======================
  window.addSubtask = function (projectId) {
    const newSubtaskName = document.getElementById('newSubtaskName').value;
    if (newSubtaskName) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        project.subtasks.push({
          name: newSubtaskName,
          completed: false
        });
        showEditProjectModal(project); // Modülü yeniden oluştur
        document.getElementById('newSubtaskName').value = ''; // Giriş alanını temizle
      }
    }
  };

  // ====================== Proje Güncelleme ======================
  window.updateProject = function (projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.name = document.getElementById('editProjectName').value;
      // Alt görevlerin tamamlanma durumunu güncelle
      project.subtasks.forEach((subtask, index) => {
        subtask.completed = document.getElementById(`subtask-${index}`).checked;
      });
      renderProjects();
      closeModal();
    }
  };

  // ====================== Proje Listesi Oluşturma ======================
  function renderProjects() {
    const kanbanBoard = document.querySelector('.kanban-board');
    kanbanBoard.innerHTML = ''; 

    columnStatuses.forEach((status) => {
      kanbanBoard.appendChild(createKanbanColumn(status));
    });

    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.classList.add('kanban-card');
      projectCard.setAttribute('draggable', true);
      projectCard.setAttribute('data-id', project.id);
      projectCard.style.backgroundColor = project.color; 
      
      projectCard.addEventListener('dragstart', dragStart);
      projectCard.addEventListener('dragend', dragEnd);
      projectCard.addEventListener('dblclick', () => {
        showEditProjectModal(project);
      });

      const column = document.querySelector(
        `.kanban-cards[data-status="${project.status}"]`
      );
      // Kartı sütuna ekledikten sonra butonu konumlandır
      column.appendChild(projectCard); // Kartları sütunun sonuna ekle

        const projectName = document.createElement('h3');
        projectName.textContent = project.name;
        projectCard.appendChild(projectName);

      if (project.assignedPersons.length > 0) {
        const personList = document.createElement('div');
        personList.classList.add('personnel-cards');

          // Inline stil olarak flex özelliklerini ekliyoruz
        personList.style.display = 'flex';
        personList.style.flexWrap = 'wrap';
        personList.style.gap = '3px';
        personList.style.alignItems = 'flex-start';

        let visiblePersonCount = 0; // Görünen personel sayısı
        
        const personnelContainer = document.createElement('div'); // personnelContainer'ı burada tanımladık
        personnelContainer.classList.add('personnel-container');

        project.assignedPersons.forEach((personId, personIndex) => {
          const person = persons.find((p) => p.id === personId);
          if (person) {
            const personCard = document.createElement('div');
            // personCard stil ayarları
            personCard.classList.add('personnel-card');
            personCard.setAttribute('data-id', person.id);
            personCard.setAttribute('draggable', true);
            personCard.style.backgroundColor = person.color;

            // Kart stilini ayarlayalım
            personCard.style.width = '25px'; // Genişlik otomatik olsun
            personCard.style.height = '25px';  
            personCard.style.borderRadius = '50%'; // Hafif yuvarlak köşeler
            personCard.style.padding = '3px 5px'; // İç boşluk ekleyelim

            personCard.style.margin = '2px'; 

            personCard.addEventListener('dragstart', dragStart);
            personCard.addEventListener('dragend', dragEnd);

            personCard.innerHTML = `
              <span style="display: inline-block; font-size: 12px; margin-right: 5px;">${person.name.charAt(0).toUpperCase()}</span>
              <i class="fas fa-trash-alt delete-btn" onclick="event.stopPropagation(); deletePersonFromProject(${project.id}, ${person.id})"></i>

            `;
            personList.appendChild(personCard);

            visiblePersonCount++;
            // 6 karttan sonra gizle
            if (visiblePersonCount >= 6) {
              personCard.style.display = 'none';
            }
          }
            // 5'ten fazla personel varsa "... + (sayı)" metnini ekle
            if (personIndex === project.assignedPersons.length - 1 && project.assignedPersons.length > 5) {
              const extraPersonCount = project.assignedPersons.length - 5;
              const extraPersonText = document.createElement('span');
              extraPersonText.textContent = `... +${extraPersonCount}`;
              extraPersonText.style.fontSize = '12px';
              personList.appendChild(extraPersonText);
            }
        });
        personList.appendChild(personnelContainer); // personnel-container'ı personList'e ekle
        projectCard.appendChild(personList);
      }
      // Tamamlanma yüzdesini hesapla ve göster
      const completedSubtasks = project.subtasks.filter(
        (subtask) => subtask.completed
      ).length;
      const completionPercentage = Math.round(
        (completedSubtasks / project.subtasks.length) * 100
      );
      const completionIndicator = document.createElement('div');
      completionIndicator.classList.add('completion-indicator');
      completionIndicator.textContent = `${completionPercentage}%`;
      projectCard.appendChild(completionIndicator);
    });
  }

  function dragStart(e) {
    if (e.target.classList.contains('personnel-card')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.dataTransfer.setData('type', 'person');

      const ghost = e.target.cloneNode(true);
      ghost.style.width = '150px';
      ghost.style.height = 'auto';
      ghost.style.position = 'absolute';
      ghost.style.opacity = '0.7';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);

      setTimeout(() => ghost.remove(), 0);
    } else if (e.target.classList.contains('kanban-card')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.dataTransfer.setData('type', 'project');
      setTimeout(() => e.target.classList.add('hide'), 0);
    }
  }

  function dragEnd(e) {
    e.target.classList.remove('hide');
  }

  function drop(e) {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    const type = e.dataTransfer.getData('type');

    if (type === 'person') {
      const person = persons.find((p) => p.id === id);
      const targetProjectCard = e.target.closest('.kanban-card');

      if (targetProjectCard) {
        const projectId = parseInt(targetProjectCard.dataset.id);
        const project = projects.find((proj) => proj.id === projectId);

        if (project && !project.assignedPersons.includes(person.id)) {
          project.assignedPersons.push(person.id);

          // Kişiyi sürüklemeden önceki projesinden çıkar
          projects.forEach((p) => {
            if (p.id !== projectId) {
              const index = p.assignedPersons.indexOf(person.id);
              if (index > -1) {
                p.assignedPersons.splice(index, 1);
              }
            }
          });

          renderProjects();
        }
      }
    } else if (type === 'project') {
      const draggedProjectId = parseInt(id);
      const targetColumn = e.target.closest('.kanban-cards');
      const targetStatus = targetColumn.dataset.status;

      if (targetColumn) {
        const project = projects.find((proj) => proj.id === draggedProjectId);
        if (project) {
          project.status = targetStatus;
          renderProjects();
        }
      }
    }
  }

  function dragOver(e) {
    e.preventDefault();
  }

  const kanbanColumns = document.querySelectorAll('.kanban-cards');
  kanbanColumns.forEach((column) => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', drop);
  });

  const kanbanCards = document.querySelectorAll('.kanban-card');
  kanbanCards.forEach((card) => {
    card.addEventListener('dragover', dragOver);
    card.addEventListener('drop', drop);
  });

  function toggleSidebar() {
    leftSidebar.classList.toggle('collapsed');
  // Sidebar kapalıysa kenar boşluğunu 0 yap, açık ise 250px yap
  kanbanBoard.style.marginLeft = leftSidebar.classList.contains('collapsed')
    ? '0'  
    : '250px'; 
  }

  renderPersons();
  renderProjects();
  updateAddColumnButtonVisibility();
});