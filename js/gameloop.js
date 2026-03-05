document.addEventListener("DOMContentLoaded", () => {
    let in_loop = false;

    const start_button = document.querySelector("header div button");
    const timer_element = document.querySelector("section.timer p");
    const main_element = document.querySelector("main");

    if (start_button) {
        start_button.addEventListener("click", start_timer);
    }

    function start_timer() {
        let timer = 60;
        in_loop = true;

        // Show main content and hide the start button
        start_button.style.display = "none";
        main_element.style.display = "grid";

        const intervalId = window.setInterval(function() {
            if (timer > 0) {
                timer--;
                timer_element.innerText = timer; // Update the timer display
            } else {
                clearInterval(intervalId);
                in_loop = false;
                
                // Restore the original state once the timer ends
                start_button.style.display = "grid";
                main_element.style.display = "none";
            }
        }, 1000);
    }

    do{

    }while(in_loop)
});
