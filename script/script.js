/*
$(document).ready(function () {

    // Function to fetch and display standings
    async function fetchStandings(division) {
        try {
            const response = await fetch(`standings.json`);
            if (!response.ok) {
                throw new Error("Failed to fetch standings");
            }
            const data = await response.json();
            const logo = data.teamLogo;
            const abbreviation = data.teamAbbrev.default;
            const position = data.divisionSequence;
            const wins = data.wins;
            const loses = data.loses;
            const otlosses = data.otLosses
            const points = data.points;

    
            if (!data.records || !Array.isArray(data.records)) {
                throw new Error("Invalid data format: 'records' is missing or not an array");
            }
    
            let teams = [];
            const record = data.records.find(record => record.divisionName == division);
            if (record) {
                teams = record.teamRecords;
            } else {
                throw new Error(`Division '${division}' not found in the data`);
            }
            
    
            // Build the standings table
            const standingsHtml = teams.map((team, index) => {
                const { team: teamInfo, leagueRank, wins, losses, ot } = team;
               return `
                    <div class="team">
                        <img src="${logo}" alt="${name}">
                        <div>
                            <strong>${leagueRank}. ${abbreviation}</strong><br>
                            Wins: ${wins}, Losses: ${losses}, OT: ${ot}
                        </div>
                    </div>`;
            }).join("");
    
            // Populate and open the dialog
            $("#standingsDialog").html(standingsHtml).dialog("open");
        } catch (error) {
            console.error("Error fetching standings:", error);
            alert("Failed to fetch standings. Please check the console for details.");
        }
    }
});
*/

$(document).ready(function () {

    // Function to fetch and display standings
    async function fetchStandings(division) {
        try {
            const response = await fetch(`standings.json`);
            if (!response.ok) {
                throw new Error("Failed to fetch standings");
            }
            const data = await response.json();

            console.log(data); // Log the full data to inspect the structure

            let teams = [];

            // Loop through the standings to find the division or entire league
            if (data && data.standings) {
                teams = data.standings.filter(team => team.divisionName === division);
            } else {
                throw new Error("No standings data found");
            }

            // Build the standings table
            const standingsHtml = teams.map((team, index) => {
                const { teamLogo, teamAbbrev, divisionSequence, wins, losses, otLosses, points, teamName } = team;
                const logo = teamLogo || "default-logo.png"; // Use default logo if no logo is available
                const position = divisionSequence || "N/A"; // Default to N/A if no position is available

                return `
                    <div class="team">
                        <div>
                            <strong>${position}. <img src="${logo}" alt="${teamName.default}"></strong><br>
                            ${teamName.default}<br>
                            Wins: ${wins}, Losses: ${losses}, OT Losses: ${otLosses}, Points: ${points}
                        </div>
                    </div>`;
            }).join("");

            // Populate and open the dialog
            $("#standingsDialog").html(standingsHtml).dialog("open");

        } catch (error) {
            console.error("Error fetching standings:", error);
            alert("Failed to fetch standings. Please check the console for details.");
        }
    }

    // Attach click event listeners to division buttons
    $("#divisions button").on("click", function () {
        const division = $(this).data("division");
        fetchStandings(division);
    });

    // Initialize jQuery UI dialog
    $("#standingsDialog").dialog({
        autoOpen: false,
        width: 600,
        modal: true
    });

});