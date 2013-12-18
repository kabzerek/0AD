function StatisticsTracker() {}

StatisticsTracker.prototype.Schema =
	"<a:component type='system'/><empty/>";

StatisticsTracker.prototype.Init = function()
{
	// units
	this.unitsTrained = {
			"infantry": 0,
			"workers": 0,
			"females": 0,
			"cavalry": 0,
			"champion": 0,
			"heroes": 0,
			"navy": 0,
			"total": 0
	};
	this.unitsLost = {
			"infantry": 0,
			"workers": 0,
			"females": 0,
			"cavalry": 0,
			"champion": 0,
			"heroes": 0,
			"navy": 0,
			"total": 0
	};
	this.unitsLostValue = 0;
	this.enemyUnitsKilled = {
			"infantry": 0,
			"workers": 0,
			"females": 0,
			"cavalry": 0,
			"champion": 0,
			"heroes": 0,
			"navy": 0,
			"total": 0
	};
	this.enemyUnitsKilledValue = 0;
	//buildings
	this.buildingsConstructed = {
		"houses": 0,
		"economic": 0,
		"outposts": 0,
		"military": 0,
		"fortresses": 0,
		"special": 0,
		"wonders": 0,
		"total": 0	
	};
	this.buildingsLost = {
		"houses": 0,
		"economic": 0,
		"outposts": 0,
		"military": 0,
		"fortresses": 0,
		"special": 0,
		"wonders": 0,
		"total": 0
		};
	this.buildingsLostValue = 0;
	this.enemyBuildingsDestroyed = {
		"houses": 0,
		"economic": 0,
		"outposts": 0,
		"military": 0,
		"fortresses": 0,
		"special": 0,
		"wonders": 0,
		"total": 0
		};
	this.enemyBuildingsDestroyedValue = 0;
	// civ centres
	this.civCentresBuilt = 0;
	this.enemyCivCentresDestroyed = 0;
	// resources
	this.resourcesGathered = {
			"total": 0,
			"food": 0,
			"wood": 0,
			"metal": 0,
			"stone": 0,
			"vegetarianFood": 0
	};
	this.resourcesUsed = {
			"total": 0,
			"food": 0,
			"wood": 0,
			"metal": 0,
			"stone": 0
	};
	this.resourcesSold = {
			"total": 0,
			"food": 0,
			"wood": 0,
			"metal": 0,
			"stone": 0
	};
	this.resourcesBought = {
			"total": 0,
			"food": 0,
			"wood": 0,
			"metal": 0,
			"stone": 0
	};
	this.tributesSent = 0;
	this.tributesReceived = 0;
	this.tradeIncome = 0;
	this.treasuresCollected = 0;
};

StatisticsTracker.prototype.GetStatistics = function()
{
	return {
		"unitsTrained": this.unitsTrained,
		"unitsLost": this.unitsLost,
		"unitsLostValue": this.unitsLostValue,
		"enemyUnitsKilled": this.enemyUnitsKilled,
		"enemyUnitsKilledValue": this.enemyUnitsKilledValue,
		"buildingsConstructed": this.buildingsConstructed,
		"buildingsLost": this.buildingsLost,
		"buildingsLostValue": this.buildingsLostValue,
		"enemyBuildingsDestroyed": this.enemyBuildingsDestroyed,
		"enemyBuildingsDestroyedValue": this.enemyBuildingsDestroyedValue,
		"civCentresBuilt": this.civCentresBuilt,
		"enemyCivCentresDestroyed": this.enemyCivCentresDestroyed,
		"resourcesGathered": this.resourcesGathered,
		"resourcesUsed": this.resourcesUsed,
		"resourcesSold": this.resourcesSold,
		"resourcesBought": this.resourcesBought,
		"tributesSent": this.tributesSent,
		"tributesReceived": this.tributesReceived,
		"tradeIncome": this.tradeIncome,
		"treasuresCollected": this.treasuresCollected,
		"percentMapExplored": this.GetPercentMapExplored(),
		"feminisation": this.GetFeminisation()
	};
};

/**
 *Increments counter associated with certain entity/counter and type of given entity.
 *@param entity Variable containing a class by which the unit is being identified
 *@param counter name of counter (e.g. "unitsTrained")
 *@param type the type of the counter (e.g. "workers")
 */
StatisticsTracker.prototype.CounterIncrement = function(entity, counter, type)
{
	if (entity)
		this[counter][type]++;
};

/** 
 * Counts the total number of units trained as well as an individual count for 
 * each unit type. Based on templates.
 * @param trainedUnit The unit that has been trained 
 */ 
StatisticsTracker.prototype.IncreaseTrainedUnitsCounter = function(trainedUnit)
{
	var cmpUnitEntityIdentity = Engine.QueryInterface(trainedUnit, IID_Identity);

	if (cmpUnitEntityIdentity)
	{
		var unitIsInfantry = cmpUnitEntityIdentity.HasClass("Infantry");
		var unitIsWorker = cmpUnitEntityIdentity.HasClass("Worker");
		var unitIsFemale = cmpUnitEntityIdentity.HasClass("Female");
		var unitIsCavalry = cmpUnitEntityIdentity.HasClass("Cavalry");
		var unitIsChampion = cmpUnitEntityIdentity.HasClass("Champion");
		var unitIsHero = cmpUnitEntityIdentity.HasClass("Hero");
		var unitIsNavy = cmpUnitEntityIdentity.HasClass("Ship");
		
		this.CounterIncrement(unitIsInfantry, "unitsTrained", "infantry");
		this.CounterIncrement(unitIsWorker, "unitsTrained", "workers");
		this.CounterIncrement(unitIsFemale, "unitsTrained", "females");
		this.CounterIncrement(unitIsCavalry, "unitsTrained", "cavalry");
		this.CounterIncrement(unitIsChampion, "unitsTrained", "champion");
		this.CounterIncrement(unitIsHero, "unitsTrained", "heroes");
		this.CounterIncrement(unitIsNavy, "unitsTrained", "navy");
		this.unitsTrained["total"]++;
	}
};

StatisticsTracker.prototype.GetFeminisation = function()
{
	return Math.floor(this.unitsTrained["females"] > 0 ? (this.unitsTrained["females"] / this.unitsTrained["workers"]) * 100 : 0)
};


/** 
 * Counts the total number of buildings constructed as well as an individual count for 
 * each building type. Based on templates.
 * @param constructedBuilding The building that has been constructed 
 */ 
StatisticsTracker.prototype.IncreaseConstructedBuildingsCounter = function(constructedBuilding)
{
	var cmpBuildingEntityIdentity = Engine.QueryInterface(constructedBuilding, IID_Identity);
		
	if (cmpBuildingEntityIdentity)
	{
		var buildingIsHouse = cmpBuildingEntityIdentity.HasClass("House");
		var buildingIsEconomic = cmpBuildingEntityIdentity.HasClass("Economic");
		var buildingIsOutpost = cmpBuildingEntityIdentity.HasClass("Outpost");
		var buildingIsMilitary = cmpBuildingEntityIdentity.HasClass("Military");
		var buildingIsFortress = cmpBuildingEntityIdentity.HasClass("Fortress");
		var buildingIsSpecial = cmpBuildingEntityIdentity.HasClass("SpecialBuilding");
		var buildingIsWonder = cmpBuildingEntityIdentity.HasClass("Wonder");
		
		this.CounterIncrement(buildingIsHouse, "buildingsConstructed", "houses");
		this.CounterIncrement(buildingIsEconomic, "buildingsConstructed", "economic");
		this.CounterIncrement(buildingIsOutpost, "buildingsConstructed", "outposts");
		this.CounterIncrement(buildingIsMilitary, "buildingsConstructed", "military");
		this.CounterIncrement(buildingIsFortress, "buildingsConstructed", "fortresses");
		this.CounterIncrement(buildingIsSpecial, "buildingsConstructed", "special");
		this.CounterIncrement(buildingIsWonder, "buildingsConstructed", "wonders");
		this.buildingsConstructed["total"]++;
	}
};

StatisticsTracker.prototype.IncreaseBuiltCivCentresCounter = function()
{
	return this.civCentresBuilt++;
};


StatisticsTracker.prototype.KilledEntity = function(targetEntity)
{
	var cmpTargetEntityIdentity = Engine.QueryInterface(targetEntity, IID_Identity);
	var cmpCost = Engine.QueryInterface(targetEntity, IID_Cost);
	var costs = cmpCost.GetResourceCosts();
	if (cmpTargetEntityIdentity)
	{
		var cmpFoundation = Engine.QueryInterface(targetEntity, IID_Foundation);
		// We want to deal only with real structures, not foundations
		var targetIsStructure = cmpTargetEntityIdentity.HasClass("Structure") && cmpFoundation == null;
		var targetIsDomesticAnimal = cmpTargetEntityIdentity.HasClass("Animal") && cmpTargetEntityIdentity.HasClass("Domestic");
		// Don't count domestic animals as units
		var targetIsUnit = cmpTargetEntityIdentity.HasClass("Unit") && !targetIsDomesticAnimal;
		var targetIsCivCentre = cmpTargetEntityIdentity.HasClass("CivCentre");

		var cmpTargetOwnership = Engine.QueryInterface(targetEntity, IID_Ownership);
	    
		// Don't increase counters if target player is gaia (player 0)
		if (cmpTargetOwnership.GetOwner() != 0)
		{
			if (targetIsUnit)
			{
				var unitIsInfantry = cmpTargetEntityIdentity.HasClass("Infantry");
				var unitIsWorker = cmpTargetEntityIdentity.HasClass("Worker");
				var unitIsFemale = cmpTargetEntityIdentity.HasClass("Female");
				var unitIsCavalry = cmpTargetEntityIdentity.HasClass("Cavalry");
				var unitIsChampion = cmpTargetEntityIdentity.HasClass("Champion");
				var unitIsHero = cmpTargetEntityIdentity.HasClass("Hero");
				var unitIsNavy = cmpTargetEntityIdentity.HasClass("Ship");
	
				this.CounterIncrement(unitIsInfantry, "enemyUnitsKilled", "infantry");
				this.CounterIncrement(unitIsWorker, "enemyUnitsKilled", "workers");
				this.CounterIncrement(unitIsFemale, "enemyUnitsKilled", "females");
				this.CounterIncrement(unitIsCavalry, "enemyUnitsKilled", "cavalry");
				this.CounterIncrement(unitIsChampion, "enemyUnitsKilled", "champion");
				this.CounterIncrement(unitIsHero, "enemyUnitsKilled", "heroes");
				this.CounterIncrement(unitIsNavy, "enemyUnitsKilled", "navy");
				this.enemyUnitsKilled["total"]++;
				
				for (var r in costs)
				{
					this.enemyUnitsKilledValue += costs[r];
				}
			}	
			if (targetIsStructure)
			{
				var buildingIsHouse = cmpTargetEntityIdentity.HasClass("House");
				var buildingIsEconomic = cmpTargetEntityIdentity.HasClass("Economic");
				var buildingIsOutpost = cmpTargetEntityIdentity.HasClass("Outpost");
				var buildingIsMilitary = cmpTargetEntityIdentity.HasClass("Military");
				var buildingIsFortress = cmpTargetEntityIdentity.HasClass("Fortress");
				var buildingIsSpecial = cmpTargetEntityIdentity.HasClass("SpecialBuilding");
				var buildingIsWonder = cmpTargetEntityIdentity.HasClass("Wonder");
				
				this.CounterIncrement(buildingIsHouse, "enemyBuildingsDestroyed", "houses");
				this.CounterIncrement(buildingIsEconomic, "enemyBuildingsDestroyed", "economic");
				this.CounterIncrement(buildingIsOutpost, "enemyBuildingsDestroyed", "outposts");
				this.CounterIncrement(buildingIsMilitary, "enemyBuildingsDestroyed", "military");
				this.CounterIncrement(buildingIsFortress, "enemyBuildingsDestroyed", "fortresses");
				this.CounterIncrement(buildingIsSpecial, "enemyBuildingsDestroyed", "special");
				this.CounterIncrement(buildingIsWonder, "enemyBuildingsDestroyed", "wonders");
				this.enemyBuildingsDestroyed["total"]++;
				
				for (var r in costs)
				{
					this.enemyBuildingsDestroyedValue += costs[r];
				}
			}
			if (targetIsCivCentre && targetIsStructure)
				this.enemyCivCentresDestroyed++;
		}
	}
};

StatisticsTracker.prototype.LostEntity = function(lostEntity)
{
	var cmpLostEntityIdentity = Engine.QueryInterface(lostEntity, IID_Identity);
	var cmpCost = Engine.QueryInterface(lostEntity, IID_Cost);
	var costs = cmpCost.GetResourceCosts();
	if (cmpLostEntityIdentity)
	{
		var cmpFoundation = Engine.QueryInterface(lostEntity, IID_Foundation);
		// We want to deal only with real structures, not foundations
		var lostEntityIsStructure = cmpLostEntityIdentity.HasClass("Structure") && cmpFoundation == null;
		var lostEntityIsDomesticAnimal = cmpLostEntityIdentity.HasClass("Animal") && cmpLostEntityIdentity.HasClass("Domestic");
		// Don't count domestic animals as units
		var lostEntityIsUnit = cmpLostEntityIdentity.HasClass("Unit") && !lostEntityIsDomesticAnimal;

		if (lostEntityIsUnit)
		{
			var unitIsInfantry = cmpLostEntityIdentity.HasClass("Infantry");
			var unitIsWorker = cmpLostEntityIdentity.HasClass("Worker");
			var unitIsFemale = cmpLostEntityIdentity.HasClass("Female");
			var unitIsCavalry = cmpLostEntityIdentity.HasClass("Cavalry");
			var unitIsChampion = cmpLostEntityIdentity.HasClass("Champion");
			var unitIsHero = cmpLostEntityIdentity.HasClass("Hero");
			var unitIsNavy = cmpLostEntityIdentity.HasClass("Ship");
	
			this.CounterIncrement(unitIsInfantry, "unitsLost", "infantry");
			this.CounterIncrement(unitIsWorker, "unitsLost", "workers");
			this.CounterIncrement(unitIsFemale, "unitsLost", "females");
			this.CounterIncrement(unitIsCavalry, "unitsLost", "cavalry");
			this.CounterIncrement(unitIsChampion, "unitsLost", "champion");
			this.CounterIncrement(unitIsHero, "unitsLost", "heroes");
			this.CounterIncrement(unitIsNavy, "unitsLost", "navy");
			this.unitsLost["total"]++;
			
			for (var r in costs)
			{
				this.unitsLostValue += costs[r];
			}	
		}	
		if (lostEntityIsStructure)
		{
			var buildingIsHouse = cmpLostEntityIdentity.HasClass("House");
			var buildingIsEconomic = cmpLostEntityIdentity.HasClass("Economic");
			var buildingIsOutpost = cmpLostEntityIdentity.HasClass("Outpost");
			var buildingIsMilitary = cmpLostEntityIdentity.HasClass("Military");
			var buildingIsFortress = cmpLostEntityIdentity.HasClass("Fortress");
			var buildingIsSpecial = cmpLostEntityIdentity.HasClass("SpecialBuilding");
			var buildingIsWonder = cmpLostEntityIdentity.HasClass("Wonder");
			
			this.CounterIncrement(buildingIsHouse, "buildingsLost", "houses");
			this.CounterIncrement(buildingIsEconomic, "buildingsLost", "economic");
			this.CounterIncrement(buildingIsOutpost, "buildingsLost", "outposts");
			this.CounterIncrement(buildingIsMilitary, "buildingsLost", "military");
			this.CounterIncrement(buildingIsFortress, "buildingsLost", "fortresses");
			this.CounterIncrement(buildingIsSpecial, "buildingsLost", "special");
			this.CounterIncrement(buildingIsWonder, "buildingsLost", "wonders");	
			this.buildingsLost["total"]++;
			
			for (var r in costs)
			{
				this.buildingsLostValue += costs[r];
			}
		}
	}
};

/**
 * @param type Generic type of resource (string)
 * @param amount Amount of resource, whick should be added (integer)
 * @param specificType Specific type of resource (string, optional)
 */
StatisticsTracker.prototype.IncreaseResourceGatheredCounter = function(type, amount, specificType)
{
	this.resourcesGathered[type] += amount;
	this.resourcesGathered["total"] += amount;
	
	if (type == "food" && (specificType == "fruit" || specificType == "grain"))
		this.resourcesGathered["vegetarianFood"] += amount;
};

/**
 * @param type Generic type of resource (string)
 * @param amount Amount of resource, whick should be added (integer)
 */
StatisticsTracker.prototype.IncreaseResourceUsedCounter = function(type, amount)
{
	this.resourcesUsed[type] += amount;
	this.resourcesUsed["total"] += amount;
};

StatisticsTracker.prototype.IncreaseTreasuresCollectedCounter = function()
{
	return this.treasuresCollected++;
};

StatisticsTracker.prototype.IncreaseResourcesSoldCounter = function(type, amount)
{
	this.resourcesSold[type] += amount;
	this.resourcesSold["total"] += amount;
};

StatisticsTracker.prototype.IncreaseResourcesBoughtCounter = function(type, amount)
{
	this.resourcesBought[type] += amount;
	this.resourcesBought["total"] += amount;
};

StatisticsTracker.prototype.IncreaseTributesSentCounter = function(amount)
{
	this.tributesSent += amount;
};

StatisticsTracker.prototype.IncreaseTributesReceivedCounter = function(amount)
{
	this.tributesReceived += amount;
};

StatisticsTracker.prototype.IncreaseTradeIncomeCounter = function(amount)
{
	this.tradeIncome += amount;
};

StatisticsTracker.prototype.GetPercentMapExplored = function()
{
	var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	var cmpPlayer = Engine.QueryInterface(this.entity, IID_Player);
	return cmpRangeManager.GetPercentMapExplored(cmpPlayer.GetPlayerID());
};

Engine.RegisterComponentType(IID_StatisticsTracker, "StatisticsTracker", StatisticsTracker);
