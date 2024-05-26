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
// ====================== Fonksiyon Çağrıları ======================
  // (Önemli: Fonksiyon çağrılarını doğru sırada yapın)
  window.showAddPersonModal = showAddPersonModal; 
  window.addPerson = addPerson; 
  window.deletePerson = deletePerson; 
  window.editPerson = editPerson; 
  window.updatePerson = updatePerson; 
  window.renderPersons = renderPersons; 

  window.showAddProjectModal = showAddProjectModal; 
  window.addProject = addProject; 
  window.deleteProject = deleteProject; 
  window.showEditProjectModal = showEditProjectModal; 
  window.addSubtask = addSubtask; 
  window.updateProject = updateProject; 
  window.renderProjects = renderProjects; 

  window.showAddColumnModal = showAddColumnModal; 
  window.addColumn = addColumn; 
  window.deleteColumn = deleteColumn; 
  window.editColumn = editColumn; 
  window.updateAddColumnButtonVisibility = updateAddColumnButtonVisibility; 

  window.closeModal = closeModal; 
  window.dragStart = dragStart; 
  window.dragEnd = dragEnd; 
  window.drop = drop; 
  window.dragOver = dragOver; 
  window.positionAddProjectButton = positionAddProjectButton; 
  window.deletePersonFromProject = deletePersonFromProject; 




  addPersonBtn.addEventListener('click', showAddPersonModal);
  addColumnBtn.addEventListener('click', showAddColumnModal);
  toggleSidebarBtn.addEventListener('click', toggleSidebar);
  

  // ====================== Fonksiyon Çağrıları ======================

  renderPersons();
  renderProjects();
  updateAddColumnButtonVisibility();
});