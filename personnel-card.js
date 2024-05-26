// ====================== Personel Silme ======================
function deletePerson(index) {
    const personId = persons[index].id;
    persons.splice(index, 1);
  
    projects.forEach((project) => {
      deletePersonFromProject(project.id, personId);
    });
  
    renderPersons();
  }
  
  // ====================== Personel Düzenleme ======================
  function editPerson(index) {
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
  }
  
  // ====================== Personel Güncelleme ======================
  function updatePerson(index) {
    const newPersonName = document.getElementById('newPersonName').value;
    const newPersonColor = document.getElementById('newPersonColor').value;
    persons[index].name = newPersonName;
    persons[index].color = newPersonColor;
    renderPersons();
    renderProjects();
    closeModal();
  }
  
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
  
  // ====================== Personel Silme (Proje İçinden) ======================
  function deletePersonFromProject(projectId, personId) {
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
  }