var R3DJ0HN = {};
R3DJ0HN.BJTCTrainer = new function()
{

	this.init = function()
	{
		//init main object------------------------
		var main = {};
		initMain(main);
		//----------------------------------------

		//Stages div completion-------------------
		initStages(main);
		//----------------------------------------

		//first calculation-----------------------
		next(main);
		//----------------------------------------

		//Events initialization-------------------
		initEvents(main);
		//----------------------------------------
	};

	function initStages(m)
	{
		var stages = document.getElementById("stages");
		var stage = 0;
		var previousStage = 1;
		var previousI, roundedI;
		var min = (m.rcMin <= -20) ? -20 : m.rcMin;
		var max = (m.rcMax >= 20) ? 20 : m.rcMax;
		var step = (m.stepDeck <= 0.5) ? 0.5 : m.stepDeck;

		var limits = document.getElementById("limits");
		limits.innerHTML = "RC -20 (min) | RC 20 (max) | 0.5 Step (min)";
		stages.innerHTML = "";
		var content = "";

		for (var i = m.decks, rc = min; i > m.decksUndealt; rc++)
		{
			roundedI = i;								//(1)-----------------------------------------------------------------
			if (!i.toString().match("^([-]?[0-9]+)$"))	//(1) : If it's a decimal number, toFixed() method exists for object i
			{
				roundedI = i.toFixed(1);
			}

			if (rc == min)
			{
				content += "<br />--------------- " + roundedI + " decks left ---------------<br />";
			}

			stage = Math.floor(rc/i);
			if (stage != previousStage || i != previousI)
			{
				content += "RC " + rc + " / " + roundedI + " decks = TC " + Math.floor(rc/i) + "<br />";
			}
			previousStage = Math.floor(rc/i);
			previousI = i;

			if (rc == max)
			{
				i -= step;
				if (roundedI != i) //if toFixed() method exists for object i ( see (1) )
				{
					i = (i.toFixed(1) != 0.0) ? i : 0;//We assign 0 to i if it equals to approximately 0.0
				}
				rc = min - 1;
			}
		}

		stages.innerHTML = content;
	}

	function isInteger(value)
	{
		value = (value.match("^([-]?[0-9]{1,2})$") !== null) ? value : "";
		var isNb = (!isNaN(parseInt(value)));
		value = isNb ? value : "";
		return value;
	}

	function isDecimal(value)
	{
		value = (value.match("^([-]?[0-9]{1,2}(\.[0-9]{1})?)$") !== null) ? value : "";
		return value;
	}

	function initMain(m)
	{
		var decksInput = document.getElementById("decks");
		var rcMaxInput = document.getElementById("rcMax");
		var rcMinInput = document.getElementById("rcMin");
		var deckStepInput = document.getElementById("deckStep");
		var decksUndealtInput = document.getElementById("decksUndealt");

		//Check if all inputs are corrects number (integer or decimal)--------------
		decksInput.value = (isInteger(decksInput.value) !== "") ? decksInput.value : 6 ;
		rcMaxInput.value = (isInteger(rcMaxInput.value) !== "") ? rcMaxInput.value : 20 ;
		rcMinInput.value = (isInteger(rcMinInput.value) !== "") ? rcMinInput.value : -20 ;
		deckStepInput.value = (isDecimal(deckStepInput.value) !== "") ? deckStepInput.value : 0.5 ;
		decksUndealtInput.value = (isDecimal(decksUndealtInput.value) !== "") ? decksUndealtInput.value : 1 ;
		//--------------------------------------------------------------------------

		//-0 cases : we assign 0 instead if necessary ------------------------------
		rcMaxInput.value = (rcMaxInput.value === "-0") ? 0 : rcMaxInput.value;
		rcMinInput.value = (rcMinInput.value === "-0") ? 0 : rcMinInput.value;
		decksUndealtInput.value = (decksUndealtInput.value === "-0") ? 0 : decksUndealtInput.value;
		//--------------------------------------------------------------------------

		//We check if all inputs numbers are in correct boundaries -----------------
		decksInput.value = (decksInput.value >= 8) ? 8 : ( (decksInput.value <= 0) ? 1 : decksInput.value );
		rcMaxInput.value = (rcMaxInput.value >= 30) ? 30 : ( (parseInt(rcMaxInput.value) < parseInt(rcMinInput.value)) ? rcMinInput.value : rcMaxInput.value );
		rcMinInput.value = (rcMinInput.value <= -30) ? -30 : ( (parseInt(rcMinInput.value) > parseInt(rcMaxInput.value)) ? rcMaxInput.value : rcMinInput.value );
		deckStepInput.value = (deckStepInput.value >= decksInput.value) ? decksInput.value : ( (deckStepInput.value <= 0) ? 0.5 : deckStepInput.value );
		decksUndealtInput.value = (decksUndealtInput.value >= decksInput.value || decksUndealtInput.value < 0) ? 1 : decksUndealtInput.value;
		//--------------------------------------------------------------------------

		//We assign inputs values to the main object corresponding properties ------
		m.rcMax = rcMaxInput.value ;
		m.rcMin = rcMinInput.value;
		m.remainingRc = m.rcMax - m.rcMin;
		m.decks = decksInput.value;
		m.decksLeft = m.decks;
		m.rc = 0;
		m.stepDeck = deckStepInput.value;
		m.decksUndealt = decksUndealtInput.value;
		//--------------------------------------------------------------------------

		//We initialize the running count array ------------------------------------
		m.runningCount = new Array();
		initRcArray(m);
		//--------------------------------------------------------------------------

		document.getElementById("answer").focus();
	}

	function initRcArray(m)
	{
		for (var i = 0, c=m.rcMin; i <= m.rcMax - m.rcMin; i++)
		{
			m.runningCount[i] = c;
			c++;
		}
	}

	function next(m)
	{
		document.getElementById("correction").src = "img/question.png";

		if (m.remainingRc < 0)
		{
			m.decksLeft -= m.stepDeck;
			m.remainingRc = m.rcMax - m.rcMin;
			initRcArray(m);
		}
		if (m.decksLeft > m.decksUndealt)
		{
			var randNumber = Math.floor(Math.random()*(m.remainingRc+1));

			m.rc = m.runningCount[randNumber];
			m.runningCount[randNumber] = m.runningCount[m.remainingRc];

			m.remainingRc -= 1;

			document.getElementById("calculation").innerHTML = "RC " + m.rc + " / " + m.decksLeft + " decks = TC " ;
		}
		else
		{
			document.getElementById("calculation").innerHTML = "Done";
		}
		document.getElementById("answer").value = "";
	}

	function check(m)
	{
		var correctionImg = document.getElementById("correction");
		var results = document.getElementById("results");
		var line = document.createElement("tr");
		var cellTxt = document.createElement("td");
		var cellImg = document.createElement("td");

		var answer = document.getElementById("answer").value;
		answer = isInteger(answer);

		if (answer !== "")
		{
			if (Math.floor(m.rc/m.decksLeft) == answer)
			{
				correctionImg.src = "img/true.png";
				results.appendChild(line);
				cellTxt.innerHTML = "RC " + m.rc + " / " + m.decksLeft + " decks = TC " + answer;
				cellImg.innerHTML = "<img src='img/true.png' alt='correction' />";
				line.appendChild(cellTxt);
				line.appendChild(cellImg);

				setTimeout(function(){next(m);}, 300);
			}
			else
			{
				correctionImg.src = "img/false.png";
				results.appendChild(line);
				cellTxt.innerHTML = "RC " + m.rc + " / " + m.decksLeft + " decks = TC " + answer;
				cellImg.innerHTML = "<img src='img/false.png' alt='correction' />";
				line.appendChild(cellTxt);
				line.appendChild(cellImg);
			}
		}
		return false;
	}

	function initEvents(m)
	{
		var startButton = document.getElementById("start");
		startButton.onclick = function()
		{
			initMain(m);
			initStages(m);
			next(m);
		};

		var answer = document.getElementById("answer");
		answer.onkeypress = function(e)
		{
			var e = e || window.event;
			if (e.keyCode == 13)
			{
				if (m.decksLeft > m.decksUndealt)
				{
					check(m);
				}
			}
		};

		var hideStagesButton = document.getElementById("hideStages");
		hideStagesButton.onclick = function()
		{
			var stagesDiv = document.getElementById("stages");
			stagesDiv.style.color = (stagesDiv.style.color == "black") ? "limegreen" : "black";
			stagesDiv.style.textShadow = (stagesDiv.style.textShadow == "none") ? "0 0 5px" : "none";
		};

		var clearResultsButton = document.getElementById("clearResults");
		var results = document.getElementById("results");
		clearResultsButton.onclick = function()
		{
			while(results.firstChild)
			{
				results.removeChild(results.firstChild);
			}
		};
	}

};

window.onload = function() { R3DJ0HN.BJTCTrainer.init(); };