const form = document.getElementById("supportForm");
const requestsContainer = document.getElementById("requests");

const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const filter = document.getElementById("filter");

let requestNumber = 0;
let requests = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const room = document.getElementById("room").value.trim();
    const email = document.getElementById("email").value.trim();
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const description = document.getElementById("description").value.trim();

    if (name === "" || room === "" || email === "") {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    if (!email.includes("@")) {
        alert("Введите правильный Email.");
        return;
    }

    if (description.length < 10) {
        alert("Описание проблемы должно содержать минимум 10 символов.");
        return;
    }

    requestNumber++;

    const request = {
        number: requestNumber,
        name: name,
        room: room,
        email: email,
        category: category,
        priority: priority,
        description: description,
        status: "Новая",
        date: new Date().toLocaleString()
    };

    requests.push(request);
    displayRequests(requests);
    form.reset();
});

function displayRequests(list) {
    requestsContainer.innerHTML = "";

    list.forEach(function(request) {
        const card = document.createElement("div");
        card.className = "request-card";

        const title = document.createElement("h3");
        title.textContent = "Заявка №" + request.number;

        const user = document.createElement("p");
        user.textContent = "Пользователь: " + request.name;

        const room = document.createElement("p");
        room.textContent = "Кабинет: " + request.room;

        const email = document.createElement("p");
        email.textContent = "Email: " + request.email;

        const category = document.createElement("p");
        category.textContent = "Категория: " + request.category;

        const priority = document.createElement("p");
        priority.textContent = "Приоритет: " + request.priority;

        const description = document.createElement("p");
        description.textContent = "Описание: " + request.description;

        const date = document.createElement("p");
        date.textContent = "Создано: " + request.date;

        const status = document.createElement("p");
        status.textContent = "Статус: " + request.status;

        const doneButton = document.createElement("button");
        doneButton.textContent = "Выполнено";

        doneButton.addEventListener("click", function() {
            request.status = "Выполнено";
            applyFilter();
        });

        card.appendChild(title);
        card.appendChild(user);
        card.appendChild(room);
        card.appendChild(email);
        card.appendChild(category);
        card.appendChild(priority);
        card.appendChild(description);
        card.appendChild(date);
        card.appendChild(status);

        if (request.status === "Новая") {
            card.appendChild(doneButton);
        }

        requestsContainer.appendChild(card);
    });
}

searchButton.addEventListener("click", function() {
    applyFilter();
});

filter.addEventListener("change", function() {
    applyFilter();
});

function applyFilter() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filter.value;

    const result = requests.filter(function(request) {
        const matchesSearch =
            request.name.toLowerCase().includes(searchText) ||
            request.category.toLowerCase().includes(searchText) ||
            request.description.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "Все" ||
            request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    displayRequests(result);
}

// --- БЛОК АВТОРИЗАЦИИ И ЗАЩИТЫ АДМИН-ПАНЕЛИ ---

function checkAccess() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminBlock = document.getElementById('admin-block');
    const authBtn = document.getElementById('auth-btn');

    if (isAdmin) {
        if (adminBlock) adminBlock.style.display = 'block';
        if (authBtn) authBtn.innerText = 'Выйти (Админ)';
    } else {
        if (adminBlock) adminBlock.style.display = 'none';
        if (authBtn) authBtn.innerText = 'Войти как admin';
    }
}

function toggleAuth() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        localStorage.removeItem('isAdmin');
        alert('Вы вышли из режима администратора');
        checkAccess();
    } else {
        const password = prompt('Введите пароль администратора:');
        if (password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            alert('Доступ разрешен. Режим администратора активирован.');
            checkAccess();
        } else {
            alert('Неверный пароль!');
        }
    }
}

// Запуск проверки доступа при загрузке документа
document.addEventListener('DOMContentLoaded', checkAccess);
