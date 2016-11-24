var game = new Phaser.Game(
    1200,800,
    Phaser.AUTO, 
    'phaser-example', 
    { 
        preload: preload, 
        create: create, 
        update: update
    });

function preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.load.image('map', 'tile.png');
}

var tile_count_x = 30;
var tile_count_y = 20;
var tile_raw_width = 40; 
var tile_raw_height = 40;
var tile_width = 40;
var tile_height = 40;

var map;
var mapdata

var marker;
var currentTile = 0;
var layer;

var cursors;

var scrollVelocity = 20;

function create() {
    game.stage.backgroundColor = '#2d2d2d';
    map = game.add.tilemap();
    map.addTilesetImage('map', null, tile_raw_width, tile_raw_height);

    layer = map.create('level1', tile_count_x, tile_count_y, tile_width, tile_height);
    layer.resizeWorld();

    createTileSelector();

    game.input.addMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    mapdata = new Array(tile_count_x);
    for(var i = 0; i < tile_count_x; ++i){
        mapdata[i] = new Array(tile_count_y);
        for(var j = 0; j < tile_count_y; ++j){
            mapdata[i][j] = 0;
            map.putTile(0, i, j, layer);
        }
    }
}

function updateMarker() {
    coord_x = layer.getTileX(game.input.activePointer.worldX);
    coord_y = layer.getTileX(game.input.activePointer.worldY);
    marker.x = coord_x * tile_width;
    marker.y = coord_y * tile_height;
    if (game.input.mousePointer.isDown) {
        map.putTile(currentTile, coord_x, coord_y, layer);
        mapdata[coord_x][coord_y] = currentTile;
    }
}

function update() {
    if (cursors.left.isDown) {
        game.camera.x -= scrollVelocity;
    }
    else if (cursors.right.isDown) {
        game.camera.x += scrollVelocity;
    }
    if (cursors.up.isDown) {
        game.camera.y -= scrollVelocity;
    }
    else if (cursors.down.isDown) {
        game.camera.y += scrollVelocity;
    }
}

function createTileSelector() {
    var tileSelector = game.add.group();

    // var tileSelectorBackground = game.make.graphics();
    // tileSelectorBackground.beginFill(0x000000, 0.5);
    // tileSelectorBackground.drawRect(0, 0, 800, 34);
    // tileSelectorBackground.endFill();

    // tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'map');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, tile_width, tile_height);
}

function pickTile(sprite, pointer) {
    currentTile = game.math.snapToFloor(pointer.x, tile_width) / tile_width;
}