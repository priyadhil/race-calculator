var racerArray = [];
var selectedRow = null;

//Instantiate racer
window.onload = function init() {
  document.getElementById("tablebody").innerHTML = "";
  // if (typeof racerArray[1] == "undefined") {
  if (localStorage.racerRecord) {
    document.getElementById("errMsg").innerHTML =
      "* Add racer and start the timer";
    //Storing racer data's in to local storage
    racerArray = JSON.parse(localStorage.racerRecord);
    for (var i = 0; i < racerArray.length; i++) {
      prepareTableCell(
        racerArray[i].racerName,
        racerArray[i].racerCount,
        racerArray[i].racerTotal,
        racerArray[i].racerAverage,
        racerArray[i].racerLast
      );
    }
  }
};
//Event: Adding a Racer
document.getElementById("form").addEventListener("submit", e => {
  var racerName = document.getElementById("racerName").value;
  var racerCount = document.getElementById("racerCount").innerHTML;
  var racerTotal = document.getElementById("racerTotal").innerHTML;
  var racerAverage = document.getElementById("racerAverage").innerHTML;
  var racerLast = document.getElementById("racerLast").innerHTML;
  if (racerCount === 0) {
    alert("start the timer");
    e.preventDefault();
  } else {
    createRacer(racerName, racerCount, racerTotal, racerAverage, racerLast);
    e.preventDefault();
  }
});

function createRacer(
  racerName,
  racerCount,
  racerTotal,
  racerAverage,
  racerLast
) {
  //Represent a Racer
  var racer = {
    racerName: racerName,
    racerCount: racerCount,
    racerTotal: racerTotal,
    racerAverage: racerAverage,
    racerLast: racerLast
  };
  if (selectedRow == null) {
    racerArray.push(racer);
    console.log(racerArray);
  } else {
    racerArray.splice(selectedIndex, 1, racer);
  }

  localStorage.racerRecord = JSON.stringify(racerArray);
  init();

  // Prepare Table  to display racer
}
function prepareTableCell(
  racerName,
  racerCount,
  racerTotal,
  racerAverage,
  racerLast
) {
  var table = document.getElementById("tablebody");
  var row = table.insertRow();
  var racerNameCell = row.insertCell(0); //Table data
  var racerCountCell = row.insertCell(1);
  var racerTotalCell = row.insertCell(2);
  var racerAverageCell = row.insertCell(3);
  var racerLastCell = row.insertCell(4);

  racerNameCell.innerHTML =
    '<button class="btn btn-warning">(' + racerName + ")</button>";
  racerCountCell.innerHTML = racerCount;
  racerTotalCell.innerHTML = racerTotal;
  racerAverageCell.innerHTML = racerAverage;
  racerLastCell.innerHTML = racerLast;
}
//clock class: Represent a Clock
var lapArray = [];
class Clock {
  constructor(display, results) {
    this.running = false;
    this.display = display;
    this.results = results;
    this.laps = [];
    this.reset();
    this.print(this.times);
  }
  //Reset Time to 0
  reset() {
    this.times = [0, 0, 0];
  }
  //To Start the Clock
  start() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
  }
  //To Get time for each lap
  lap() {
    var times = this.times;
    var li = document.createElement("li");
    this.results.appendChild(li);
    li.innerText = this.format(times);
    var list = document.getElementsByTagName("li").length;
    var count = document.getElementById("racerCount");
    var last = this.results.lastChild.innerText;
    var displayLast = document.getElementById("racerLast");
    if (list == null) {
      return "No data";
    } else {
      count.innerHTML = list;
      displayLast.innerHTML = last;
    }
    if (list === 1) {
      var displayAvg = document.getElementById("racerAverage");
      displayAvg.innerHTML = times;
    } else {
      var displayAvg = document.getElementById("racerAverage");
      var avg = times[1] / list;
      // console.log(formatTime);
      displayAvg.innerHTML = avg;
    }
  }

  stop() {
    this.running = false;
    this.time = null;
  }

  clear() {
    this.time = null;
    clearChildren(this.results);
  }

  step(timestamp) {
    if (!this.running) return;
    this.calculate(timestamp);
    this.time = timestamp;
    this.print();
    requestAnimationFrame(this.step.bind(this));
  }

  calculate(timestamp) {
    var diff = timestamp - this.time;

    // Hundredths of a second are 100 ms
    this.times[2] += diff / 10;
    // Seconds are 100 hundredths of a second
    if (this.times[2] >= 100) {
      this.times[1] += 1;
      this.times[2] -= 100;
    }
    // Minutes are 60 seconds
    if (this.times[1] >= 60) {
      this.times[0] += 1;
      this.times[1] -= 60;
    }
  }

  print() {
    var myDate = document.getElementById("date");
    myDate.innerHTML = Date();
    this.display.innerText = this.format(this.times);
    var total = this.display.innerText;
    var displayTotal = document.getElementById("racerTotal");
    displayTotal.innerHTML = total;
    //console.log(total);
  }

  format(times) {
    return `\
${pad(times[0], 2)}:\
${pad(times[1], 2)}:\
${pad(Math.floor(times[2]), 2)}`;
  }
}

function pad(value, count) {
  var result = value.toString();
  for (; result.length < count; --count) result = "0" + result;
  return result;
}

function clearChildren(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}

var clock = new Clock(
  document.querySelector(".clock"),
  document.querySelector(".results")
);
