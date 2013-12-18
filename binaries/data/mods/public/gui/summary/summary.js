// Max player slots for any map (should read from config)
const MAX_SLOTS = 8;

var panelNames = [ 'scorePanel', 'buildingsPanel', 'unitsPanel', 'conquestPanel', 'resourcesPanel', 'marketPanel', 'miscPanel' ];
var panelButtonNames = [ 'scorePanelButton', 'buildingsPanelButton', 'unitsPanelButton', 'conquestPanelButton', 'resourcesPanelButton', 'marketPanelButton', 'miscPanelButton' ];

/**
 * Select active panel
 * @param panelNumber Number of panel, which should get active state (integer)
 */
function selectPanel(panelNumber)
{
	for (var i = 0; i < panelNames.length; i++)
	{
		if (i != panelNumber)
		{
			getGUIObjectByName(panelNames[i]).hidden = true;
			getGUIObjectByName(panelButtonNames[i]).sprite = "BackgroundTab";
		}
		else
		{
			getGUIObjectByName(panelNames[i]).hidden = false;
			getGUIObjectByName(panelButtonNames[i]).sprite = "ForegroundTab";
			adjustTabDividers(getGUIObjectByName(panelButtonNames[i]).size);
		}
	}
}

function adjustTabDividers(tabSize)
{
	var leftSpacer = getGUIObjectByName("tabDividerLeft");
	var rightSpacer = getGUIObjectByName("tabDividerRight");
	leftSpacer.size = "20 " + leftSpacer.size.top + " " + (tabSize.left + 2) + " " + leftSpacer.size.bottom;
	rightSpacer.size = (tabSize.right - 2) + " " + rightSpacer.size.top + " 100%-20 " + rightSpacer.size.bottom;
}

function init(data)
{
	var civData = loadCivData();
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
		}
	}

	// TODO set maxPlayers as playerCounters.length
	var maxPlayers = data.playerStates.length - 1;

	// Align headers
	var left = 50;
	var width = 100;
	var playerNameHeadingWidth = 200;
	// Special cased to make the (Sent / Received) part fit
	var tributesWidth = 121;
	getGUIObjectByName("playerName0Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("economyScoreHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("militaryScoreHeading").size = left +  " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("explorationScoreHeading").size = left +  " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("totalScoreHeading").size = left +  " 16 " + (left + width) + " 100%"; left += width;
	
	left = 50;
	width = 85;
	getGUIObjectByName("playerName1Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("buildingsHeading").size = left + " 16 " + (left + width * 7 + 20) + " 100%";
	getGUIObjectByName("totalBuildingsHeading").size = left + " 34 " + (left + width + 20) + " 100%"; left += width + 20;
	getGUIObjectByName("houseBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("economicBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("outpostBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("militaryBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("fortressBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("specialBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("wonderBuildingsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	

	left = 50;
	width = 100;
	getGUIObjectByName("playerName2Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("unitsHeading").size = left + " 16 " + (left + width * 7 + 20) + " 100%";
	getGUIObjectByName("totalUnitsHeading").size = left + " 34 " + (left + width + 20) + " 100%"; left += width + 20;
	getGUIObjectByName("infantryUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("workerUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("cavalryUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("championUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("heroesUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("navyUnitsHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;

	left = 50;
	width = 100;
	getGUIObjectByName("playerName3Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("civCentresBuiltHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("enemyCivCentresDestroyedHeading").size = left +  " 6 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("mapExplorationHeading").size = left +  " 16 " + (left + width) + " 100%"; left += width;

	left = 50;
	width = 100;
	getGUIObjectByName("playerName4Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("resourceHeading").size = left + " 16 " + (left + width * 5 + 10) + " 100%";
	getGUIObjectByName("foodGatheredHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("woodGatheredHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("stoneGatheredHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("metalGatheredHeading").size = left + " 34 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("totalGatheredHeading").size = left + " 34 " + (left + width + 10) + " 100%"; left += width + 10;
	getGUIObjectByName("treasuresCollectedHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("resourcesTributedHeading").size = left + " 16 " + (left + tributesWidth) + " 100%"; left += tributesWidth;

	left = 50;
	width = 100;
	getGUIObjectByName("playerName5Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("exchangedFoodHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("exchangedWoodHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("exchangedStoneHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("exchangedMetalHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("barterEfficiencyHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("tradeIncomeHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	
	left = 50;
	width = 100;
	getGUIObjectByName("playerName6Heading").size = left + " 26 " + (left + playerNameHeadingWidth) + " 100%"; left += playerNameHeadingWidth;
	getGUIObjectByName("vegetarianRatioHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("feminisationHeading").size = left + " 26 " + (left + width) + " 100%"; left += width;
	getGUIObjectByName("killDeathRatioHeading").size = left + " 16 " + (left + width) + " 100%"; left += width;
	
	
	// Show counters
	for (var i = 0; i < MAX_SLOTS; ++i)
	{
		if (i < maxPlayers)
		{
			var playerState = data.playerStates[i+1];

			for (var k = 0; k < panelNames.length; ++k)
			{
				var playerBox = getGUIObjectByName("playerBox"+k+"["+i+"]");
				playerBox.hidden = false;

				var colourString = "colour: "
					+ Math.floor(playerState.colour.r * 255) + " "
					+ Math.floor(playerState.colour.g * 255) + " "
					+ Math.floor(playerState.colour.b * 255);
				playerBox.sprite = colourString + " 32";
				var playerColourBox = getGUIObjectByName("playerColourBox"+k+"["+i+"]");
				playerColourBox.sprite = colourString + " 255";

				// Show the multiplayer name, e.g. "Foobar" rather than "Player 1".
				// TODO: Perhaps show both the multiplayer and map-specific name?
				var playerName = getGUIObjectByName("playerName"+k+"["+i+"]");
				playerName.caption = data.players[i+1].name;

				getGUIObjectByName("civIcon"+k+"["+i+"]").sprite = "stretched:"+civData[playerState.civ].Emblem;
				getGUIObjectByName("civIcon"+k+"["+i+"]").tooltip = civData[playerState.civ].Name;
			}

			var economyScore = getGUIObjectByName("economyScore["+i+"]");
			var militaryScore = getGUIObjectByName("militaryScore["+i+"]");
			var explorationScore = getGUIObjectByName("explorationScore["+i+"]");
			var totalScore = getGUIObjectByName("totalScore["+i+"]");
			
			var totalBuildings = getGUIObjectByName("totalBuildings["+i+"]");
			var houseBuildings = getGUIObjectByName("houseBuildings["+i+"]");
			var economicBuildings = getGUIObjectByName("economicBuildings["+i+"]");
			var outpostBuildings = getGUIObjectByName("outpostBuildings["+i+"]");
			var militaryBuildings = getGUIObjectByName("militaryBuildings["+i+"]");
			var fortressBuildings = getGUIObjectByName("fortressBuildings["+i+"]");
			var specialBuildings = getGUIObjectByName("specialBuildings["+i+"]");
			var wonderBuildings = getGUIObjectByName("wonderBuildings["+i+"]");

			var totalUnits = getGUIObjectByName("totalUnits["+i+"]");
			var infantryUnits = getGUIObjectByName("infantryUnits["+i+"]");
			var workerUnits = getGUIObjectByName("workerUnits["+i+"]");
			var cavalryUnits = getGUIObjectByName("cavalryUnits["+i+"]");
			var championUnits = getGUIObjectByName("championUnits["+i+"]");
			var heroesUnits = getGUIObjectByName("heroesUnits["+i+"]");
			var navyUnits = getGUIObjectByName("navyUnits["+i+"]");

			var civCentresBuilt = getGUIObjectByName("civCentresBuilt["+i+"]");
			var enemyCivCentresDestroyed = getGUIObjectByName("enemyCivCentresDestroyed["+i+"]");
			var mapExploration = getGUIObjectByName("mapExploration["+i+"]");

			var foodGathered = getGUIObjectByName("foodGathered["+i+"]");
			var woodGathered = getGUIObjectByName("woodGathered["+i+"]");
			var stoneGathered = getGUIObjectByName("stoneGathered["+i+"]");
			var metalGathered = getGUIObjectByName("metalGathered["+i+"]");
			var totalGathered = getGUIObjectByName("totalGathered["+i+"]");
			var treasuresCollected = getGUIObjectByName("treasuresCollected["+i+"]");
			var resourcesTributed = getGUIObjectByName("resourcesTributed["+i+"]");

			var exchangedFood = getGUIObjectByName("exchangedFood["+i+"]");
			var exchangedWood = getGUIObjectByName("exchangedWood["+i+"]");
			var exchangedStone = getGUIObjectByName("exchangedStone["+i+"]");
			var exchangedMetal = getGUIObjectByName("exchangedMetal["+i+"]");
			var barterEfficiency = getGUIObjectByName("barterEfficiency["+i+"]");
			var tradeIncome = getGUIObjectByName("tradeIncome["+i+"]");
			
			var vegetarianRatio = getGUIObjectByName("vegetarianRatio["+i+"]");
			var feminisationRatio = getGUIObjectByName("feminisation["+i+"]");
			var killDeathRatio = getGUIObjectByName("killDeathRatio["+i+"]");

			// align counters

			left = 240;
			width = 100;
			economyScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			militaryScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			explorationScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			totalScore.size = left + " 2 " + (left + width) + " 100%"; left += width;
			var size = getGUIObjectByName("playerBox0["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox0["+i+"]").size = size;
			
			left = 240;
			width = 85;
			totalBuildings.size = left + " 2 " + (left + width + 20) + " 100%"; left += width + 20;
			houseBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			economicBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			outpostBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			militaryBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			fortressBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			specialBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			wonderBuildings.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox1["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox1["+i+"]").size = size;
			
			left = 240;
			width = 100;
			totalUnits.size = left + " 2 " + (left + width + 20) + " 100%"; left += width + 20;
			infantryUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			workerUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			cavalryUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			championUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			heroesUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			navyUnits.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox2["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox2["+i+"]").size = size;

			left = 240;
			width = 100;
			civCentresBuilt.size = left + " 2 " + (left + width) + " 100%"; left += width;
			enemyCivCentresDestroyed.size = left + " 2 " + (left + width) + " 100%"; left += width;
			mapExploration.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox3["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox3["+i+"]").size = size;

			left = 240;
			width = 100;
			foodGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			woodGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			stoneGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			metalGathered.size = left + " 2 " + (left + width) + " 100%"; left += width;
			totalGathered.size = left + " 2 " + (left + width + 10) + " 100%"; left += width + 10;
			treasuresCollected.size	= left + " 2 " + (left + width) + " 100%"; left += width;
			resourcesTributed.size = left + " 2 " + (left + tributesWidth) + " 100%"; left += tributesWidth;
			size = getGUIObjectByName("playerBox4["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox4["+i+"]").size = size;

			left = 240;
			width = 100;
			exchangedFood.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedWood.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedStone.size = left + " 2 " + (left + width) + " 100%"; left += width;
			exchangedMetal.size = left + " 2 " + (left + width) + " 100%"; left += width;
			barterEfficiency.size = left + " 2 " + (left + width) + " 100%"; left += width;
			tradeIncome.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size = getGUIObjectByName("playerBox5["+i+"]").size;
			size.right = left + 10;
			getGUIObjectByName("playerBox5["+i+"]").size = size;
			
			left = 240;
			width = 100;
			size = getGUIObjectByName("playerBox6["+i+"]").size;
			vegetarianRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			feminisationRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			killDeathRatio.size = left + " 2 " + (left + width) + " 100%"; left += width;
			size.right = left + 10;
			getGUIObjectByName("playerBox6["+i+"]").size = size;

			// display counters
			economyScore.caption = Math.round((playerState.statistics.resourcesGathered.food + playerState.statistics.resourcesGathered.wood + 
				playerState.statistics.resourcesGathered.stone + playerState.statistics.resourcesGathered.metal) / 10);
			militaryScore.caption = Math.round((playerState.statistics.enemyUnitsKilledValue + playerState.statistics.enemyBuildingsDestroyedValue) / 10);
			explorationScore.caption = playerState.statistics.percentMapExplored * 10;
			totalScore.caption = Number(economyScore.caption) + Number(militaryScore.caption) + Number(explorationScore.caption);
			
			// colours used for buildings and units
			const TRAINED_COLOR = '[color="201 255 200"]';
			const LOST_COLOR = '[color="255 213 213"]';
			const KILLED_COLOR = '[color="196 198 255"]'; 
			
			totalBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.total + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.total + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.total + "[/color]";
			houseBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.houses + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.houses + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.houses + "[/color]";
			economicBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.economic + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.economic + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.economic + "[/color]";
			outpostBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.outposts + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.outposts + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.outposts + "[/color]";
			militaryBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.military + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.military + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.military + "[/color]";
			fortressBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.fortresses + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.fortresses + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.fortresses + "[/color]";
			specialBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.special + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.special + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.special + "[/color]";
			wonderBuildings.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.wonders + "[/color] / " +
				LOST_COLOR + playerState.statistics.buildingsLost.wonders + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyBuildingsDestroyed.wonders + "[/color]";
				
			
			totalUnits.caption = TRAINED_COLOR + playerState.statistics.buildingsConstructed.total + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.total + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.total + "[/color]";
			infantryUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.infantry + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.infantry + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.infantry + "[/color]";
			workerUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.workers + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.workers + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.workers + "[/color]";
			cavalryUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.cavalry + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.cavalry + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.cavalry + "[/color]";
			championUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.champion + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.champion + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.champion + "[/color]";
			heroesUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.heroes + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.heroes + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.heroes + "[/color]";
			navyUnits.caption = TRAINED_COLOR + playerState.statistics.unitsTrained.navy + "[/color] / " +
				LOST_COLOR + playerState.statistics.unitsLost.navy + "[/color] / " +
				KILLED_COLOR + playerState.statistics.enemyUnitsKilled.navy + "[/color]";

			civCentresBuilt.caption = playerState.statistics.civCentresBuilt;
			enemyCivCentresDestroyed.caption = playerState.statistics.enemyCivCentresDestroyed;
			mapExploration.caption = playerState.statistics.percentMapExplored + "%";

			// colours used for gathered and traded resources
			const SOLD_COLOR = '[color="201 255 200"]';
			const BOUGHT_COLOR = '[color="255 213 213"]';
			foodGathered.caption = SOLD_COLOR + playerState.statistics.resourcesGathered.food + "[/color] / " +
				BOUGHT_COLOR + (playerState.statistics.resourcesUsed.food - playerState.statistics.resourcesSold.food) + "[/color]";
			woodGathered.caption = SOLD_COLOR + playerState.statistics.resourcesGathered.wood + "[/color] / " +
				BOUGHT_COLOR + (playerState.statistics.resourcesUsed.wood - playerState.statistics.resourcesSold.wood) + "[/color]";
			stoneGathered.caption = SOLD_COLOR + playerState.statistics.resourcesGathered.stone + "[/color] / " +
				BOUGHT_COLOR + (playerState.statistics.resourcesUsed.stone - playerState.statistics.resourcesSold.stone) + "[/color]";
			metalGathered.caption = SOLD_COLOR + playerState.statistics.resourcesGathered.metal + "[/color] / " +
				BOUGHT_COLOR + (playerState.statistics.resourcesUsed.metal - playerState.statistics.resourcesSold.metal) + "[/color]";
			totalGathered.caption =	SOLD_COLOR +
				(playerState.statistics.resourcesGathered.food +
				playerState.statistics.resourcesGathered.wood +
				playerState.statistics.resourcesGathered.stone +
				playerState.statistics.resourcesGathered.metal) + "[/color] / " +
				BOUGHT_COLOR +
				((playerState.statistics.resourcesUsed.food - playerState.statistics.resourcesSold.food) +
				(playerState.statistics.resourcesUsed.wood - playerState.statistics.resourcesSold.wood) +
				(playerState.statistics.resourcesUsed.stone - playerState.statistics.resourcesSold.stone) +
				(playerState.statistics.resourcesUsed.metal - playerState.statistics.resourcesSold.metal)) + "[/color]";
			treasuresCollected.caption = playerState.statistics.treasuresCollected;
			resourcesTributed.caption = SOLD_COLOR + playerState.statistics.tributesSent + "[/color] / " +
				BOUGHT_COLOR + playerState.statistics.tributesReceived + "[/color]";

			exchangedFood.caption = SOLD_COLOR + '+' + playerState.statistics.resourcesBought.food
				+ '[/color] ' + BOUGHT_COLOR + '-' + playerState.statistics.resourcesSold.food + '[/color]';
			exchangedWood.caption = SOLD_COLOR + '+' + playerState.statistics.resourcesBought.wood
				+ '[/color] ' + BOUGHT_COLOR + '-' + playerState.statistics.resourcesSold.wood + '[/color]';
			exchangedStone.caption = SOLD_COLOR + '+' + playerState.statistics.resourcesBought.stone
				+ '[/color] ' + BOUGHT_COLOR + '-' + playerState.statistics.resourcesSold.stone + '[/color]';
			exchangedMetal.caption = SOLD_COLOR + '+' + playerState.statistics.resourcesBought.metal
				+ '[/color] ' + BOUGHT_COLOR + '-' + playerState.statistics.resourcesSold.metal + '[/color]';
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
			killDeathRatio.caption = Math.round((playerState.statistics.enemyUnitsKilled["total"] > 0 ?
				(playerState.statistics.enemyUnitsKilled["total"] / playerState.statistics.unitsLost["total"]) : 0)*100)/100;
		}
		else
		{
			// hide player boxes
			for (var k = 0; k < panelNames.length; ++k)
			{
				var playerBox = getGUIObjectByName("playerBox"+k+"["+i+"]");
				playerBox.hidden = true;
			}
		}
	}

	selectPanel(0);
}

function onTick()
{
}
