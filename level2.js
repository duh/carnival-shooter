console.log("Level 2 script loaded.");

let score = 0;
let timeLeft = 60;
let clicks = 0, hits = 0; // World clicks and successful target hits, used to determine accuracy at the end of the game.
const scoreLabel = document.getElementById("score");
const highScoreLabel = document.getElementById("highScore");
const gameWorld = document.getElementById("world");
const timer = document.getElementById("timeLeft");
const currentDate = new Date();

const randomBetween = function (min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}

gameWorld.addEventListener("click", () => {
    if (timeLeft > 0) clicks++;
});

// Add water:
const waterLine = document.createElement("img");
waterLine.src = "media/water.png";
waterLine.className = "water";
gameWorld.appendChild(waterLine);

const animWater = waterLine.animate(
    [
        {
            transform: "translateY(0px)"
        },
        {
            transform: "translateY(8px)"
        },
        {
            transform: "translateY(0px)"
        }
    ],
    {
        duration: 2000,
        easing: "linear",
        iterations: Infinity
    })
// Reset score:
localStorage.setItem("l2Score", 0)

// target spawning method
const spawnTarget = function () {
    let isEnemy = Math.random() > 0.75; // 25% chance of enemy target spawning, which causes user to lose points on click
    let size = Math.random() > 0.75 ? "smalltarget" : "largetarget" // 25% chance of a smaller target spawning

    const target = document.createElement("div");
    target.className = isEnemy ? `enemydartboard ${size}` : `dartboard ${size}`; // Set up appropriate target (size and behaviour)
    target.title = "Target"; // Equivalent to alt text for a div
    target.style.bottom = `${randomBetween(20, 62)}%`; // Set y level randomly - wider range than level 1 to increase challenge
    gameWorld.appendChild(target);
    const spawnedTime = performance.now(); // Save the time the target was spawned at.

    //Animation for movement
    let animationDuration = randomBetween(2500, 5000); // Time the target spends on screen
    let animationDirection = Math.random() > 0.5 ? "normal" : "reverse"; // Pick random direction!
    let animationEasing = Math.random() > 0.8 ? "ease-out" : "linear"; // Chance of "ease out", making target slide into screen very fast.

    console.log(animationEasing);
    const keyframes = [
        { left: "-200px", top: randomBetween(0, window.innerHeight - 100) + "px" },
        { left: "100%", top: randomBetween(0, window.innerHeight - 100) + "px" }
    ];

    const targetAnim = target.animate(
        keyframes,
        {
            duration: animationDuration,
            direction: animationDirection,
            easing: animationEasing
        }
    );

    targetAnim.finished.then(() => target.remove()); // Remove target from screen if not clicked by end of animation, to avoid clutter.


    // Click event:
    target.addEventListener("click", () => {
        if (timeLeft > 0) {
            if (isEnemy) {
                score = Math.max(0, score - 3); // Reduce score by 3 points for hitting an enemy target, but ensure score doesn't go below 0
            } else {
                hits++; // Increment amount of successful hits
                // Reward user with points based on how quickly they reacted:
                const progressReactedAt = (performance.now() - spawnedTime) / animationDuration; // Calculate a number 0-1 for how far the animation got before clicking
                if (progressReactedAt <= 0.33) {
                    score += 3;
                }
                else if (progressReactedAt <= 0.66) {
                    score += 2;
                }
                else if (progressReactedAt <= 1) {
                    score += 1;
                }
            }
            scoreLabel.textContent = score;

            // ----------------------------

            const targetDespawnAnim = target.animate(
                [
                    {
                        transform: "scale(1)"
                    },
                    {
                        transform: "scale(1.1)"
                    },
                    {
                        transform: "scale(0)"
                    }
                ],
                {
                    duration: 200
                })

            targetDespawnAnim.finished.then(() => target.remove());
        }
    },

        {
            once: true // Event listener should only fire once so target can not be repeatedly clicked.
        }
    );
}



// Set up local storage:
if (localStorage.getItem("l2HighScore") == undefined) {
    // Only set up high score storage if there isn't already a high score!
    localStorage.setItem("l2HighScore", 0);
}
highScoreLabel.innerText = localStorage.getItem("l2HighScore");


const spawnRate = randomBetween(1100, 1600); // Select a spawn rate in ms
console.log(`The spawn rate for this game is ${spawnRate}ms.`)
const spawnLoop = setInterval(spawnTarget, spawnRate);

// Decrease timer each second:
const countdown = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;

    if (timeLeft > 40) {
        timer.style.color = "green";
    }
    else if (timeLeft > 20) {
        timer.style.color = "goldenrod";
    }
    else if (timeLeft > 10) {
        timer.style.color = "chocolate";
    }
    else {
        timer.style.color = "red";
    }


    if (timeLeft == 0) {
        clearInterval(countdown); // Stop countdown when it hits 0
        clearInterval(spawnLoop); // Stop spawning when timer hits 0
        document.getElementById('end-game-form').style.display = 'block';  // Display the end game form
        if (score > localStorage.getItem("l2HighScore")) { // Check if high score was beat
            localStorage.setItem("l2HighScore", score);
            highScoreLabel.textContent = localStorage.getItem("l2HighScore");

        }
    }
}, 1000);


// Function to handle form submission
console.log("Name submission loaded")
document.getElementById('score-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get player name from the form
    var playerName = document.getElementById('player-name').value;

    const dateString = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    // ⬆ 1 is added to month because months are zero-indexed


    // Create an object to store player name, score, date of game and accuracy
    var playerData = {
        name: playerName,
        score: score,
        date: dateString,
        accuracy: clicks == 0 ? 0 : Math.round((hits / clicks) * 1000) / 10 // Gives a percentage (0-100) to 1 decimal place, or sets to 0 if nothing was ever clicked (to avoid dividing by 0)
    };

    // Get existing player data array from localstorage or create a new one if it doesn't exist
    var playerDataArray = JSON.parse(localStorage.getItem('playerDataArrayLevel2')) || [];

    // Add the new player data to the array
    playerDataArray.push(playerData);
    // Store the updated player data array back to local storage
    localStorage.setItem('playerDataArrayLevel2', JSON.stringify(playerDataArray));

    // Redirect to the leaderboard page
    window.location.replace("leaderboard.html");
});

