var R3DJ0HN = {};
R3DJ0HN.HiLoIndexTraining = new function()
{

	this.init = function()
	{
		var main = {};

		//All Hi-Lo indexes for french casinos rules from blackjack-square.com (except surrender indexes)
		main.hands =
		{
			"8" :  {
						"3" : 10,
						"4" : 6,
						"5" : 4,
						"6" : 2
					},
			"9" :  {
						"2" : 1,
						"3" : -1,
						"7" : 4
					},
			"10" :  {
						"9" : -2
					},
			"11" :  {
						"9" : -4,
						"10" : 4
					},
			"12" :  {
						"2" : 4,
						"3" : 2,
						"4" : 0,
						"5" : -1,
						"6" : -1
					},
			"13" :  {
						"2" : -1,
						"3" : -2
					},
			"14" :  {
						"2" : -4
					},
			"15" :  {
						"7" : 11,
						"8" : 11,
						"9" : 8,
						"10" : 4,
						"AS" : 10
					},
			"16" :  {
						"7" : 9,
						"8" : 7,
						"9" : 5,
						"10" : 0,
						"AS" : 9
					},
			"9-9" : {
						"7" : 3
					},
			"A9" : 	{
						"4" : 6,
						"5" : 5,
						"6" : 4
					},
			"A8" : 	{
						"3" : 5,
						"4" : 3,
						"5" : 2,
						"6" : 1
					},
			"A7" : 	{
						"2" : 0,
						"AS" : 1
					},
			"A6" : 	{
						"2" : 2
					}
		};

		//Insert all indexes and corresponding "playerVDealer" couples from main.hands into two separate arrays.
		//Both arrays will be used to randomly select an index to guess and its corresponding "playerVDealer" couple
		handsToArray(main);

		//Generation and completion of the Index Grid
		gridGeneration(main);

		//main properties initialization
		main.index = 0;
		main.indexesRemaining = main.cardsCombArray.length - 1;
		main.cardComb = "";

		//Events initialization
		initEvents(main);

		//First index to find
		next(main);

		//Focus on the answer input
		answer.focus();
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

	function gridToHands(m)
	{
		m.hands = {};
		var grid = document.getElementById("indexGrid");
		var cells = grid.getElementsByTagName("input");
		var id, p, d;

		for (var i = 0, c=cells.length; i<c; i++)
		{
			id = cells[i].id;
			p = id.match("p(.*)d");
			d = id.match("p.*d(.*)");

			cells[i].value = isInteger(cells[i].value);

			if (cells[i].value !== "")
			{
				if (typeof m.hands[p[1]] === "undefined")
				{
					m.hands[p[1]] = {};
				}
				m.hands[p[1]][d[1]] = cells[i].value;
			}
		}
	}

	function handsToArray(m)
	{
		m.cardsCombArray = [];
		m.indexesArray = [];
		var i = 0;
		var playerHand;
		var dealerUpcard;

		for (playerHand in m.hands)
		{
			for (dealerUpcard in m.hands[playerHand])
			{
				m.cardsCombArray[i] = playerHand + " V " + dealerUpcard;
				m.indexesArray[i] = m.hands[playerHand][dealerUpcard];
				i++;
			}
		}
	}

	function next(m)
	{
		document.getElementById("correction").src = "img/question.png";

		if (m.indexesRemaining >= 0)
		{
			var randNumber = Math.floor(Math.random()*(m.indexesRemaining+1));

			m.index = m.indexesArray[randNumber];

			m.cardComb = m.cardsCombArray[randNumber];
			cards.innerHTML = m.cardComb + " : ";

			m.indexesArray[randNumber] = m.indexesArray[m.indexesRemaining];
			m.cardsCombArray[randNumber] = m.cardsCombArray[m.indexesRemaining];
		}
		else
		{
			document.getElementById("cards").innerHTML = "Done";
		}

		m.indexesRemaining -= 1;
		document.getElementById("answer").value = "";
	}

	function check (m)
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
			if (answer == m.index)
			{
				correctionImg.src = "img/true.png";
				results.appendChild(line);
				cellTxt.innerHTML = m.cardComb + " : " + answer;
				cellImg.innerHTML = "<img src='img/true.png' alt='correction' />";
				line.appendChild(cellTxt);
				line.appendChild(cellImg);

				setTimeout(function(){next(m);}, 300);
			}
			else
			{
				correctionImg.src = "img/false.png";
				results.appendChild(line);
				cellTxt.innerHTML = m.cardComb + " : " + answer;
				cellImg.innerHTML = "<img src='img/false.png' alt='correction' />";
				line.appendChild(cellTxt);
				line.appendChild(cellImg);
			}
		}
	}

	function gridGeneration(m)
	{
		//Two arrays for player hand possibilities and dealer upcard possibilities.
		var playerHand = ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
		"2-2", "3-3", "4-4", "5-5", "6-6", "7-7", "8-8", "9-9", "10-10", "AS-AS",
		"A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"];
		var dealerUpcard = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "AS"];

		var table = document.getElementById("grid");
		var head = document.createElement("thead");
		var lineHead = document.createElement("tr");

		table.appendChild(head);
		head.appendChild(lineHead);

		var dealerHead = document.createElement("th");  //As the first column is the player hand,
		lineHead.appendChild(dealerHead);				//the "dealer upcard" line has to be moved one step to the right (done with an empty <th> node)

		//Head completion for the dealer upcard
		for (var i = 0, c=dealerUpcard.length; i<c; i++)
		{
			dealerHead = document.createElement("th");
			dealerHead.innerHTML = dealerUpcard[i];
			lineHead.appendChild(dealerHead);
		}

		//Table completion. If an index was defined for a certain "player hand" V "dealer upcard" couple, it appears in the appropriate cell.
		for (var i = 0, p=playerHand.length; i<p; i++)
		{
			var line = document.createElement("tr");
			table.appendChild(line);
			var playerHead = document.createElement("th");
			playerHead.innerHTML = playerHand[i];
			line.appendChild(playerHead);

			for (var j = 0, d=dealerUpcard.length; j<d; j++)
			{
				var indexCase = document.createElement("td");
				line.appendChild(indexCase);

				var inputValue = "";
				if ((typeof m.hands[playerHand[i]] !== "undefined") && (typeof m.hands[playerHand[i]][dealerUpcard[j]] !== "undefined"))
				{
					inputValue = m.hands[playerHand[i]][dealerUpcard[j]];
				}
				indexCase.innerHTML += "<input type='text' id='p" + playerHand[i] + "d" + dealerUpcard[j] + "' maxlength='3' size='1' value='" + inputValue + "'>";
			}
		}
	}

	function initEvents(m)
	{
		var startButton = document.getElementById("start");
		startButton.onclick = function()
		{
			gridToHands(m);
			handsToArray(m);
			m.indexesRemaining = m.cardsCombArray.length - 1;
			next(m);
			answer.focus();
		};

		answer.onkeypress = function(e)
		{
			var e = e || window.event;
			if (e.keyCode == 13)
			{
				if (m.indexesRemaining >= -1)
				{
					check(m);
					answer.focus();
				}
			}
		};

		var gridInputs = document.getElementById("indexGrid").getElementsByTagName("input");

		var hideIndexesButton = document.getElementById("hideIndexes");
		hideIndexesButton.onclick = function()
		{
			for (var i = 0, c = gridInputs.length; i<c; i++)
			{
				gridInputs[i].style.backgroundColor = (gridInputs[i].style.backgroundColor == "black") ? "white" : "black";
			}
		};

		var clearAllButton = document.getElementById("clearAll");
		clearAllButton.onclick = function()
		{
			for (var i = 0, c = gridInputs.length; i<c; i++)
			{
				gridInputs[i].value = "";
			}
		};

		var ill18Button = document.getElementById("ill18");
		ill18Button.onclick = function()
		{
			document.getElementById("p16d9").value = 5;
			document.getElementById("p16d10").value = 0;
			document.getElementById("p15d10").value = 4;
			document.getElementById("p13d2").value = -1;
			document.getElementById("p13d3").value = -2;
			document.getElementById("p12d2").value = 4;
			document.getElementById("p12d3").value = 2;
			document.getElementById("p12d4").value = 0;
			document.getElementById("p12d5").value = -1;
			document.getElementById("p12d6").value = -1;
			document.getElementById("p9d2").value = 1;
			document.getElementById("p9d7").value = 4;
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

window.onload = function() { R3DJ0HN.HiLoIndexTraining.init(); };