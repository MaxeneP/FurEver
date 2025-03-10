function selectMenuItem(item, sectionId) {
  document.querySelectorAll('.menu-item').forEach(el => {
    el.classList.remove('active');
    el.querySelector('span').style.fontWeight = 'normal'; 
  });

  item.classList.add('active');
  item.querySelector('span').style.fontWeight = 'bold';
  document.querySelectorAll('.section').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function uploadNewPicture() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profile-picture').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function deletePicture() {
  document.getElementById('profile-picture').src = 'https://placehold.co/100x100';
}

function enableEditing(id) {
  const input = document.getElementById(id);
  input.removeAttribute('readonly');
  input.classList.add('border-b-2', 'border-gray-300');
  input.focus();
  document.getElementById(`edit-${id}`).classList.add('hidden');
  document.getElementById(`save-${id}`).classList.remove('hidden');
}

function saveChanges(id) {
  const input = document.getElementById(id);
  input.setAttribute('readonly', true);
  input.classList.remove('border-b-2', 'border-gray-300');
  document.getElementById(`edit-${id}`).classList.remove('hidden');
  document.getElementById(`save-${id}`).classList.add('hidden');
}
