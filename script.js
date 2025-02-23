document.addEventListener("DOMContentLoaded", () => {
    const botToken = "6927435499:AAHtbYuUDk-6n8sl4XvS1X6vj4HUe43OUAQ";
    const chatId = "6927435499";

    const channels = [
        { name: "@cryptochampion07", link: "https://t.me/cryptochampion07", img: "channel1.jpg" }
    ];

    const taskChannels = [
        { name: "@bonuschannel1", link: "https://t.me/bonuschannel1", img: "channel2.jpg" },
        { name: "@bonuschannel2", link: "https://t.me/bonuschannel2", img: "channel3.jpg" }
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
        if (!channelList) return;
        channelList.innerHTML = "";
        visitedChannels.clear();

        channels.forEach(channel => {
            let channelDiv = document.createElement("div");
            channelDiv.className = "channel-btn";
            channelDiv.onclick = () => window.open(channel.link, "_blank");

            let img = document.createElement("img");
            img.src = channel.img;
            img.alt = channel.name;

            channelDiv.appendChild(img);
            channelList.appendChild(channelDiv);
        });
    }

    function renderTaskChannels() {
        const tasksList = document.getElementById("tasks-list");
        if (!tasksList) return;
        tasksList.innerHTML = "";

        taskChannels.forEach(channel => {
            let channelDiv = document.createElement("div");
            channelDiv.className = "channel-btn";
            channelDiv.onclick = () => window.open(channel.link, "_blank");

            let img = document.createElement("img");
            img.src = channel.img;
            img.alt = channel.name;

            channelDiv.appendChild(img);
            tasksList.appendChild(channelDiv);
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
    if (btnChannels) {
        btnChannels.addEventListener("click", () => {
            renderChannels();
            showScreen("channels");
        });
    }

    if (btnTasks) {
        btnTasks.addEventListener("click", () => {
            renderTaskChannels();
            showScreen("tasks");
        });
    }

    if (btnRoulette) {
        btnRoulette.addEventListener("click", () => {
            showScreen("roulette");
        });
    }

    if (btnReferral) {
        btnReferral.addEventListener("click", () => {
            showScreen("referral");
        });
    }

    if (btnSubscribed) {
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
    }

    if (btnReferralLink) {
        btnReferralLink.addEventListener("click", () => {
            let referralLink = `https://t.me/vipkibotik_bot?start=${Date.now()}`;
            navigator.clipboard.writeText(referralLink);
            alert("🔗 Ваше реферальне посилання скопійовано!");
            spins += 1;
            updateSpinCount();
        });
    }
});
