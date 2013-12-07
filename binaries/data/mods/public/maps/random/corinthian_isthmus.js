RMS.LoadLibrary("rmgen");

TILE_CENTERED_HEIGHT_MAP = true;

const tCity = "medit_city_pavement";
const tCityPlaza = "medit_city_pavement";
const tHill = ["medit_grass_shrubs", "medit_rocks_grass_shrubs", "medit_rocks_shrubs", "medit_rocks_grass", "medit_shrubs"];
const tMainDirt = "medit_dirt";
const tCliff = "medit_cliff_aegean";
const tForestFloor = "medit_grass_shrubs";
const tGrass = ["medit_grass_field", "medit_grass_field_a"];
const tGrassSand50 = "medit_grass_field_a";
const tGrassSand25 = "medit_grass_field_b";
const tDirt = "medit_dirt_b";
const tDirt2 = "medit_rocks_grass";
const tDirt3 = "medit_rocks_shrubs";
const tDirtCracks = "medit_dirt_c";
const tShore = "medit_sand";
const tWater = "medit_sand_wet";

// gaia entities
const oBerryBush = "gaia/flora_bush_berry";
const oChicken = "gaia/fauna_chicken";
const oDeer = "gaia/fauna_deer";
const oFish = "gaia/fauna_fish";
const oSheep = "gaia/fauna_sheep";
const oGoat = "gaia/fauna_goat";
const oStoneLarge = "gaia/geology_stonemine_medit_quarry";
const oStoneSmall = "gaia/geology_stone_mediterranean";
const oMetalLarge = "gaia/geology_metal_mediterranean_slabs";
const oDatePalm = "gaia/flora_tree_cretan_date_palm_short";
const oSDatePalm = "gaia/flora_tree_cretan_date_palm_tall";
const oCarob = "gaia/flora_tree_carob";
const oFanPalm = "gaia/flora_tree_medit_fan_palm";
const oPoplar = "gaia/flora_tree_poplar_lombardy";
const oCypress = "gaia/flora_tree_cypress";

// decorative props
const aBush1 = "actor|props/flora/bush_medit_sm.xml";
const aBush2 = "actor|props/flora/bush_medit_me.xml";
const aBush3 = "actor|props/flora/bush_medit_la.xml";
const aBush4 = "actor|props/flora/bush_medit_me.xml";
const aBushes = [aBush1, aBush2, aBush3, aBush4];
const aDecorativeRock = "actor|geology/stone_granite_med.xml";

// terrain + entity (for painting)
const pForest = [tForestFloor, tForestFloor + TERRAIN_SEPARATOR + oCarob, tForestFloor + TERRAIN_SEPARATOR + oDatePalm, tForestFloor + TERRAIN_SEPARATOR + oSDatePalm, tForestFloor];

const BUILDING_ANGlE = -PI/4;

log("Initializing map...");

InitMap();

const numPlayers = getNumPlayers();
const mapSize = getMapSize();
const mapArea = mapSize*mapSize;

// create tile classes

var clPlayer = createTileClass();
var clForest = createTileClass();
var clWater = createTileClass();
var clDirt = createTileClass();
var clRock = createTileClass();
var clMetal = createTileClass();
var clFood = createTileClass();
var clBaseResource = createTileClass();
var clSettlement = createTileClass();
var clGrass = createTileClass();
var clHill = createTileClass();

// create the main river
log("Creating the main river");
var placer = new PathPlacer(fractionToTiles(0.5 + cos(3 * PI / 4)), fractionToTiles(0.5 + sin(3 * PI / 4)), fractionToTiles(0.5 + cos(- PI / 4)), fractionToTiles(0.5 + sin(- PI / 4)), scaleByMapSize(15,70), 0.2, 3*(scaleByMapSize(5,15)), 0.04, 0.01);
var terrainPainter = new LayeredPainter(
	[tShore, tWater, tWater],		// terrains
	[1, 3]								// widths
);
var elevationPainter = new SmoothElevationPainter(
	ELEVATION_SET,			// type
	-4,				// elevation
	4				// blend radius
);
createArea(placer, [terrainPainter, elevationPainter], avoidClasses(clPlayer, 4));

placer = new ClumpPlacer(floor(PI*scaleByMapSize(15,70)*scaleByMapSize(15,70)/4), 0.95, 0.6, 10, fractionToTiles(0.5 + cos(3 * PI / 4))+3, fractionToTiles(0.5 + sin(3 * PI / 4))-3);
var painter = new LayeredPainter([tWater, tWater], [1]);
var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, -4, 4);
createArea(placer, [painter, elevationPainter], avoidClasses(clPlayer, 8));

placer = new ClumpPlacer(floor(PI*scaleByMapSize(15,70)*scaleByMapSize(15,70)/4), 0.95, 0.6, 10, fractionToTiles(0.5 + cos(- PI / 4))-3, fractionToTiles(0.5 + sin(- PI / 4))+3);
var painter = new LayeredPainter([tWater, tWater], [1]);
var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, -4, 4);
createArea(placer, [painter, elevationPainter], avoidClasses(clPlayer, 8));

for (var ix = 0; ix < mapSize; ix++)
{
	for (var iz = 0; iz < mapSize; iz++)
	{
		if ((ix + iz < scaleByMapSize(6,30) + mapSize)&&(ix + iz > - scaleByMapSize(6,30) + mapSize))
			if ((ix - iz < mapSize / 2)||(ix - iz > mapSize / 2))
				setHeight(ix, iz, -4);
	}
}

var placer = new PathPlacer(fractionToTiles(0.5 + cos(5 * PI / 4)), fractionToTiles(0.5 + sin(5 * PI / 4)), fractionToTiles(0.5 + cos( PI / 4)), fractionToTiles(0.5 + sin( PI / 4)), scaleByMapSize(10,30), 0.5, 3*(scaleByMapSize(1,4)), 0.1, 0.01);
var terrainPainter = new LayeredPainter(
	[tShore, tGrass],		// terrains
	[2]								// widths
);
var elevationPainter = new SmoothElevationPainter(
	ELEVATION_SET,			// type
	3,				// elevation
	4				// blend radius
);
createArea(placer, [terrainPainter, elevationPainter], null);

paintTerrainBasedOnHeight(-6, 1, 1, tWater);
paintTerrainBasedOnHeight(1, 2, 1, tShore);
paintTerrainBasedOnHeight(2, 5, 1, tGrass);

paintTileClassBasedOnHeight(-6, 0.5, 1, clWater)

// randomize player order
var playerIDs = [];
for (var i = 0; i < numPlayers; i++)
{
	playerIDs.push(i+1);
}
playerIDs = primeSortPlayers(sortPlayers(playerIDs));

// place players

var playerX = new Array(numPlayers);
var playerZ = new Array(numPlayers);
var playerAngle = new Array(numPlayers);
var playerPos = new Array(numPlayers);
var iop = 0;
for (var i = 0; i < numPlayers; i++)
{
	iop = i - 1;
	if (!(numPlayers%2)){
		playerPos[i] = ((iop + abs(iop%2))/2 + 1) / ((numPlayers / 2) + 1);
	}
	else
	{
		if (iop%2)
		{
			playerPos[i] = ((iop + abs(iop%2))/2 + 1) / (((numPlayers + 1) / 2) + 1);
		}
		else
		{
			playerPos[i] = ((iop)/2 + 1) / ((((numPlayers - 1)) / 2) + 1);
		}
	}
	playerZ[i] = Math.sqrt(0.5)*(0.6*(i%2) - 0.8 + playerPos[i]) + 0.5;
	playerX[i] = Math.sqrt(0.5)*(0.6*(i%2) + 0.2 - playerPos[i]) + 0.5;
}

for (var i = 0; i < numPlayers; i++)
{
	var id = playerIDs[i];
	log("Creating base for player " + id + "...");
	
	// some constants
	var radius = scaleByMapSize(15,25);
	var cliffRadius = 2;
	var elevation = 20;
	
	// get the x and z in tiles
	var fx = fractionToTiles(playerX[i]);
	var fz = fractionToTiles(playerZ[i]);
	var ix = floor(fx);
	var iz = floor(fz);
	addToClass(ix, iz, clPlayer);
	
	// create the city patch
	var cityRadius = radius/3;
	var placer = new ClumpPlacer(PI*cityRadius*cityRadius, 0.6, 0.3, 10, ix, iz);
	var painter = new LayeredPainter([tCityPlaza, tCity], [1]);
	createArea(placer, painter, null);
	
	// create starting units
	placeCivDefaultEntities(fx, fz, id, BUILDING_ANGlE, {'iberWall' : 'towers'});
	
	// create animals
	for (var j = 0; j < 2; ++j)
	{
		var aAngle = randFloat(0, TWO_PI);
		var aDist = 7;
		var aX = round(fx + aDist * cos(aAngle));
		var aZ = round(fz + aDist * sin(aAngle));
		var group = new SimpleGroup(
			[new SimpleObject(oChicken, 5,5, 0,2)],
			true, clBaseResource, aX, aZ
		);
		createObjectGroup(group, 0);
	}
	
	// create berry bushes
	var bbAngle = randFloat(0, TWO_PI);
	var bbDist = 12;
	var bbX = round(fx + bbDist * cos(bbAngle));
	var bbZ = round(fz + bbDist * sin(bbAngle));
	group = new SimpleGroup(
		[new SimpleObject(oBerryBush, 5,5, 0,3)],
		true, clBaseResource, bbX, bbZ
	);
	createObjectGroup(group, 0);
	
	// create metal mine
	var mAngle = bbAngle;
	while(abs(mAngle - bbAngle) < PI/3)
	{
		mAngle = randFloat(0, TWO_PI);
	}
	var mDist = 12;
	var mX = round(fx + mDist * cos(mAngle));
	var mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(oMetalLarge, 1,1, 0,0)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);
	
	// create stone mines
	mAngle += randFloat(PI/8, PI/4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(oStoneLarge, 1,1, 0,2)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);
	var hillSize = PI * radius * radius;
	// create starting trees
	var num = 2;
	var tAngle = randFloat(-PI/3, 4*PI/3);
	var tDist = randFloat(11, 13);
	var tX = round(fx + tDist * cos(tAngle));
	var tZ = round(fz + tDist * sin(tAngle));
	group = new SimpleGroup(
		[new SimpleObject(oCarob, num, num, 0,5)],
		false, clBaseResource, tX, tZ
	);
	createObjectGroup(group, 0, avoidClasses(clBaseResource,2));
	
	// create grass tufts
	var num = hillSize / 250;
	for (var j = 0; j < num; j++)
	{
		var gAngle = randFloat(0, TWO_PI);
		var gDist = radius - (5 + randInt(7));
		var gX = round(fx + gDist * cos(gAngle));
		var gZ = round(fz + gDist * sin(gAngle));
		group = new SimpleGroup(
			[new SimpleObject(aBush1, 2,5, 0,1, -PI/8,PI/8)],
			false, clBaseResource, gX, gZ
		);
		createObjectGroup(group, 0);
	}
}

RMS.SetProgress(40);
// create bumps
log("Creating bumps...");
placer = new ClumpPlacer(scaleByMapSize(20, 50), 0.3, 0.06, 1);
painter = new SmoothElevationPainter(ELEVATION_MODIFY, 2, 2);
createAreas(
	placer,
	painter, 
	avoidClasses(clWater, 2, clPlayer, 20),
	scaleByMapSize(100, 200)
);



// calculate desired number of trees for map (based on size)
const MIN_TREES = 500;
const MAX_TREES = 2500;
const P_FOREST = 0.5;

var totalTrees = scaleByMapSize(MIN_TREES, MAX_TREES);
var numForest = totalTrees * P_FOREST;
var numStragglers = totalTrees * (1.0 - P_FOREST);

// create forests
log("Creating forests...");
var num = scaleByMapSize(10,30);
placer = new ClumpPlacer(numForest / num, 0.15, 0.1, 0.5);
painter = new TerrainPainter([tForestFloor, pForest]);
createAreas(placer, [painter, paintClass(clForest)], 
	avoidClasses(clPlayer, 20, clForest, 10, clWater, 1, clBaseResource, 3),
	num, 50
);

RMS.SetProgress(50);


// create hills
log("Creating hills...");
placer = new ClumpPlacer(scaleByMapSize(20, 150), 0.2, 0.1, 1);
var terrainPainter = new LayeredPainter(
	[tCliff, tHill],		// terrains
	[2]								// widths
);
var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 16, 2);
createAreas(
	placer,
	[terrainPainter, elevationPainter, paintClass(clHill)], 
	avoidClasses(clPlayer, 20, clForest, 1, clHill, 15, clWater, 3),
	scaleByMapSize(1, 4) * numPlayers
);



// create grass patches

log("Creating grass patches...");
var sizes = [scaleByMapSize(3, 48), scaleByMapSize(5, 84), scaleByMapSize(8, 128)];
for (var i = 0; i < sizes.length; i++)
{
	placer = new ClumpPlacer(sizes[i], 0.3, 0.06, 0.5);
	painter = new LayeredPainter(
		[[tGrass,tGrassSand50],[tGrassSand50,tGrassSand25], [tGrassSand25,tGrass]], 		// terrains
		[1,1]															// widths
	);
	createAreas(
		placer,
		[painter, paintClass(clDirt)],
		avoidClasses(clForest, 0, clGrass, 2, clPlayer, 10, clWater, 2, clDirt, 2, clHill, 1),
		scaleByMapSize(15, 45)
	);
}

RMS.SetProgress(55);

// create dirt patches
log("Creating dirt patches...");
var sizes = [scaleByMapSize(3, 48), scaleByMapSize(5, 84), scaleByMapSize(8, 128)];
for (var i = 0; i < sizes.length; i++)
{
	placer = new ClumpPlacer(sizes[i], 0.3, 0.06, 0.5);
	painter = new LayeredPainter(
		[tDirt3, tDirt2,[tDirt,tMainDirt], [tDirtCracks,tMainDirt]], 		// terrains
		[1,1,1]															// widths
	);
	createAreas(
		placer,
		[painter, paintClass(clDirt)],
		avoidClasses(clForest, 0, clDirt, 2, clPlayer, 10, clWater, 2, clGrass, 2, clHill, 1),
		scaleByMapSize(15, 45)
	);
}



RMS.SetProgress(60);

log("Creating stone mines...");
// create large stone quarries
group = new SimpleGroup([new SimpleObject(oStoneSmall, 0,2, 0,4), new SimpleObject(oStoneLarge, 1,1, 0,4)], true, clRock);
createObjectGroups(group, 0,
	avoidClasses(clForest, 1, clPlayer, 20, clRock, 10, clWater, 1, clHill, 1),
	scaleByMapSize(4,16), 100
);

// create small stone quarries
group = new SimpleGroup([new SimpleObject(oStoneSmall, 2,5, 1,3)], true, clRock);
createObjectGroups(group, 0,
	avoidClasses(clForest, 1, clPlayer, 20, clRock, 10, clWater, 1, clHill, 1),
	scaleByMapSize(4,16), 100
);

log("Creating metal mines...");
// create large metal quarries
group = new SimpleGroup([new SimpleObject(oMetalLarge, 1,1, 0,4)], true, clMetal);
createObjectGroups(group, 0,
	avoidClasses(clForest, 1, clPlayer, 20, clMetal, 10, clRock, 5, clWater, 1, clHill, 1),
	scaleByMapSize(4,16), 100
);

RMS.SetProgress(65);

// create small decorative rocks
log("Creating small decorative rocks...");
group = new SimpleGroup(
	[new SimpleObject(aDecorativeRock, 1,3, 0,1)],
	true
);
createObjectGroups(
	group, 0,
	avoidClasses(clWater, 1, clForest, 0, clPlayer, 0, clHill, 1),
	scaleByMapSize(16, 262), 50
);


// create shrubs
log("Creating shrubs...");
group = new SimpleGroup(
	[new SimpleObject(aBush2, 1,2, 0,1), new SimpleObject(aBush1, 1,3, 0,2), new SimpleObject(aBush4, 1,2, 0,1), new SimpleObject(aBush3, 1,3, 0,2)],
	true
);
createObjectGroups(
	group, 0,
	avoidClasses(clWater, 1, clPlayer, 0, clHill, 1),
	scaleByMapSize(40, 360), 50
);

RMS.SetProgress(70);

// create fish
log("Creating fish...");
group = new SimpleGroup([new SimpleObject(oFish, 1,3, 2,6)], true, clFood);
createObjectGroups(group, 0,
	[avoidClasses(clFood, 10), stayClasses(clWater, 5)],
	3*scaleByMapSize(5,20), 50
);

// create sheeps
log("Creating sheeps...");
group = new SimpleGroup([new SimpleObject(oSheep, 5,7, 0,4)], true, clFood);
createObjectGroups(group, 0,
	avoidClasses(clForest, 0, clPlayer, 20, clWater, 1, clFood, 10, clHill, 1),
	scaleByMapSize(5,20), 50
);

// create goats
log("Creating goats...");
group = new SimpleGroup([new SimpleObject(oGoat, 2,4, 0,3)], true, clFood);
createObjectGroups(group, 0,
	avoidClasses(clForest, 0, clPlayer, 20, clWater, 1, clFood, 10, clHill, 1),
	scaleByMapSize(5,20), 50
);

// create deers
log("Creating deers...");
group = new SimpleGroup([new SimpleObject(oDeer, 2,4, 0,2)], true, clFood);
createObjectGroups(group, 0,
	avoidClasses(clForest, 0, clPlayer, 20, clWater, 1, clFood, 10, clHill, 1),
	scaleByMapSize(5,20), 50
);

// create berry bush
log("Creating berry bush...");
group = new SimpleGroup(
	[new SimpleObject(oBerryBush, 5,7, 0,4)],
	true, clFood
);
createObjectGroups(group, 0,
	avoidClasses(clWater, 3, clForest, 0, clPlayer, 20, clHill, 1, clFood, 10),
	randInt(1, 4) * numPlayers + 2, 50
);

RMS.SetProgress(90);

// create straggler trees
log("Creating straggler trees...");
var types = [oDatePalm, oSDatePalm, oCarob, oFanPalm, oPoplar, oCypress];	// some variation
var num = floor(numStragglers / types.length);
for (var i = 0; i < types.length; ++i)
{
	group = new SimpleGroup([new SimpleObject(types[i], 1,1, 0,0)], true);
	createObjectGroups(group, 0,
		avoidClasses(clForest, 0, clWater, 1, clPlayer, 8, clMetal, 1, clHill, 1),
		num
	);
}

// Set environment
setSkySet("sunny");
setSunColour(0.917, 0.828, 0.734);	
setWaterColour(0.292, 0.347, 0.691);		

// Export map data
ExportMap();