document.addEventListener("DOMContentLoaded", () => {
    let in_loop = false;

    let som = "";
    let som_ans ="";
    let user_ans = "";
    let user_score = 0;
    let user_streak = 0;
    let user_highest_streak = 0;
    let user_unscore = 0;
    let rocketPosition = 0;
    const MAX_ROCKET_POSITION = -200; // Maximum upward movement
    const MIN_ROCKET_POSITION = 0; // Minimum position (at the bottom)



    const start_button = document.querySelector("button");
    const timer_element = document.querySelector("section.timer p");
    const main_element = document.querySelector("main");
    const som_element = document.querySelector("section div.som p");
    const ans_elements = document.querySelectorAll("li");
    const streak_element = document.querySelector("section.streak p");
    const rocket_img = document.querySelector(".raket img");
    const scoreboard_element = document.querySelector(".scoreboard_div");
    const scoreboard_paragraph_elements = document.querySelectorAll(".scoreboard_div p");
    const retry_button = document.querySelector("div button");


    function get_input() {
        ans_elements.forEach((element) => {
            // Remove existing event listener to prevent stacking
            element.removeEventListener("click", handle_answer_click);
            element.addEventListener("click", handle_answer_click);
        });
    }

    function handle_answer_click() {
        process_click(this);
    }

    if (start_button) {
        start_button.addEventListener("click", start_timer);
    }
    
    if (retry_button) {
        retry_button.addEventListener("click", start_timer);
    }

    function start_timer() {
        // Reset game state
        user_score = 0;
        user_streak = 0;
        user_highest_streak = 0;
        user_unscore = 0;
        rocketPosition = 0; 
        let timer = 10;
        timer_element.innerText = timer; // Reset timer display

        in_loop = true;
        refresh_game();

        // Show main content and hide the start button
        scoreboard_element.style.display = "none";
        main_element.style.display = "grid";

        const timer_func = window.setInterval(function() {
            if (timer > 0) {
                timer--;
                timer_element.innerText = timer; // Update the timer display
            } else {
                clearInterval(timer_func);
                in_loop = false;

                // Restore the original state once the timer ends
                update_scoreboard();
                scoreboard_element.style.display = "block";
                main_element.style.display = "none";
            }
        }, 1000);
    }

    function refresh_game(){
        new_equation();
        display_ans();
        get_input();
    }

    function process_click(element) {
        user_ans = element.innerText;
        console.log("User answer:", user_ans);
        console.log("Correct answer:", som_ans);

        // Disable buttons to prevent additional clicks
        ans_elements.forEach(ans => ans.style.pointerEvents = 'none');

        if (parseInt(user_ans) === som_ans) {
            user_score++;
            user_streak++;
            if (user_highest_streak<user_streak){
                user_highest_streak = user_streak;
            }
            streak_element.innerText = "🔥 Streak: " + user_streak;

            // Move the rocket up for correct answer
            moveRocketUp();
        } else {
            user_unscore++;
            user_streak = 0;
            streak_element.innerText = "🔥 Streak: 0";

            // Move the rocket down for incorrect answer
            moveRocketDown();
        }

        // Add a brief delay before refreshing the game to show feedback
        setTimeout(() => {
            refresh_game();
            // Re-enable buttons after refreshing
            ans_elements.forEach(ans => ans.style.pointerEvents = 'auto');
        }, 500);
    }



    function new_equation() {
        som = `${get_rnd_int(1, 10+user_streak)} ${get_operator()} ${get_rnd_int(1, 10+user_streak)}`;
        som_ans = eval(som); // Can be a security risk; ensure inputs are sanitized if needed
        console.log("Generated equation:", som);
        console.log("Calculated answer:", som_ans);
        som_element.innerText = som;
    }


    function display_ans(){
        for (let i = 0;i<4;i++){
            ans_elements[i].innerText = som_ans+get_rnd_int(-10,10,0);
        }
        ans_elements[get_rnd_int(0,3)].innerText = som_ans;
    }

    function update_scoreboard(){
        scoreboard_paragraph_elements[0].innerText = `Final score: ${user_score}`;
        scoreboard_paragraph_elements[1].innerText = `Highest streak: ${user_highest_streak}`;
        scoreboard_paragraph_elements[2].innerText = `Current streak: ${user_streak}`;
        scoreboard_paragraph_elements[3].innerText = `Wrong answers: ${user_unscore}`;
    }


    function moveRocketUp() {
        if (rocketPosition > MAX_ROCKET_POSITION) {
            let targetPos = rocketPosition - 20; // Target position to move up
            const id = setInterval(() => {
                if (rocketPosition <= targetPos || rocketPosition <= MAX_ROCKET_POSITION) {
                    clearInterval(id);
                    rocketPosition = Math.max(rocketPosition, MAX_ROCKET_POSITION); // Ensure it doesn't exceed max
                } else {
                    rocketPosition--; // Move up
                    rocket_img.style.transform = `translateY(${rocketPosition}px)`; // Adjust position
                }
            }, 5);
        }
    }


    function moveRocketDown() {
        if (rocketPosition < MIN_ROCKET_POSITION) {
            let targetPos = rocketPosition + 20; // Target position to move down
            const id = setInterval(() => {
                if (rocketPosition >= targetPos || rocketPosition >= MIN_ROCKET_POSITION) {
                    clearInterval(id);
                    rocketPosition = Math.min(rocketPosition, MIN_ROCKET_POSITION); // Ensure it doesn't go below min
                } else {
                    rocketPosition++; // Move down
                    rocket_img.style.transform = `translateY(${rocketPosition}px)`; // Adjust position
                }
            }, 5);
        }
    }


    function get_rnd_int(min, max, cannot_be = null) {
        let returnvalue;
        do {
            returnvalue = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (returnvalue === cannot_be);
        return returnvalue;
}



    function get_operator() {
        switch (get_rnd_int(0, 2)) {
            case 0:
                return "*";
            case 1:
                return "+";
            case 2:
                return "-";
            default:
                return ""; // My code does not fail, so this is bloat
        }
    }

});
