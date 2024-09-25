

let friendId = null, userId = null, ratingStart = 800, ratingEnd = 3500;


async function fetchUserSubmissions(username) {
   const apiurl = `https://codeforces.com/api/user.status?handle=${username}`;
   return fetch(apiurl)
      .then((response) => {
         if (!response.ok) {
            return Promise.reject(`Https error status code: ${response.status}`);
         }
         return response.json();
      })
      .then((data) => {
         if (data.status === "OK") {
            return data.result;
         }
         else {
            return Promise.reject(`Data parsing error: ${data.comment}`);
         }
      })
}

function filterSubs(friendSubs, userSubs) {
   let userSubsSet = new Set();
   // console.log(typeof userSubs);
   // console.log(userSubs);
   // return;

   userSubs.forEach((sub) => {
      // console.log(typeof sub.rating);
      if (sub.verdict === "OK" && sub.problem.rating >= ratingStart && sub.problem.rating <= ratingEnd) {
         userSubsSet.add(JSON.stringify(sub.problem));
      }
   });

   // console.log(userSubsSet);
   let problems = new Set();
   friendSubs.forEach((sub) => {
      if (sub.verdict === "OK" && sub.problem.rating >= ratingStart && sub.problem.rating <= ratingEnd
         && !userSubsSet.has(JSON.stringify(sub.problem))) problems.add(JSON.stringify(sub.problem));
   })
   //console.log(problems);

   let prob = [];
   problems.forEach((p) => {
      prob.push(JSON.parse(p));
   });
   return prob;
   // console.log(prob);
}


function validateInput() {
   if (friendId.trim() === "" || userId.trim() === "") return false;
   if (ratingStart > ratingEnd || ratingEnd > 3500 || ratingStart < 800) return false;
   return true;
}

function DisplayProblemsList(problems) {
   // Check the type of contestId (it should be a number)
   console.log(typeof problems[0].contestId);

   // Sort problems by contestId in descending order
   problems.sort((a, b) => b.contestId - a.contestId);

   console.log(problems);
   const tableBody = document.getElementById("tableBody");

   // Clear the existing table rows if any
   tableBody.innerHTML = '';

   // Loop through the sorted problems array and display in table
   problems.forEach((prob) => {
      const probRow = document.createElement("tr");

      // link
      const linkCell = document.createElement("td");
      const link = document.createElement("a");

      // Set the href to the actual problem link
      link.href = `https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`;
      link.target = "_blank"; // Open in a new tab
      link.innerHTML = `${prob.contestId}${prob.index}`;

      linkCell.appendChild(link);
      probRow.appendChild(linkCell);

      // name 
      const name = document.createElement("td");
      name.innerHTML = `${prob.name}`;
      probRow.appendChild(name);

      // rating
      const rating = document.createElement("td");
      rating.innerHTML = `${prob.rating}`;
      probRow.appendChild(rating);

      tableBody.appendChild(probRow);
   });
}


const goButton = document.getElementById("gobutton");

goButton.addEventListener("click", async () => {
   console.log("Button clicked");
   // return;
   friendId = document.getElementById("firstuser").value;
   userId = document.getElementById("seconduser").value;
   ratingStart = document.getElementById("ratingStart").value;
   ratingEnd = document.getElementById("ratingEnd").value;

   const isInputsValid = validateInput();
   if (isInputsValid === false) {
      console.log("Wrong Input");
      return;
   }
   const friendSubs = await fetchUserSubmissions(friendId);
   const userSubs = await fetchUserSubmissions(userId);
   const problems = filterSubs(friendSubs, userSubs);
   DisplayProblemsList(problems);

});