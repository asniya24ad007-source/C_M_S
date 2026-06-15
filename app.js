const API_URL = 'http://localhost:3000/api/students';

// Fetch lists upon application launch
document.addEventListener('DOMContentLoaded', fetchStudents);

async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const tbody = document.getElementById('studentTableBody');
        tbody.innerHTML = '';

        data.forEach(student => {
            tbody.innerHTML += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.student_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.department_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Year ${student.year}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onclick="editStudent(${JSON.stringify(student).replace(/"/g, '&quot;')})" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition">Edit</button>
                        <button onclick="deleteStudent(${student.student_id})" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function saveStudent(event) {
    event.preventDefault();
    const mode = document.getElementById('formMode').value;
    const id = document.getElementById('student_id').value;

    const studentData = {
        student_id: id,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        department_id: document.getElementById('department_id').value,
        year: document.getElementById('year').value
    };

    let url = API_URL;
    let method = 'POST';

    if (mode === 'edit') {
        url = `${API_URL}/${id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            closeModal();
            fetchStudents();
        } else {
            alert('An error occurred while saving.');
        }
    } catch (error) {
        console.error('Error saving student:', error);
    }
}

async function deleteStudent(id) {
    if (confirm('Are you completely sure you want to delete this student record?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}

// Modal Toggle Controls
function openModal() {
    document.getElementById('studentModal').classList.remove('hidden');
    document.getElementById('modalTitle').innerText = "Add New Student";
    document.getElementById('formMode').value = "add";
    document.getElementById('student_id').disabled = false;
    document.getElementById('studentForm').reset();
}

function closeModal() {
    document.getElementById('studentModal').classList.add('hidden');
}

function editStudent(student) {
    document.getElementById('studentModal').classList.remove('hidden');
    document.getElementById('modalTitle').innerText = "Edit Student Details";
    document.getElementById('formMode').value = "edit";
    
    // Auto-fill values
    document.getElementById('student_id').value = student.student_id;
    document.getElementById('student_id').disabled = true; // Block tweaking base key IDs
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('department_id').value = student.department_id;
    document.getElementById('year').value = student.year;
}