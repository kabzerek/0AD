// Max player slots for any map (should read from config)
const MAX_SLOTS = 8;

var panelNames = [ 'scorePanel', 'buildingsPanel', 'unitsPanel', 'resourcesPanel', 'marketPanel', 'miscPanel' ];

/**
 * Select active panel
 * @param panelNumber Number of panel, which should get active state (integer)
 */
function selectPanel(panelNumber)
{
	function adjustTabDividers(tabSize)
	{
		var leftSpacer = getGUIObjectByName("tabDividerLeft");
		var rightSpacer = getGUIObjectByName("tabDividerRight");
		leftSpacer.size = "20 " + leftSpacer.size.top + " " + (tabSize.left + 2) + " " + leftSpacer.size.bottom;
		rightSpacer.size = (tabSize.right - 2) + " " + rightSpacer.size.top + " 100%-20 " + rightSpacer.size.bottom;
	}
	
	for (var i = 0; i < panelNames.length; i++)
	{
		if (i != panelNumber)
		{
			getGUIObjectByName(panelNames[i]).hidden = true;
			getGUIObjectByName(panelNames[i] + 'Button').sprite = "BackgroundTab";
		}
		else
		{
			getGUIObjectByName(panelNames[i]).hidden = false;
			getGUIObjectByName(panelNames[i] + 'Button').sprite = "ForegroundTab";
			adjustTabDividers(getGUIObjectByName(panelNames[i] + 'Button').size);
		}
	}
}

function init(data)
{
	var scoreHeadings = [
		{ "name": "playerName0Heading",      "yStart": 26, "width": 200 },
		{ "name": "economyScoreHeading",     "yStart": 16, "width": 100 },
		{ "name": "militaryScoreHeading",    "yStart": 16, "width": 100 },
		{ "name": "explorationScoreHeading", "yStart": 16, "width": 100 },
		{ "name": "totalScoreHeading",       "yStart": 16, "width": 100 }
	];
	var buildingsHeadings = [
		{ "name": "playerName1Heading",        "yStart": 26, "width": 200 },
		{ "name": "buildingsHeading",          "yStart": 16, "width": (85 * 7 + 105) },	//width = 735
		{ "name": "totalBuildingsHeading",     "yStart": 34, "width": 105 },
		{ "name": "houseBuildingsHeading",     "yStart": 34, "width": 85 },
		{ "name": "economicBuildingsHeading",  "yStart": 34, "width": 85 },
		{ "name": "outpostBuildingsHeading",   "yStart": 34, "width": 85 },
		{ "name": "militaryBuildingsHeading",  "yStart": 34, "width": 85 },
		{ "name": "fortressBuildingsHeading",  "yStart": 34, "width": 85 },
		{ "name": "civCentreBuildingsHeading", "yStart": 34, "width": 85 },
		{ "name": "wonderBuildingsHeading",    "yStart": 34, "width": 85 }
	];
	var unitsHeadings = [
		{ "name": "playerName2Heading",   "yStart": 26, "width": 200 },
		{ "name": "unitsHeading",         "yStart": 16, "width": (100 * 6 + 120) },	//width = 720
		{ "name": "totalUnitsHeading",    "yStart": 34, "width": 120 },
		{ "name": "infantryUnitsHeading", "yStart": 34, "width": 100 },
		{ "name": "workerUnitsHeading",   "yStart": 34, "width": 100 },
		{ "name": "cavalryUnitsHeading",  "yStart": 34, "width": 100 },
		{ "name": "championUnitsHeading", "yStart": 34, "width": 100 },
		{ "name": "heroesUnitsHeading",   "yStart": 34, "width": 100 },
		{ "name": "navyUnitsHeading",     "yStart": 34, "width": 100 }
	];
	var resourcesHeadings = [
		{ "name": "playerName3Heading",        "yStart": 26, "width": 200 },
		{ "name": "resourceHeading",           "yStart": 16, "width": (100 * 4 + 110) },//width = 510
		{ "name": "foodGatheredHeading",       "yStart": 34, "width": 100 },
		{ "name": "woodGatheredHeading",       "yStart": 34, "width": 100 },
		{ "name": "stoneGatheredHeading",      "yStart": 34, "width": 100 },
		{ "name": "metalGatheredHeading",      "yStart": 34, "width": 100 },
		{ "name": "totalGatheredHeading",      "yStart": 34, "width": 110 },
		{ "name": "treasuresCollectedHeading", "yStart": 16, "width": 100 },
		{ "name": "resourcesTributedHeading",  "yStart": 16, "width": 121 }
	];
	var marketHeadings = [
		{ "name": "playerName4Heading",      "yStart": 26, "width": 200 },
		{ "name": "exchangedFoodHeading",    "yStart": 16, "width": 100 },
		{ "name": "exchangedWoodHeading",    "yStart": 16, "width": 100 },
		{ "name": "exchangedStoneHeading",   "yStart": 16, "width": 100 },
		{ "name": "exchangedMetalHeading",   "yStart": 16, "width": 100 },
		{ "name": "barterEfficiencyHeading", "yStart": 16, "width": 100 },
		{ "name": "tradeIncomeHeading",      "yStart": 16, "width": 100 }
	];
	var miscHeadings = [
		{ "name": "playerName5Heading",     "yStart": 26, "width": 200 },
		{ "name": "vegetarianRatioHeading", "yStart": 16, "width": 100 },
		{ "name": "feminisationHeading",    "yStart": 26, "width": 100 },
		{ "name": "killDeathRatioHeading",  "yStart": 16, "width": 100 },
		{ "name": "mapExplorationHeading",  "yStart": 16, "width": 100 }
	];
	
	function setSize(yStart, width)
	{
		return left + " " + yStart + " " + (left + width) + " 100%";
	}
	
	function alignHeaders(headings)
	{
		left = 50;
		for (i in headings)
		{
			getGUIObjectByName(headings[i].name).size = setSize(headings[i].yStart, headings[i].width);
			if (headings[i].width < 250)
				left += headings[i].width;			
		}
	}
	
	// colours used for units and buildings
	const TRAINED_COLOR = '[color="201 255 200"]';
	const LOST_COLOR = '[color="255 213 213"]';
	const KILLED_COLOR = '[color="196 198 255"]';

	// colours used for gathered and traded resources
	const SOLD_COLOR = '[color="201 255 200"]';
	const BOUGHT_COLOR = '[color="255 213 213"]';
	
	// caption counters functions
	function captionUnits(type)
	{
		return TRAINED_COLOR + playerState.statistics.unitsTrained[type] + '[/color] / '
			+ LOST_COLOR + playerState.statistics.unitsLost[type] + '[/color] / '
			+ KILLED_COLOR + playerState.statistics.enemyUnitsKilled[type] + '[/color]';
	}
	
	function captionBuildings(type)
	{
		return TRAINED_COLOR + playerState.statistics.buildingsConstructed[type] + '[/color] / '
			+ LOST_COLOR + playerState.statistics.buildingsLost[type] + '[/color] / '
			+ KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed[type] + '[/color]';
	}
	
	function captionResourcesGathered(type)
	{
		return SOLD_COLOR + playerState.statistics.resourcesGathered[type] + '[/color] / '
			+ BOUGHT_COLOR + (playerState.statistics.resourcesUsed[type] - playerState.statistics.resourcesSold[type]) + '[/color]';
	}
	
	function captionResourcesExchanged(type)
	{
		return SOLD_COLOR + '+' + playerState.statistics.resourcesBought[type] + '[/color] '
			+ BOUGHT_COLOR + '-' + playerState.statistics.resourcesSold[type] + '[/color]';	
	}
	
	// Load data
	var civData = loadCivData();
	// Map
	var mapSize = "Scenario";

	getGUIObjectByName("timeElapsed").caption = "Time elapsed: " + timeToString(data.timeElapsed);

	getGUIObjectByName("summaryText").caption = data.gameResult;

	// This is only defined for random maps
	if (data.mapSettings.Size)
	{
		// load the map sizes from the JSON file
		var mapSizes = initMapSizes();

		// retrieve the index of the map size
		for (var mapSizeIndex in mapSizes.tiles)
		{
			if (mapSizes.tiles[mapSizeIndex] == data.mapSettings.Size)
			{
				mapSize = mapSizes.names[mapSizeIndex];
				break;
			}
		}
	}

	getGUIObjectByName("mapName").caption = data.mapSettings.Name + " - " + mapSize;
	
	// Panels
	// Align headers
	var left = 50;
	alignHeaders(scoreHeadings);
	alignHeaders(buildingsHeadings);
	alignHeaders(unitsHeadings);
	alignHeaders(resourcesHeadings);
	alignHeaders(marketHeadings);
	alignHeaders(miscHeadings);
	
	selectPanel(0);
	return;

	// Space player boxes
	var boxSpacing = 32;
	for (var i = 0; i < panelNames.length; ++i)
	{
		for (var j = 0; j < MAX_SLOTS; ++j)
		{
			var box = getGUIObjectByName("playerBox"+i+"["+j+"]");
			var boxSize = box.size;
			var h = boxSize.bottom - boxSize.top;
			boxSize.top = j * boxSpacing;
			boxSize.bottom = j * boxSpacing + h;
			box.size = boxSize;
			
			//tmp
			box.hidden = false;
		}
	}

	// TODO set maxPlayers as playerCounters.length
	var maxPlayers = data.playerStates.length - 1;

	
	
	
	selectPanel(0);
	return;
	
	// Show counters
	for (var i = 0; i < MAX_SLOTS; ++i)
	{
		if (i < maxPlayers)
		{
			var playerState = data.playerStates[i+1];

			for (var k = 0; k < panelNames.length; ++k)
			{
				var playerBox = getGUIObjectByName("playerBox"+k+"1["+i+"]");
				playerBox.hidden = false;

				var colourString = "colour: "
					+ Math.floor(playerState.colour.r * 255) + " "
					+ Math.floor(playerState.colour.g * 255) + " "
					+ Math.floor(playerState.colour.b * 255);
				playerBox.sprite = colourString + " 32";
				var playerColourBox = getGUIObjectByName("playerColourBox"+k+"1["+i+"]");
				playerColourBox.sprite = colourString + " 140";//" 255";

				// Show the multiplayer name, e.g. "Foobar" rather than "Player 1".
				// TODO: Perhaps show both the multiplayer and map-specific name?
				var playerName = getGUIObjectByName("playerName"+k+"1["+i+"]");
				playerName.caption = data.players[i+1].name;

				getGUIObjectByName("civIcon"+k+"1["+i+"]").sprite = "stretched:"+civData[playerState.civ].Emblem;
				getGUIObjectByName("civIcon"+k+"1["+i+"]").tooltip = civData[playerState.civ].Name;
			}

			var economyScore = getGUIObjectByName("economyScore1["+i+"]");
			var militaryScore = getGUIObjectByName("militaryScore1["+i+"]");
			var explorationScore = getGUIObjectByName("explorationScore1["+i+"]");
			var totalScore = getGUIObjectByName("totalScore1["+i+"]");
			
			var totalBuildings = getGUIObjectByName("totalBuildings1["+i+"]");
			var houseBuildings = getGUIObjectByName("houseBuildings1["+i+"]");
			var economicBuildings = getGUIObjectByName("economicBuildings1["+i+"]");
			var outpostBuildings = getGUIObjectByName("outpostBuildings1["+i+"]");
			var militaryBuildings = getGUIObjectByName("militaryBuildings1["+i+"]");
			var fortressBuildings = getGUIObjectByName("fortressBuildings1["+i+"]");
			var civCentreBuildings = getGUIObjectByName("civCentreBuildings1["+i+"]");
			var wonderBuildings = getGUIObjectByName("wonderBuildings1["+i+"]");

			var totalUnits = getGUIObjectByName("totalUnits1["+i+"]");
			var infantryUnits = getGUIObjectByName("infantryUnits1["+i+"]");
			var workerUnits = getGUIObjectByName("workerUnits1["+i+"]");
			var cavalryUnits = getGUIObjectByName("cavalryUnits1["+i+"]");
			var championUnits = getGUIObjectByName("championUnits1["+i+"]");
			var heroesUnits = getGUIObjectByName("heroesUnits1["+i+"]");
			var navyUnits = getGUIObjectByName("navyUnits1["+i+"]");

			var foodGathered = getGUIObjectByName("foodGathered1["+i+"]");
			var woodGathered = getGUIObjectByName("woodGathered1["+i+"]");
			var stoneGathered = getGUIObjectByName("stoneGathered1["+i+"]");
			var metalGathered = getGUIObjectByName("metalGathered1["+i+"]");
			var totalGathered = getGUIObjectByName("totalGathered1["+i+"]");
			var treasuresCollected = getGUIObjectByName("treasuresCollected1["+i+"]");
			var resourcesTributed = getGUIObjectByName("resourcesTributed1["+i+"]");

			var exchangedFood = getGUIObjectByName("exchangedFood1["+i+"]");
			var exchangedWood = getGUIObjectByName("exchangedWood1["+i+"]");
			var exchangedStone = getGUIObjectByName("exchangedStone1["+i+"]");
			var exchangedMetal = getGUIObjectByName("exchangedMetal1["+i+"]");
			var barterEfficiency = getGUIObjectByName("barterEfficiency1["+i+"]");
			var tradeIncome = getGUIObjectByName("tradeIncome1["+i+"]");
			
			var vegetarianRatio = getGUIObjectByName("vegetarianRatio1["+i+"]");
			var feminisationRatio = getGUIObjectByName("feminisation1["+i+"]");
			var killDeathRatio = getGUIObjectByName("killDeathRatio1["+i+"]");
			var mapExploration = getGUIObjectByName("mapExploration1["+i+"]");

			// align counters

			left = 240;
			width = 100;
			economyScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			militaryScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			explorationScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			totalScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			var size = getGUIObjectByName("playerBox01["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox01["+i+"]").size = size;
			
			left = 240;
			width = 85;
			totalBuildings.size = left + " 2 " + (left + width + 20) + " 100%"; left += width + 20;
			houseBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			economicBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			outpostBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			militaryBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			fortressBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			civCentreBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			wonderBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox11["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox11["+i+"]").size = size;
			
			left = 240;
			width = 100;
			totalUnits.size = left + " 2 " + (left + width + 20) + " 100%"; left += width + 20;
			infantryUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			workerUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			cavalryUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			championUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			heroesUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			navyUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox21["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox21["+i+"]").size = size;

			left = 240;
			width = 100;
			foodGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			woodGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			stoneGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			metalGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			totalGathered.size = left + " 2 " + (left + width + 10) + " 100%"; left += width + 10;
			treasuresCollected.size	= left + " 2 " + (left + width) + " 100%"; left += width;
			resourcesTributed.size = left + " 2 " + (left + tributesWidth) + " 100%"; left += tributesWidth;
			size = getGUIObjectByName("playerBox31["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox31["+i+"]").size = size;

			left = 240;
			width = 100;
			exchangedFood.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedWood.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedStone.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedMetal.size = left + " 2 " + (left + width) + " 100%"; left += width;
			barterEfficiency.size = left + " 2 " + (left + width) + " 100%"; left += width;
			tradeIncome.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox41["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox41["+i+"]").size = size;
			
			left = 240;
			width = 100;
			size = getGUIObjectByName("playerBox51["+i+"]").size;
			vegetarianRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			feminisationRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			killDeathRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			mapExploration.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size.right = left + 10;
			getGUIObjectByName("playerBox51["+i+"]").size = size;

			// display counters
			economyScore.caption = Math.round(playerState.statistics.resourcesGathered.total / 10);
			militaryScore.caption = Math.round((playerState.statistics.enemyUnitsKilledValue + playerState.statistics.enemyBuildingsDestroyedValue) / 10);
			explorationScore.caption = playerState.statistics.percentMapExplored * 10;
			totalScore.caption = Number(economyScore.caption) + Number(militaryScore.caption) + Number(explorationScore.caption);

			totalBuildings.caption = captionBuildings("total");
			houseBuildings.caption = captionBuildings("House");
			economicBuildings.caption = captionBuildings("Economic");
			outpostBuildings.caption = captionBuildings("Outpost");
			militaryBuildings.caption = captionBuildings("Military");
			fortressBuildings.caption = captionBuildings("Fortress");
			civCentreBuildings.caption = captionBuildings("CivCentre");
			wonderBuildings.caption = captionBuildings("Wonder");

			totalUnits.caption = captionUnits("total");
			infantryUnits.caption = captionUnits("Infantry");
			workerUnits.caption = captionUnits("Worker");
			cavalryUnits.caption = captionUnits("Cavalry");
			championUnits.caption = captionUnits("Champion");
			heroesUnits.caption = captionUnits("Hero");
			navyUnits.caption = captionUnits("Ship");

			foodGathered.caption = captionResourcesGathered("food");
			woodGathered.caption = captionResourcesGathered("wood");
			stoneGathered.caption = captionResourcesGathered("stone");
			metalGathered.caption = captionResourcesGathered("metal");
			totalGathered.caption =	captionResourcesGathered("total");
			treasuresCollected.caption = playerState.statistics.treasuresCollected;
			resourcesTributed.caption = SOLD_COLOR + playerState.statistics.tributesSent + "[/color] / " +
				BOUGHT_COLOR + playerState.statistics.tributesReceived + "[/color]";

			exchangedFood.caption = captionResourcesExchanged("food");
			exchangedWood.caption = captionResourcesExchanged("wood");
			exchangedStone.caption = captionResourcesExchanged("stone");
			exchangedMetal.caption = captionResourcesExchanged("metal");
			var totalBought = 0;
			for each (var boughtAmount in playerState.statistics.resourcesBought)
				totalBought += boughtAmount;
			var totalSold = 0;
			for each (var soldAmount in playerState.statistics.resourcesSold)
				totalSold += soldAmount;
			barterEfficiency.caption = Math.floor(totalSold > 0 ? (totalBought / totalSold) * 100 : 0) + "%";
			tradeIncome.caption = playerState.statistics.tradeIncome;
						
			vegetarianRatio.caption = Math.floor(playerState.statistics.resourcesGathered.food > 0 ?
				(playerState.statistics.resourcesGathered.vegetarianFood / playerState.statistics.resourcesGathered.food) * 100 : 0) + "%";
			feminisationRatio.caption = playerState.statistics.feminisation + "%";
			killDeathRatio.caption = Math.round((playerState.statistics.enemyUnitsKilled.total > 0 ?
				(playerState.statistics.enemyUnitsKilled.total / playerState.statistics.unitsLost.total) : 0)*100)/100;
			mapExploration.caption = playerState.statistics.percentMapExplored + "%";
		}
		else
		{
			// hide player boxes
			for (var k = 0; k < panelNames.length; ++k)
			{
				var playerBox = getGUIObjectByName("playerBox"+k+"1["+i+"]");
				playerBox.hidden = true;
			}
		}
	}

	selectPanel(0);
}

function onTick()
{
}
