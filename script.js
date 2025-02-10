document.addEventListener("DOMContentLoaded", async () => {
    const botToken = "6927435499:AAHtbYuUDk-6n8sl4XvS1X6vj4HUe43OUAQ";
    const chatId = "6927435499"; 

    const channels = [
        { name: "@cryptochampion07", link: "https://t.me/cryptochampion07" }
    ];

    const taskChannels = [
        { name: "@bonuschannel1", link: "https://t.me/bonuschannel1" },
        { name: "@bonuschannel2", link: "https://t.me/bonuschannel2" }
    ];

    const btnChannels = document.getElementById("btn-channels");
    const btnTasks = document.getElementById("btn-tasks");
    const btnRoulette = document.getElementById("btn-roulette");
    const btnReferral = document.getElementById("btn-referral");
    const btnSubscribed = document.getElementById("btn-subscribed");
    const btnReferralLink = document.getElementById("btn-referral-link");
    const spinBtn = document.getElementById("spin-btn");
    const spinCount = document.getElementById("spin-count");

    const mainScreen = document.getElementById("main-screen");
    const channelsScreen = document.getElementById("channels-screen");
    const tasksScreen = document.getElementById("tasks-screen");
    const rouletteScreen = document.getElementById("roulette-screen");
    const referralScreen = document.getElementById("referral-screen");

    let spins = 0;
    let visitedChannels = new Set();
    updateSpinCount();

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    function updateSpinCount() {
        spinCount.textContent = spins;
    }

    function sendWinMessage(nickname, prize) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=🎉 Користувач ${nickname} виграв ${prize}`)
            .then(() => alert("✅ Дані відправлено адміну!"));
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
                checkSubscribedStatus();
            };
            channelList.appendChild(button);
        });
    }

    function renderTaskChannels() {
        const tasksList = document.getElementById("tasks-list");
        tasksList.innerHTML = "";
        taskChannels.forEach(channel => {
            let button = document.createElement("button");
            button.className = "task-btn";
            button.textContent = `🔗 ${channel.name}`;
            button.onclick = () => {
                window.open(channel.link, "_blank");
                spins += 1;
                updateSpinCount();
            };
            tasksList.appendChild(button);
        });
    }

    function checkSubscribedStatus() {
        if (visitedChannels.size === channels.length) {
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

    btnReferral.addEventListener("click", () => showScreen(referralScreen));
    btnRoulette.addEventListener("click", () => showScreen(rouletteScreen));

    btnSubscribed.addEventListener("click", () => {
        alert("✅ Підписка підтверджена!");
        [btnTasks, btnRoulette, btnReferral].forEach(btn => {
            btn.classList.remove("disabled");
            btn.removeAttribute("disabled");
        });
        spins += 1;
        updateSpinCount();
        showScreen(mainScreen);
    });

    btnReferralLink.addEventListener("click", () => {
        let referralLink = "https://t.me/mybot?start=" + Math.random().toString(36).substring(7);
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
});
