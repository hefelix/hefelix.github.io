var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function () {
var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
$TABLE.find('table').append($clone);
});

$('.table-remove').click(function () {
$(this).parents('tr').detach();
});

$('.table-up').click(function () {
var $row = $(this).parents('tr');
if ($row.index() === 1) return; // Don't go above the header
$row.prev().before($row.get(0));
});

$('.table-down').click(function () {
var $row = $(this).parents('tr');
$row.next().after($row.get(0));
});

$('.start-tabata').click(function () {

// Set the counter vars
var currentTime = 5; // initialise get ready 5 sec
var startOfSet = 20; // 20
var startOfShortPause = 10; //10
var startOfLongPause = 45; // 45

var tabataState = 4; // 0 = notActive, 1=Actie, 2=PauseShort, 3=pauseLong, 4=initialise
var currentSet = 1;
var currentExercise = 0;

var myTab = document.getElementById("MyTable");
var nrOfRows = myTab.tBodies[0].rows.length;
var nrOfSetsPerExercise = [];
for (i = 1; i < nrOfRows; i++) {
  nrOfSetsPerExercise[i-1] = myTab.tBodies[0].rows[i].cells[1].innerHTML;
}
var numOfExercises = nrOfRows-2; // -1 for "top row" and -1 for idx from 0

// UUpdate the count down every 1 second
var x = setInterval(function() {
	// Starting up
	if (tabataState == 4){
	document.getElementById("getReadySound").play();
	document.getElementById("timer").innerHTML = "GET READY!!";
  }

	switch (tabataState)
    {
		case 0: // Not active/done
			currentTime = 0;
            break;

        case 1: // Actively exercising
			if(currentTime > 0) {
				currentTime--;
			} else if(currentSet < Number(nrOfSetsPerExercise[currentExercise])){
				currentTime = startOfShortPause;
				tabataState = 2;
			} else if(currentExercise < numOfExercises){
				currentTime = startOfLongPause;
				tabataState = 3;
			} else { // tabata is over
			 tabataState = 0;
			}
			break;

        case 2: // ShortPause
			if (currentTime > 0){
				currentTime--;
			}else {
				currentTime = startOfSet;
				currentSet++;
				tabataState = 1;
			}
			break;
		case 3: // LongPause
			if (currentTime > 0){
				currentTime--;
			}else {
				currentTime = startOfSet;
				currentSet = 1; // Restart on new set 1
				currentExercise++;
				tabataState = 1;
			}
			break;
		case 4:
			if (currentTime > 0){
				currentTime--;
			}else {
				currentTime = startOfSet;
				tabataState = 1;
				document.getElementById("startSetSound").play();
				document.getElementById("timer").innerHTML = currentTime;
			}
			break;
		default:
			currentTime = 100; //Shouldnt be here
			break;
    }
  // Output the time
  if(tabataState != 4) {
  document.getElementById("timer").innerHTML = currentTime;
  document.getElementById("setreps").innerHTML = currentSet + "/" + nrOfSetsPerExercise[currentExercise];
  }
  // play audio if suitable
  if ((tabataState == 2 || tabataState == 3) && (currentTime == 1)){
	document.getElementById("startSetSound").play();
  }
  if (tabataState == 1 && currentTime == 1){
    document.getElementById("endSetSound").play();
  }

}, 1000);
});




// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
var $rows = $TABLE.find('tr:not(:hidden)');
var headers = [];
var data = [];

// Get the headers (add special header logic here)
$($rows.shift()).find('th:not(:empty)').each(function () {
headers.push($(this).text().toLowerCase());
});

// Turn all existing rows into a loopable array
$rows.each(function () {
var $td = $(this).find('td');
var h = {};

// Use the headers from earlier to name our hash keys
headers.forEach(function (header, i) {
h[header] = $td.eq(i).text();
});

data.push(h);
});

// Output the result
$EXPORT.text(JSON.stringify(data));
});
