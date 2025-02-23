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

    const btnChannels = document.getElementById("btn-channels");
    const btnTasks = document.getElementById("btn-tasks");
    const btnRoulette = document.getElementById("btn-roulette");
    const btnReferral = document.getElementById("btn-referral");
    const btnSubscribed = document.getElementById("btn-subscribed");
    const btnReferralLink = document.getElementById("btn-referral-link");
    const spinBtn = document.getElementById("spin-btn");
    const spinCount = document.getElementById("spin-count");

    const channelsScreen = document.getElementById("channels-screen");
    const tasksScreen = document.getElementById("tasks-screen");
    const rouletteScreen = document.getElementById("roulette-screen");
    const referralScreen = document.getElementById("referral-screen");
    const mainScreen = document.getElementById("main-screen");

    let spins = parseInt(localStorage.getItem("spins")) || 0;
    let subscribed = localStorage.getItem("subscribed") === "true";
    let visitedChannels = new Set(JSON.parse(localStorage.getItem("visitedChannels")) || []);
    let subscribedOnce = localStorage.getItem("subscribedOnce") === "true";
    let completedTasks = new Set(JSON.parse(localStorage.getItem("completedTasks")) || []);

    updateSpinCount();
    checkSubscribedStatus();

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    function updateSpinCount() {
        spinCount.textContent = spins;
        localStorage.setItem("spins", spins);
    }

    function renderChannels() {
        const channelList = document.getElementById("channel-list");
        channelList.innerHTML = "";

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

        btnSubscribed.classList.add("disabled");
        btnSubscribed.setAttribute("disabled", "true");
    }

    function renderTaskChannels() {
        const tasksList = document.getElementById("tasks-list");
        tasksList.innerHTML = "";

        taskChannels.forEach(channel => {
            let channelDiv = document.createElement("div");
            channelDiv.className = "channel-btn";
            channelDiv.onclick = () => {
                if (completedTasks.has(channel.name)) {
                    alert("⚠️ Ви вже отримали спін за цей канал!");
                    return;
                }
                window.open(channel.link, "_blank");
                completedTasks.add(channel.name);
                localStorage.setItem("completedTasks", JSON.stringify([...completedTasks]));

                spins += 1;
                updateSpinCount();
                channelDiv.classList.add("disabled");
            };

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

    btnChannels.addEventListener("click", () => {
        renderChannels();
        showScreen(channelsScreen);
    });

    btnTasks.addEventListener("click", () => {
        renderTaskChannels();
        showScreen(tasksScreen);
    });

    btnRoulette.addEventListener("click", () => {
        showScreen(rouletteScreen);
    });

    btnReferral.addEventListener("click", () => {
        showScreen(referralScreen);
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
        showScreen(mainScreen);
    });

    btnReferralLink.addEventListener("click", () => {
        let referralLink = `https://t.me/vipkibotik_bot?start=${Date.now()}`;
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
            { symbol: "💰", chance: 1 }
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
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: `🎉 Користувач ${nickname} виграв ${prize}` })
        }).then(() => alert("✅ Дані відправлено адміну!"));
    }
});
