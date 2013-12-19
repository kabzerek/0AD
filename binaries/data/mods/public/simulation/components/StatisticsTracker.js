function StatisticsTracker() {}

StatisticsTracker.prototype.Schema =
	"<a:component type='system'/><empty/>";

StatisticsTracker.prototype.Init = function()
{
	// units
	this.unitsTrained = {
			"Infantry": 0,
			"Worker": 0,
			"Female": 0,
			"Cavalry": 0,
			"Champion": 0,
			"Hero": 0,
			"Ship": 0,
			"total": 0
	};
	this.unitsLost = {
			"Infantry": 0,
			"Worker": 0,
			"Female": 0,
			"Cavalry": 0,
			"Champion": 0,
			"Hero": 0,
			"Ship": 0,
			"total": 0
	};
	this.unitsLostValue = 0;
	this.enemyUnitsKilled = {
			"Infantry": 0,
			"Worker": 0,
			"Female": 0,
			"Cavalry": 0,
			"Champion": 0,
			"Hero": 0,
			"Ship": 0,
			"total": 0
	};
	this.enemyUnitsKilledValue = 0;
	//buildings		
	this.buildingsConstructed = {
		"House": 0,
		"Economic": 0,
		"Outpost": 0,
		"Military": 0,
		"Fortress": 0,
		"SpecialBuilding": 0,
		"Wonder": 0,
		"total": 0	
	};
	this.buildingsLost = {
		"House": 0,
		"Economic": 0,
		"Outpost": 0,
		"Military": 0,
		"Fortress": 0,
		"SpecialBuilding": 0,
		"Wonder": 0,
		"total": 0
		};
	this.buildingsLostValue = 0;
	this.enemyBuildingsDestroyed = {
		"House": 0,
		"Economic": 0,
		"Outpost": 0,
		"Military": 0,
		"Fortress": 0,
		"SpecialBuilding": 0,
		"Wonder": 0,
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
 *@param counter The name of the counter to increment(e.g. "unitsTrained")
 *@param type The type of the counter (e.g. "workers")
 */
StatisticsTracker.prototype.CounterIncrement = function(entity, counter, type)
{
	if (entity["HasClass(" + type + ")"])
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
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Infantry");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Worker");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Female");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Cavalry");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Champion");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Hero");
		this.CounterIncrement(cmpUnitEntityIdentity, "unitsTrained", "Ship");
		this.unitsTrained.total++;
	}
};

StatisticsTracker.prototype.GetFeminisation = function()
{
	return Math.floor(this.unitsTrained.Female > 0 ? (this.unitsTrained.Female / this.unitsTrained.Worker) * 100 : 0)
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
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "House");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "Economic");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "Outpost");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "Military");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "Fortress");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "SpecialBuilding");
		this.CounterIncrement(cmpBuildingEntityIdentity, "buildingsConstructed", "Wonder");
		this.buildingsConstructed.total++;
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
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Infantry");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Worker");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Female");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Cavalry");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Champion");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Hero");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyUnitsKilled", "Ship");
				this.enemyUnitsKilled.total++;
				
				for (var r in costs)
				{
					this.enemyUnitsKilledValue += costs[r];
				}
			}	
			if (targetIsStructure)
			{
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "House");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "Economic");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "Outpost");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "Military");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "Fortress");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "SpecialBuilding");
				this.CounterIncrement(cmpTargetEntityIdentity, "enemyBuildingsDestroyed", "Wonder");
				this.enemyBuildingsDestroyed.total++;
				
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
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Infantry");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Worker");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Female");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Cavalry");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Champion");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Hero");
			this.CounterIncrement(cmpLostEntityIdentity, "unitsLost", "Ship");
			this.unitsLost.total++;
			
			for (var r in costs)
			{
				this.unitsLostValue += costs[r];
			}	
		}	
		if (lostEntityIsStructure)
		{
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "House");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "Economic");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "Outpost");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "Military");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "Fortress");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "SpecialBuilding");
			this.CounterIncrement(cmpLostEntityIdentity, "buildingsLost", "Wonder");
			this.buildingsLost.total++;
			
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
	this.resourcesGathered.total += amount;
	
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
	this.resourcesUsed.total += amount;
};

StatisticsTracker.prototype.IncreaseTreasuresCollectedCounter = function()
{
	return this.treasuresCollected++;
};

StatisticsTracker.prototype.IncreaseResourcesSoldCounter = function(type, amount)
{
	this.resourcesSold[type] += amount;
	this.resourcesSold.total += amount;
};

StatisticsTracker.prototype.IncreaseResourcesBoughtCounter = function(type, amount)
{
	this.resourcesBought[type] += amount;
	this.resourcesBought.total += amount;
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
