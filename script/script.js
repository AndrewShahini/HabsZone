//Standings
$(document).ready(function () {

    async function fetchStandings(division) {
        try {
            const response = await fetch(`standings.json`);
            if (!response.ok) {
                throw new Error("Failed to fetch standings");
            }
            const data = await response.json();

            console.log(data);

            let teams = [];

            if (data && data.standings) {
                teams = data.standings.filter(team => team.divisionName === division);
            } else {
                throw new Error("No standings data found");
            }

            const standingsHtml = teams.map((team) => {
                const { teamLogo, teamAbbrev, divisionSequence, wins, losses, otLosses, points, teamName } = team;
                const logo = teamLogo 
                const position = divisionSequence;

                return `
                    <div class="team">
                        <div>
                            <strong>${position}. <img src="${logo}" alt="${teamName.default}"></strong><br>
                            ${teamName.default}<br>
                            Wins: ${wins}, Losses: ${losses}, OT Losses: ${otLosses}, Points: ${points}
                        </div>
                    </div>`;
            }).join("");

            $("#standingsDialog").html(standingsHtml).dialog("open");

        } catch (error) {
            console.error("Error fetching standings:", error);
            alert("Failed to fetch standings. Please check the console for details.");
        }
    }

    $("#divisions button").on("click", function () {
        const division = $(this).data("division");
        fetchStandings(division);
    });

    $("#standingsDialog").dialog({
        autoOpen: false,
        width: 800,
        modal: true
    });
});

//Contact Us
function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    alert("Your question has been successfully submitted!");

    document.getElementById("contact-form").reset();
}

//Fanzone
$(document).ready(function () {
    var comments = JSON.parse(localStorage.getItem('comments')) || [];

    function displayComments() {
        const commentSection = $('#comments-section');
        commentSection.empty();

        comments.forEach(function (comment) {
            const commentHtml = `
                <div class="comment">
                    <strong>${comment.username}</strong>: ${comment.message}
                </div>
            `;
            commentSection.append(commentHtml);
        });
    }

    function saveCommentsToLocalStorage() {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function fetchComments() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(comments);
            }, 500);
        });
    }

    $('#comment-form').on('submit', async function (e) {
        e.preventDefault();

        const username = $('#username').val().trim();
        const message = $('#comment-input').val().trim();

        if (username && message) {
            setTimeout(() => {
                comments.push({ username: username, message: message });
                saveCommentsToLocalStorage();
                displayComments(); 

                $('#username').val('');
                $('#comment-input').val('');

                alert('Your comment has been posted!');
            }, 500);
        } else {
            alert('Please enter both username and message.');
        }
    });

    (async function initializeComments() {
        comments = await fetchComments(); 
        displayComments(); 
    })();
});