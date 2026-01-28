const API_URL = "http://localhost:3000/api"; // La dirección de tu servidor backend
let token = localStorage.getItem("token"); // Intenta recuperar el token guardado en el navegador

// --- AUTENTICACIÓN ---
async function login() {
    const user = document.getElementById("username").value; // Captura lo que escribiste en el cuadro de usuario
    const pass = document.getElementById("password").value; // Captura lo que escribiste en el cuadro de contraseña

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST", // Le pide al servidor que verifique tus datos
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }) // Envía tus credenciales en formato de texto
    });

    const data = await res.json(); // Espera la respuesta del servidor (el token)
    if (data.token) {
        localStorage.setItem("token", data.token); // Guarda el token en el navegador para que no se borre al refrescar
        token = data.token; // Actualiza la variable local con el nuevo token
        showDashboard(); // Cambia la vista a la pantalla de tareas
    } else {
        alert("Error: " + data.msg); // Avisa si el usuario o contraseña están mal
    }
}

function showDashboard() {
    // Estas líneas ocultan el formulario de login y muestran la lista de tareas
    document.getElementById("auth-container").classList.add("hidden"); 
    document.getElementById("dashboard-container").classList.remove("hidden");
    loadTasks(); // Llama a la función para traer las tareas de la base de datos
}

function logout() {
    localStorage.removeItem("token"); // Borra el token del navegador
    location.reload(); // Recarga la página para volver al inicio
}

// --- FUNCIÓN DE REGISTRO ---
async function register() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (!user || !pass) return alert("Por favor, llena todos los campos");

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST", // Le pide al servidor que cree un nuevo usuario
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await res.json();

        if (res.ok) {
            alert("¡Usuario creado con éxito! Ahora puedes iniciar sesión.");
        } else {
            alert("Error al registrar: " + data.msg); // Muestra el error que configuramos en el backend
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("No se pudo conectar con el servidor."); // Salta si el backend está apagado
    }
}

// --- CRUD DE TAREAS ---
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { "Authorization": `Bearer ${token}` } // Envía el token para demostrar que tienes permiso de ver las tareas
    });
    const tasks = await res.json(); // Recibe la lista de tareas de MongoDB
    const list = document.getElementById("taskList");
    list.innerHTML = ""; // Limpia la lista antes de volver a llenarla
    
    tasks.forEach(task => {
        // Por cada tarea, crea un elemento de lista con un botón de borrar
        list.innerHTML += `
            <li>
                ${task.title}
                <button onclick="deleteTask('${task._id}')" style="width:auto; background:red;">X</button>
            </li>
        `;
    });
}

async function createTask() {
    const title = document.getElementById("taskTitle").value; // Captura el nombre de la tarea (ej: "jamica")
    await fetch(`${API_URL}/tasks`, {
        method: "POST", // Le pide al servidor que guarde la nueva tarea
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // El guardia de seguridad (middleware) revisará esto
        },
        body: JSON.stringify({ title })
    });
    document.getElementById("taskTitle").value = ""; // Limpia el cuadro de texto
    loadTasks(); // Refresca la lista para que aparezca la nueva tarea
}

async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE", // Le pide al servidor borrar la tarea con ese ID único
        headers: { "Authorization": `Bearer ${token}` }
    });
    loadTasks(); // Refresca la lista después de borrar
}

// Al abrir la página, revisa si el token existe para saltarse el login
if (token) showDashboard();