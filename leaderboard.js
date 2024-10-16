console.log("Leaderboard script loaded.");

document.getElementById("homeButton").addEventListener("click", function() {
    window.location.href = "index.html"; // Navigate to the home page
});

document.addEventListener("DOMContentLoaded", function () {
    //Retrieve data from localStorage
    let playerDataArrayLevel1 = JSON.parse(localStorage.getItem("playerDataArrayLevel1")) || [];
    let playerDataArrayLevel2 = JSON.parse(localStorage.getItem("playerDataArrayLevel2")) || [];

    //Sort data in the array based on user scores
    playerDataArrayLevel1.sort((a, b) => b.score - a.score);
    playerDataArrayLevel2.sort((a, b) => b.score - a.score);

    //Function to generate data for the leaderboard using HTML 
    function generateEasyLeaderboard() {
        let easyLeaderboard = document.getElementById("easyLeaderboard");

        playerDataArrayLevel1.forEach((player, index) => {
            const row = `<tr>
                          <td>${index + 1}</td>
                          <td>${player.name}</td>
                          <td>${player.score}</td>
                          <td>${player.date}</td>
                          <td>${player.accuracy}%</td>
                        </tr>`;
            easyLeaderboard.insertAdjacentHTML('beforeend', row);
        });
    };

    function generateHardLeaderboard() {
        let hardLeaderboard = document.getElementById("hardLeaderboard");

        playerDataArrayLevel2.forEach((player, index) => {
            const row = `<tr>
                        <td>${index + 1}</td>
                        <td>${player.name}</td>
                        <td>${player.score}</td>
                        <td>${player.date}</td>
                        <td>${player.accuracy}%</td>
                        </tr>`;
            hardLeaderboard.insertAdjacentHTML('beforeend', row);
        });
    };


        //Initial leaderboard generation
        generateEasyLeaderboard();
        generateHardLeaderboard();

        //Function to update leaderboard
        function updateLeaderboard() {
            //Retrieve latest data from localStorage
            playerDataArrayLevel1 = JSON.parse(localStorage.getItem("playerDataArrayLevel1")) || [];
            playerDataArrayLevel2 = JSON.parse(localStorage.getItem("playerDataArrayLevel2")) || [];
            //Sort data based on scores
            playerDataArrayLevel1.sort((a, b) => b.score - a.score);
            playerDataArrayLevel2.sort((a, b) => b.score - a.score);
            //Generate and display updated leaderboard
            generateEasyLeaderboard();
            generateHardLeaderboard();
        }

        //Update leaderboard whenever there's a change in the scores
        window.addEventListener("storage", updateLeaderboard);

        //If no player data found, display a message
        if (playerDataArrayLevel1.length === 0 && playerDataArrayLevel2.length === 0) {
            let leaderboardElement = document.getElementById("leaderboard");
            leaderboardElement.innerHTML = "<p>No player data available</p>";
        }

    });


