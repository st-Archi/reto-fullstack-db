const API_URL = "http://localhost:3000/api";
let token = localStorage.getItem("token");

// --- AUTENTICACIÓN ---
async function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        token = data.token;
        showDashboard();
    } else {
        alert("Error: " + data.msg);
    }
}

function showDashboard() {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("dashboard-container").classList.remove("hidden");
    loadTasks();
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// --- FUNCIÓN DE REGISTRO ---
async function register() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // Validamos que no estén vacíos
    if (!user || !pass) return alert("Por favor, llena todos los campos");

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await res.json();

        if (res.ok) {
            alert("¡Usuario creado con éxito! Ahora puedes iniciar sesión.");
        } else {
            alert("Error al registrar: " + data.msg);
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

// --- CRUD DE TAREAS ---
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    
    tasks.forEach(task => {
        list.innerHTML += `
            <li>
                ${task.title}
                <button onclick="deleteTask('${task._id}')" style="width:auto; background:red;">X</button>
            </li>
        `;
    });
}

async function createTask() {
    const title = document.getElementById("taskTitle").value;
    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title })
    });
    document.getElementById("taskTitle").value = "";
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    loadTasks();
}

// Al cargar la página, ver si ya hay sesión
if (token) showDashboard();