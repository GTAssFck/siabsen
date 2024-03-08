document.addEventListener('DOMContentLoaded', function() {
    const attendanceForm = document.getElementById('attendanceForm');
    const attendanceList = document.getElementById('attendanceList');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');

    // Function to submit attendance
    function submitAttendance(event) {
        event.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const status = document.getElementById('status').value;

        // Create new attendance item
        const attendanceItem = document.createElement('div');
        const itemId = 'attendanceItem' + Date.now(); // Generate unique ID
        attendanceItem.setAttribute('id', itemId);
        attendanceItem.classList.add('attendance-item');
        attendanceItem.innerHTML = `
            <p><span>Nama:</span> ${name}</p>
            <p><span>Tanggal:</span> ${date}</p>
            <p><span>Status:</span> ${status}</p>
            <button class="edit" data-id="${itemId}" onclick="openEditModal('${itemId}')">Edit</button>
            <button class="delete" data-id="${itemId}">Hapus</button>
        `;

        // Add event listener for delete button
        const deleteButton = attendanceItem.querySelector('.delete');
        deleteButton.addEventListener('click', function(event) {
            attendanceItem.remove();
            saveDataToLocalStorage(); // Save updated data to Local Storage
        });

        // Add attendance item to list
        attendanceList.appendChild(attendanceItem);

        // Save data to Local Storage
        saveDataToLocalStorage();

        // Clear form fields
        attendanceForm.reset();
    }

    // Event listener for form submission
    attendanceForm.addEventListener('submit', submitAttendance);

    // Function to save data to Local Storage
    function saveDataToLocalStorage() {
        localStorage.setItem('attendances', attendanceList.innerHTML);
    }

    // Function to load data from Local Storage
    function loadDataFromLocalStorage() {
        const savedAttendances = localStorage.getItem('attendances');
        if (savedAttendances) {
            attendanceList.innerHTML = savedAttendances;
            // Add event listener for delete button for each saved item
            attendanceList.querySelectorAll('.delete').forEach(deleteButton => {
                deleteButton.addEventListener('click', function(event) {
                    const itemId = deleteButton.getAttribute('data-id');
                    const attendanceItem = document.getElementById(itemId);
                    attendanceItem.remove();
                    saveDataToLocalStorage();
                });
            });
        }
    }

    // Load data from Local Storage when the page is loaded
    loadDataFromLocalStorage();

    // Event listener for closing modal
    closeBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Function to open edit modal and populate form with data
    window.openEditModal = function(itemId) {
        const attendanceItem = document.getElementById(itemId);
        const name = attendanceItem.querySelector('p:nth-child(1) span').textContent;
        const date = attendanceItem.querySelector('p:nth-child(2) span').textContent;
        const status = attendanceItem.querySelector('p:nth-child(3) span').textContent;

        document.getElementById('editName').value = name;
        document.getElementById('editDate').value = date;
        document.getElementById('editStatus').value = status;

        document.getElementById('saveChangesBtn').setAttribute('data-id', itemId); // Set item ID for saving changes

        editModal.style.display = 'block';
    };

    // Event listener for clicking "Simpan Perubahan" button in edit modal
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.addEventListener('click', function(event) {
        event.preventDefault();

        // Get edited data from the modal
        const editedName = document.getElementById('editName').value;
        const editedDate = document.getElementById('editDate').value;
        const editedStatus = document.getElementById('editStatus').value;

        // Find the corresponding attendance item in the list and update its data
        const itemId = saveChangesBtn.getAttribute('data-id');
        const attendanceItem = document.getElementById(itemId);
        attendanceItem.querySelector('p:nth-child(1) span').textContent = editedName;
        attendanceItem.querySelector('p:nth-child(2) span').textContent = editedDate;
        attendanceItem.querySelector('p:nth-child(3) span').textContent = editedStatus;

        // Close the edit modal
        editModal.style.display = 'none';


        // Save updated data to Local Storage
        saveDataToLocalStorage();
    });

    // Event listener for export to Excel button
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);

    // Function to export data to Excel
    function exportToExcel() {
        let csvContent = "data:text/csv;charset=utf-8,";

        // Loop through attendance items
        attendanceList.querySelectorAll('.attendance-item').forEach(item => {
            const name = item.querySelector('p:nth-child(1) span').textContent;
            const date = item.querySelector('p:nth-child(2) span').textContent;
            const status = item.querySelector('p:nth-child(3) span').textContent;
            csvContent += `${name},${date},${status}\n`;
        });

        // Create a link element and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "attendance.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
    }

});
