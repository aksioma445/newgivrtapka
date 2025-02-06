document.addEventListener("DOMContentLoaded", async () => {
    const btnChannels = document.getElementById("btn-channels");
    const btnTasks = document.getElementById("btn-tasks");
    const btnRoulette = document.getElementById("btn-roulette");
    const btnReferral = document.getElementById("btn-referral");
    const btnCheckSubscription = document.getElementById("btn-check-subscription");
    const spinBtn = document.getElementById("spin-btn");

    const mainScreen = document.getElementById("main-screen");
    const channelsScreen = document.getElementById("channels-screen");
    const rouletteScreen = document.getElementById("roulette-screen");

    let user = window.Telegram.WebApp.initDataUnsafe.user;
    if (!user) {
        alert("Помилка отримання даних Telegram");
        return;
    }

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    btnChannels.addEventListener("click", () => showScreen(channelsScreen));

    btnCheckSubscription.addEventListener("click", async () => {
        let response = await fetch("https://botsfortg.pythonanywhere.com/check_subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id })
        });

        let data = await response.json();
        if (data.success) {
            alert("✅ Підписка підтверджена!");
            [btnTasks, btnRoulette, btnReferral].forEach(btn => {
                btn.classList.remove("disabled");
                btn.removeAttribute("disabled");
            });
            showScreen(mainScreen);
        } else {
            alert("❌ Ви не підписані на всі необхідні канали!");
        }
    });

    btnReferral.addEventListener("click", async () => {
        let response = await fetch("https://botsfortg.pythonanywhere.com/get_referral_link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id })
        });
        let data = await response.json();
        let refLink = data.referral_link;
        navigator.clipboard.writeText(refLink);
        alert("🔗 Ваше реферальне посилання скопійовано!");
    });

    spinBtn.addEventListener("click", async () => {
        let usersResponse = await fetch("https://botsfortg.pythonanywhere.com/add_referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id })
        });

        let usersData = await usersResponse.json();
        let spins = usersData.spins || 1;

        if (spins > 0) {
            const prizes = ["🎁", "💰", "🎟", "💎", "⚡", "🔮"];
            document.querySelectorAll(".cell").forEach((cell, index) => {
                if (index !== 4) {
                    cell.textContent = prizes[Math.floor(Math.random() * prizes.length)];
                }
            });

            let wonPrize = document.querySelectorAll(".cell")[Math.floor(Math.random() * 8)].textContent;
            if (["🎁", "💰", "💎"].includes(wonPrize)) {
                let nickname = prompt("🎉 Ви виграли " + wonPrize + "! Введіть свій нікнейм:");
                if (nickname) {
                    await fetch("https://botsfortg.pythonanywhere.com/win_prize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_id: user.id, prize: wonPrize, username: nickname })
                    });
                    alert("✅ Дані відправлено адміну!");
                }
            }
        } else {
            alert("❌ У вас немає спінів. Запросіть друга, щоб отримати додатковий прокрут!");
        }
    });
});
