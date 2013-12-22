// Max player slots for any map (should read from config)
const MAX_SLOTS = 8;

/**
 * Select active panel
 * @param panelNumber Number of panel, which should get active state (integer)
 */
function selectPanel(panelNumber)
{
	var panelNames = [ 'scorePanel', 'buildingsPanel', 'unitsPanel', 'resourcesPanel', 'marketPanel', 'miscPanel' ];
	
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
	// LOCAL CONSTS, VARIABLES & FUNCTIONS
	//const for filtering long collective headings
	const LONG_HEADING_WIDTH = 250;
	//number of panels
	const PANELS_COUNT = 6;
	//alpha for player box
	const PLAYER_BOX_ALPHA = " 32";
	//alpha for player colour box
	const PLAYER_COLOUR_BOX_ALPHA = " 255";
	//yStart value for spaceing teams boxes (and noTeamsBox)
	const TEAMS_BOX_Y_START = 65;
	//vertical size of player box
	const PLAYER_BOX_Y_SIZE = 30;
	//gap between players boxes
	const PLAYER_BOX_GAP = 2;
	
	// colours used for units and buildings
	const TRAINED_COLOR = '[color="201 255 200"]';
	const LOST_COLOR = '[color="255 213 213"]';
	const KILLED_COLOR = '[color="196 198 255"]';

	// colours used for gathered and traded resources
	const SOLD_COLOR = '[color="201 255 200"]';
	const BOUGHT_COLOR = '[color="255 213 213"]';
	
	var panels = {
		"score": {		// score panel
			"headings": {	// headings on score panel
				"playerName0Heading":      { "yStart": 26, "width": 200 },
				"economyScoreHeading":     { "yStart": 16, "width": 100 },
				"militaryScoreHeading":    { "yStart": 16, "width": 100 },
				"explorationScoreHeading": { "yStart": 16, "width": 100 },
				"totalScoreHeading":       { "yStart": 16, "width": 100 }
			},
			"counters": {	// counters on score panel
				"economyScore":     {"width": 100, "objects": [ ] },
				"militaryScore":    {"width": 100, "objects": [ ] },
				"explorationScore": {"width": 100, "objects": [ ] },
				"totalScore":       {"width": 100, "objects": [ ] }
			}
		},
		"buildings": {		// buildings panel
			"headings": {	// headings on buildings panel
				"playerName1Heading":        {"yStart": 26, "width": 200 },
				"buildingsHeading":          {"yStart": 16, "width": (85 * 7 + 105) },	//width = 735
				"totalBuildingsHeading":     {"yStart": 34, "width": 105 },
				"houseBuildingsHeading":     {"yStart": 34, "width": 85 },
				"economicBuildingsHeading":  {"yStart": 34, "width": 85 },
				"outpostBuildingsHeading":   {"yStart": 34, "width": 85 },
				"militaryBuildingsHeading":  {"yStart": 34, "width": 85 },
				"fortressBuildingsHeading":  {"yStart": 34, "width": 85 },
				"civCentreBuildingsHeading": {"yStart": 34, "width": 85 },
				"wonderBuildingsHeading":    {"yStart": 34, "width": 85 }
			},
			"counters": {	// counters on buildings panel
				"totalBuildings":     {"width": 105, "objects": [ ] },
				"houseBuildings":     {"width": 85,  "objects": [ ] },
				"economicBuildings":  {"width": 85,  "objects": [ ] },
				"outpostBuildings":   {"width": 85,  "objects": [ ] },
				"militaryBuildings":  {"width": 85,  "objects": [ ] },
				"fortressBuildings":  {"width": 85,  "objects": [ ] },
				"civCentreBuildings": {"width": 85,  "objects": [ ] },
				"wonderBuildings":    {"width": 85,  "objects": [ ] }
			}
		},
		"units": {		// units panel
			"headings": {	// headings on units panel
				"playerName2Heading":   {"yStart": 26, "width": 200 },
				"unitsHeading":         {"yStart": 16, "width": (100 * 6 + 120) },	//width = 720
				"totalUnitsHeading":    {"yStart": 34, "width": 120 },
				"infantryUnitsHeading": {"yStart": 34, "width": 100 },
				"workerUnitsHeading":   {"yStart": 34, "width": 100 },
				"cavalryUnitsHeading":  {"yStart": 34, "width": 100 },
				"championUnitsHeading": {"yStart": 34, "width": 100 },
				"heroesUnitsHeading":   {"yStart": 34, "width": 100 },
				"navyUnitsHeading":     {"yStart": 34, "width": 100 }
			},
			"counters": {	// counters on units panel
				"totalUnits":    {"width": 120, "objects": [ ] },
				"infantryUnits": {"width": 100, "objects": [ ] },
				"workerUnits":   {"width": 100, "objects": [ ] },
				"cavalryUnits":  {"width": 100, "objects": [ ] },
				"championUnits": {"width": 100, "objects": [ ] },
				"heroesUnits":   {"width": 100, "objects": [ ] },
				"navyUnits":     {"width": 100, "objects": [ ] }
			}
		},
		"resources": {		// resources panel
			"headings": {	// headings on resources panel
				"playerName3Heading":        {"yStart": 26, "width": 200 },
				"resourceHeading":           {"yStart": 16, "width": (100 * 4 + 110) },//width = 510
				"foodGatheredHeading":       {"yStart": 34, "width": 100 },
				"woodGatheredHeading":       {"yStart": 34, "width": 100 },
				"stoneGatheredHeading":      {"yStart": 34, "width": 100 },
				"metalGatheredHeading":      {"yStart": 34, "width": 100 },
				"totalGatheredHeading":      {"yStart": 34, "width": 110 },
				"treasuresCollectedHeading": {"yStart": 16, "width": 100 },
				"resourcesTributedHeading":  {"yStart": 16, "width": 121 }
			},
			"counters": {	// counters on resources panel
				"foodGathered":       {"width": 100, "objects": [ ] },
				"woodGathered":       {"width": 100, "objects": [ ] },
				"stoneGathered":      {"width": 100, "objects": [ ] },
				"metalGathered":      {"width": 100, "objects": [ ] },
				"totalGathered":      {"width": 110, "objects": [ ] },
				"treasuresCollected": {"width": 100, "objects": [ ] },
				"resourcesTributed":  {"width": 121, "objects": [ ] }
			}
		},
		"market": {		// market panel
			"headings": {	// headings on market panel
				"playerName4Heading":      {"yStart": 26, "width": 200 },
				"exchangedFoodHeading":    {"yStart": 16, "width": 100 },
				"exchangedWoodHeading":    {"yStart": 16, "width": 100 },
				"exchangedStoneHeading":   {"yStart": 16, "width": 100 },
				"exchangedMetalHeading":   {"yStart": 16, "width": 100 },
				"barterEfficiencyHeading": {"yStart": 16, "width": 100 },
				"tradeIncomeHeading":      {"yStart": 16, "width": 100 }
			},
			"counters": {	// counters on market panel
				"exchangedFood":    {"width": 100, "objects": [ ] },
				"exchangedWood":    {"width": 100, "objects": [ ] },
				"exchangedStone":   {"width": 100, "objects": [ ] },
				"exchangedMetal":   {"width": 100, "objects": [ ] },
				"barterEfficiency": {"width": 100, "objects": [ ] },
				"tradeIncome":      {"width": 100, "objects": [ ] }
			}
		},
		"miscelanous": {	// miscelanous panel
			"headings": {	// headings on miscelanous panel
				"playerName5Heading":     {"yStart": 26, "width": 200 },
				"vegetarianRatioHeading": {"yStart": 16, "width": 100 },
				"feminisationHeading":    {"yStart": 26, "width": 100 },
				"killDeathRatioHeading":  {"yStart": 16, "width": 100 },
				"mapExplorationHeading":  {"yStart": 16, "width": 100 }
			},
			"counters": {	// counters on miscelanous panel
				"vegetarianRatio": {"width": 100, "objects": [ ] },
				"feminisation":    {"width": 100, "objects": [ ] },
				"killDeathRatio":  {"width": 100, "objects": [ ] },
				"mapExploration":  {"width": 100, "objects": [ ] }
			}
		}
	};
	
	function alignHeaders(headings)
	{		
		left = 50;
		for (var h in headings)
		{
			getGUIObjectByName(h).size = left + " " + headings[h].yStart + " " + (left + headings[h].width) + " 100%";
			if (headings[h].width < LONG_HEADING_WIDTH)
				left += headings[h].width;			
		}
	}
	
	function alignCounters(counters, player)
	{
		left = 240;
		for (var c in counters)
		{
			counters[c].objects[player].size = left + " 2 " + (left + counters[c].width) + " 100%";
			left += counters[c].width;
		}
		
		return left;
	}
	

	
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
	
	// FUNCTION BODY
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
	for (var p in panels)	//for all panels
	{
		alignHeaders(panels[p].headings);
	}

	// TODO set maxPlayers as playerCounters.length
	var maxPlayers = data.playerStates.length - 1;
	var maxTeams = 0;

	var teams = [ ];
	if (data.mapSettings.LockTeams)	//teams ARE locked
	{
		//count teams
		for(var t = 0; t <= maxPlayers; ++t)
		{
			if (!teams[data.playerStates[t+1].team])
			{
				teams[data.playerStates[t+1].team] = 1;
				continue;
			}
			teams[data.playerStates[t+1].team]++;
		}
		
		if (teams.length == maxPlayers)
			teams = false;	//Each player has his own team. Displaying teams makes no sense.
	}
	else				//teams are NOT locked
		teams = false;

	// Erase teams data if teams are not displayed
	if (!teams)
	{
		for(var p = 0; p < maxPlayers; ++p)
		{
			data.playerStates[p+1].team = -1;
		}
	}
	
	// Count players without team	(or all if teams are not displayed)
	var withoutTeam = maxPlayers;

	if (!teams)	//teams are NOT displayed
	{
		// Show boxes for no teams
		for (var b = 0; b < PANELS_COUNT; ++b)
		{
			getGUIObjectByName("noTeamsBox"+b).hidden = false;			
		}
		
		// Space player boxes
		var boxSpacing = 32;
		
		for (var i = 0; i < maxPlayers; ++i)
		{
			var playerState = data.playerStates[i+1];
			
			for (var j = 0; j < PANELS_COUNT; ++j)
			{
				var playerBox = getGUIObjectByName("playerBox"+j+"["+i+"]");
				playerBox.hidden = false;
				
				var boxSize = playerBox.size;
				var h = boxSize.bottom - boxSize.top;
				boxSize.top = i * boxSpacing;
				boxSize.bottom = i * boxSpacing + h;
				playerBox.size = boxSize;

				var colourString = "colour: "
					+ Math.floor(playerState.colour.r * 255) + " "
					+ Math.floor(playerState.colour.g * 255) + " "
					+ Math.floor(playerState.colour.b * 255);
				
				playerBox.sprite = colourString + PLAYER_BOX_ALPHA;
				
				var playerColourBox = getGUIObjectByName("playerColourBox"+j+"["+i+"]");
				playerColourBox.sprite = colourString + PLAYER_COLOUR_BOX_ALPHA;
				
				// Show the multiplayer name, e.g. "Foobar" rather than "Player 1".
				// TODO: Perhaps show both the multiplayer and map-specific name?
				var playerName = getGUIObjectByName("playerName"+j+"["+i+"]");
				playerName.caption = data.players[i+1].name;
				
				getGUIObjectByName("civIcon"+j+"["+i+"]").sprite = "stretched:"+civData[playerState.civ].Emblem;
				getGUIObjectByName("civIcon"+j+"["+i+"]").tooltip = civData[playerState.civ].Name;
			}
		}
	}
	else	// teams ARE displayed
	{
		//TODO!
		
		//getGUIObjectByName("playerName0Heading").caption = "";
	}

	// Show counters
	
	var tn = "";
	if (teams)
	{
		var team_number = 1;
		tn = "t"+team_number+"p";
	}
	// get counters
	for (var i = 0; i < maxPlayers; ++i)	//for all players
	{
		for (var p in panels)	//for all panels
		{
			for (var c in panels[p].counters)	//for all counters in panel
			{
				// get counter
				panels[p].counters[c].objects[i] = getGUIObjectByName(c+tn+"["+i+"]");
			}
		}
	}
	
	// align counters
	for (var i = 0; i < maxPlayers; ++i)	//for all players
	{
		var pn = 0;
		for (var p in panels)	//for all panels
		{
			var l = alignCounters(panels[p].counters, i);
			var size = getGUIObjectByName("playerBox"+pn+tn+"["+i+"]").size;
			size.right = l + 10;
			getGUIObjectByName("playerBox"+pn+tn+"["+i+"]").size = size;
			pn++;
		}
	}
	
	//display counters
	for (var i = 0; i < maxPlayers; ++i)	//for all players
	{
		playerState = data.playerStates[i+1];
		
		panels.score.counters.economyScore.objects[i].caption = Math.round(playerState.statistics.resourcesGathered.total / 10);
		panels.score.counters.militaryScore.objects[i].caption = Math.round((playerState.statistics.enemyUnitsKilledValue +
			playerState.statistics.enemyBuildingsDestroyedValue) / 10);
		panels.score.counters.explorationScore.objects[i].caption = playerState.statistics.percentMapExplored * 10;
		panels.score.counters.totalScore.objects[i].caption = Number(panels.score.counters.economyScore.objects[i].caption) +
			Number(panels.score.counters.militaryScore.objects[i].caption) +
			Number(panels.score.counters.explorationScore.objects[i].caption);

		panels.buildings.counters.totalBuildings.objects[i].caption = captionBuildings("total");
		panels.buildings.counters.houseBuildings.objects[i].caption = captionBuildings("House");
		panels.buildings.counters.economicBuildings.objects[i].caption = captionBuildings("Economic");
		panels.buildings.counters.outpostBuildings.objects[i].caption = captionBuildings("Outpost");
		panels.buildings.counters.militaryBuildings.objects[i].caption = captionBuildings("Military");
		panels.buildings.counters.fortressBuildings.objects[i].caption = captionBuildings("Fortress");
		panels.buildings.counters.civCentreBuildings.objects[i].caption = captionBuildings("CivCentre");
		panels.buildings.counters.wonderBuildings.objects[i].caption = captionBuildings("Wonder");

		panels.units.counters.totalUnits.objects[i].caption = captionUnits("total");
		panels.units.counters.infantryUnits.objects[i].caption = captionUnits("Infantry");
		panels.units.counters.workerUnits.objects[i].caption = captionUnits("Worker");
		panels.units.counters.cavalryUnits.objects[i].caption = captionUnits("Cavalry");
		panels.units.counters.championUnits.objects[i].caption = captionUnits("Champion");
		panels.units.counters.heroesUnits.objects[i].caption = captionUnits("Hero");
		panels.units.counters.navyUnits.objects[i].caption = captionUnits("Ship");

		panels.resources.counters.foodGathered.objects[i].caption = captionResourcesGathered("food");
		panels.resources.counters.woodGathered.objects[i].caption = captionResourcesGathered("wood");
		panels.resources.counters.stoneGathered.objects[i].caption = captionResourcesGathered("stone");
		panels.resources.counters.metalGathered.objects[i].caption = captionResourcesGathered("metal");
		panels.resources.counters.totalGathered.objects[i].caption =	captionResourcesGathered("total");
		panels.resources.counters.treasuresCollected.objects[i].caption = playerState.statistics.treasuresCollected;
		panels.resources.counters.resourcesTributed.objects[i].caption = SOLD_COLOR + playerState.statistics.tributesSent +
			"[/color] / " + BOUGHT_COLOR + playerState.statistics.tributesReceived + "[/color]";

		panels.market.counters.exchangedFood.objects[i].caption = captionResourcesExchanged("food");
		panels.market.counters.exchangedWood.objects[i].caption = captionResourcesExchanged("wood");
		panels.market.counters.exchangedStone.objects[i].caption = captionResourcesExchanged("stone");
		panels.market.counters.exchangedMetal.objects[i].caption = captionResourcesExchanged("metal");
		var totalBought = 0;
		for each (var boughtAmount in playerState.statistics.resourcesBought)
			totalBought += boughtAmount;
		var totalSold = 0;
		for each (var soldAmount in playerState.statistics.resourcesSold)
			totalSold += soldAmount;
		panels.market.counters.barterEfficiency.objects[i].caption = Math.floor(totalSold > 0 ? (totalBought / totalSold) * 100 : 0) + "%";
		panels.market.counters.tradeIncome.objects[i].caption = playerState.statistics.tradeIncome;

		panels.miscelanous.counters.vegetarianRatio.objects[i].caption = Math.floor(playerState.statistics.resourcesGathered.food > 0 ?
			(playerState.statistics.resourcesGathered.vegetarianFood / playerState.statistics.resourcesGathered.food) * 100 : 0) + "%";
		panels.miscelanous.counters.feminisation.objects[i].caption = playerState.statistics.feminisation + "%";
		panels.miscelanous.counters.killDeathRatio.objects[i].caption = Math.round((playerState.statistics.enemyUnitsKilled.total > 0 ?
			(playerState.statistics.enemyUnitsKilled.total / playerState.statistics.unitsLost.total) : 0)*100)/100;
		panels.miscelanous.counters.mapExploration.objects[i].caption = playerState.statistics.percentMapExplored + "%";
	}

	selectPanel(0);
}

function onTick()
{
}
