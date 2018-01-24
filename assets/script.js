$(document).ready(() => {
const config = {
    apiKey: "AIzaSyDfzgO8IB3kX5vhJzDNtXrp99NnJkzKuIA",
    authDomain: "hw-train-time.firebaseapp.com",
    databaseURL: "https://hw-train-time.firebaseio.com",
    projectId: "hw-train-time",
    storageBucket: "hw-train-time.appspot.com",
    messagingSenderId: "650282119332"
};
firebase.initializeApp(config);
const database = firebase.database().ref("train-management");

    database.on("child_added", snapshot => {
        const obj = snapshot.val();
        const currentTimeOnLoad = moment();
        const firstTrainStartOnLoad = moment(obj.firstTrain, "LT")
        const diffTimeOnLoad = currentTimeOnLoad.diff(moment(firstTrainStartOnLoad), "minutes");
        const remainingTimeOnLoad = diffTimeOnLoad % obj.trainFrequency;
        let minutesAwayOnLoad = obj.trainFrequency - remainingTimeOnLoad;
        const nextArrivalOnLoad = moment().add(minutesAwayOnLoad, "minutes");
        const nextArrivalCorrectedOnLoad = moment(nextArrivalOnLoad).format("LT");
        $("tbody").append(`<tr class="click-delete">
    <td class="remove">${obj.name}</td>
    <td class="remove">${obj.destination}</td>
    <td class="remove">${obj.trainFrequency}</td>
    <td class="remove">${nextArrivalCorrectedOnLoad}</td>
    <td class="remove">${minutesAwayOnLoad}</td>
    </tr>`);
    });

    $("#add-train").click(event => {
        event.preventDefault();
        const name = $("#name").val().trim();
        const destination = $("#dest").val().trim();
        const firstTrain = $("#first-train").val().trim();
        const trainFrequency = $("#frequency").val().trim();
        const currentTime = moment();
        const firstTrainStart = moment(firstTrain, "LT").subtract(1, "years");
        const diffTime = currentTime.diff(moment(firstTrainStart), "minutes");
        const remainingTime = diffTime % trainFrequency;
        const minutesAway = trainFrequency - remainingTime;
        const nextArrival = moment().add(minutesAway, "minutes");
        const nextArrivalCorrected = moment(nextArrival).format("LT");

        database.push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            trainFrequency: parseInt(trainFrequency),
            nextArrival: nextArrivalCorrected,
            minutesAway: minutesAway
        });

        $("#name").val('');
        $("#dest").val('');
        $("#first-train").val('');
        $("#frequency").val('');

        return false;
    });
});    
