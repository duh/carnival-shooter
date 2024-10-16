console.log("Menu script loaded.");

const playButton1 = document.getElementById("playButton1");
const playButton2 = document.getElementById("playButton2");
const leaderboardButton = document.getElementById("leaderboardButton");

playButton1.addEventListener("click", () => {
    window.location.href = "level1.html"
})

playButton2.addEventListener("click", () => {
    window.location.href = "level2.html"
})

leaderboardButton.addEventListener("click", () => {
    window.location.href = "leaderboard.html"
})