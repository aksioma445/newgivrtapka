document.addEventListener("DOMContentLoaded", () => {
    const botToken = "6927435499:AAHtbYuUDk-6n8sl4XvS1X6vj4HUe43OUAQ";
    const chatId = "6927435499";

    const channels = [
        { name: "@cryptochampion07", link: "https://t.me/cryptochampion07" }
    ];

    const taskChannels = [
        { name: "@bonuschannel1", link: "https://t.me/bonuschannel1" },
        { name: "@bonuschannel2", link: "https://t.me/bonuschannel2" }
    ];

    // Отримуємо кнопки з нижнього меню
    const btnChannels = document.getElementById("btn-channels");
    const btnTasks = document.getElementById("btn-tasks");
    const btnRoulette = document.getElementById("btn-roulette");
    const btnReferral = document.getElementById("btn-referral");
    const btnSubscribed = document.getElementById("btn-subscribed");
    const btnReferralLink = document.getElementById("btn-referral-link");
    const spinBtn = document.getElementById("spin-btn");
    const spinCount = document.getElementById("spin-count");

    // Отримуємо екрани
    const screens = {
        main: document.getElementById("main-screen"),
        channels: document.getElementById("channels-screen"),
        tasks: document.getElementById("tasks-screen"),
        roulette: document.getElementById("roulette-screen"),
        referral: document.getElementById("referral-screen"),
    };

    let spins = parseInt(localStorage.getItem("spins")) || 0;
    let subscribed = localStorage.getItem("subscribed") === "true";
    let visitedChannels = new Set(JSON.parse(localStorage.getItem("visitedChannels")) || []);
    let subscribedOnce = localStorage.getItem("subscribedOnce") === "true";
    let completedTasks = new Set(JSON.parse(localStorage.getItem("completedTasks")) || []);

    updateSpinCount();
    checkSubscribedStatus();

    function showScreen(screenKey) {
        Object.values(screens).forEach(screen => screen.classList.add("hidden"));
        screens[screenKey].classList.remove("hidden");
    }

    function updateSpinCount() {
        spinCount.textContent = spins;
        localStorage.setItem("spins", spins);
    }

    function renderChannels() {
        const channelList = document.getElementById("channel-list");
        channelList.innerHTML = "";
        visitedChannels.clear();

        channels.forEach(channel => {
            let button = document.createElement("button");
            button.className = "channel-btn";
            button.textContent = `🔗 ${channel.name}`;
            button.onclick = () => {
                window.open(channel.link, "_blank");
                visitedChannels.add(channel.name);
                localStorage.setItem("visitedChannels", JSON.stringify([...visitedChannels]));
                checkSubscribedStatus();
            };
            channelList.appendChild(button);
        });

        btnSubscribed.classList.add("disabled");
        btnSubscribed.setAttribute("disabled", "true");
    }

    function renderTaskChannels() {
        const tasksList = document.getElementById("tasks-list");
        tasksList.innerHTML = "";

        taskChannels.forEach(channel => {
            let button = document.createElement("button");
            button.className = "task-btn";
            button.textContent = `🔗 ${channel.name}`;
            button.disabled = completedTasks.has(channel.name);

            button.onclick = () => {
                if (completedTasks.has(channel.name)) {
                    alert("⚠️ Ви вже отримали спін за цей канал!");
                    return;
                }

                window.open(channel.link, "_blank");
                completedTasks.add(channel.name);
                localStorage.setItem("completedTasks", JSON.stringify([...completedTasks]));
                
                spins += 1;
                updateSpinCount();
                button.disabled = true;
            };

            tasksList.appendChild(button);
        });
    }

    function checkSubscribedStatus() {
        if (subscribed) {
            btnSubscribed.classList.add("disabled");
            btnSubscribed.setAttribute("disabled", "true");
            [btnTasks, btnRoulette, btnReferral].forEach(btn => {
                btn.classList.remove("disabled");
                btn.removeAttribute("disabled");
            });
        } else if (visitedChannels.size === channels.length) {
            btnSubscribed.classList.remove("disabled");
            btnSubscribed.removeAttribute("disabled");
        }
    }

    // Події для нижнього меню (кнопки з іконками)
    btnChannels.addEventListener("click", () => {
        renderChannels();
        showScreen("channels");
    });

    btnTasks.addEventListener("click", () => {
        renderTaskChannels();
        showScreen("tasks");
    });

    btnRoulette.addEventListener("click", () => {
        showScreen("roulette");
    });

    btnReferral.addEventListener("click", () => {
        showScreen("referral");
    });

    btnSubscribed.addEventListener("click", () => {
        if (visitedChannels.size < channels.length) {
            alert("❌ Ви повинні відкрити всі канали перед підтвердженням підписки!");
            return;
        }
        if (subscribedOnce) {
            alert("⚠️ Ви вже отримали спін за підписку!");
            return;
        }

        alert("✅ Підписка підтверджена!");
        subscribed = true;
        subscribedOnce = true;
        localStorage.setItem("subscribed", "true");
        localStorage.setItem("subscribedOnce", "true");

        btnSubscribed.classList.add("disabled");
        btnSubscribed.setAttribute("disabled", "true");

        [btnTasks, btnRoulette, btnReferral].forEach(btn => {
            btn.classList.remove("disabled");
            btn.removeAttribute("disabled");
        });

        spins += 1;
        updateSpinCount();
        showScreen("main");
    });

    btnReferralLink.addEventListener("click", () => {
        let referralLink = "https://t.me/vipkibotik_bot?start=" + Math.random().toString(36).substring(7);
        navigator.clipboard.writeText(referralLink);
        alert("🔗 Ваше реферальне посилання скопійовано!");
        spins += 1;
        updateSpinCount();
    });

    spinBtn.addEventListener("click", () => {
        if (spins <= 0) {
            alert("❌ У вас немає спінів.");
            return;
        }
        spins--;
        updateSpinCount();

        let prizes = [
            { symbol: "🔹", chance: 99 },
            { symbol: "💰", chance: 1 },
        ];

        let random = Math.random() * 100;
        let total = 0;
        let result = "🔹";
        for (let prize of prizes) {
            total += prize.chance;
            if (random <= total) {
                result = prize.symbol;
                break;
            }
        }

        let cells = document.querySelectorAll(".cell");
        let index = 0;

        let interval = setInterval(() => {
            cells.forEach(cell => cell.classList.remove("highlight"));
            cells[index].classList.add("highlight");
            index = (index + 1) % cells.length;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            cells.forEach(cell => cell.classList.remove("highlight"));
            let winningCell = Math.floor(Math.random() * cells.length);
            cells[winningCell].textContent = result;
            alert(`🎉 Ви виграли: ${result}`);

            if (result === "💰") {
                let nickname = prompt("🎉 Ви виграли 💰! Введіть свій нікнейм:");
                if (nickname) {
                    sendWinMessage(nickname, result);
                }
            }
        }, 3000);
    });

    function sendWinMessage(nickname, prize) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=🎉 Користувач ${nickname} виграв ${prize}`)
            .then(() => alert("✅ Дані відправлено адміну!"));
    }
});
