window.onload = function () {
    var tileSize = 80;
    var numCols = 5;
    var numRows = 4;
    var tileSpacing = 10;
    var tilesArray = [];
    var selectedArray = [];
    var winArray = [];
    var playSound;
    
    var game = new Phaser.Game(500, 500);
    
    var playGame = function (game) {};
    playGame.prototype = {
        preload: function () {
            game.load.spritesheet('tiles', 'tiles.png', tileSize, tileSize);
        },
        
        create: function () {
            game.stage.backgroundColor = "#4488AA";
            this.placeTiles();
        },
        
        update: function () {
            if (winArray.length >= 9) {
                winArray = [];
                game.state.start('TitleScreen');
            }
        },
    
        placeTiles: function () {
            var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing)) / 2;
            var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing)) / 2;
            
            for (var i = 0; i < numCols * numRows; i++) {
               tilesArray.push(Math.floor(i/2));
            }
            
            for (i = 0; i < numCols * numRows; i++) {
                var from = game.rnd.between(0, tilesArray.length - 1);
                var to = game.rnd.between(0, tilesArray.length - 1);
                var temp = tilesArray[from];
                
                tilesArray[from] = tilesArray[to];
                tilesArray[to] = temp;
            }
            
            for (i = 0; i < numCols; i++) {
                for (var j = 0; j < numRows; j++) {
                    var tile = game.add.button(leftSpace + i * (tileSize + tileSpacing),topSpace + j * (tileSize + tileSpacing), 'tiles', this.showTile, this);
                    tile.frame = 10;
                    tile.value = tilesArray[j * numCols + i];
                }
            }
        },
        
        showTile: function (target) {
            if (selectedArray.length < 2 && selectedArray.indexOf(target) == -1) {
                target.frame = target.value;    
                selectedArray.push(target);
                
                if (selectedArray.length == 2) {
                    game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
                }
            }
        },
        
        checkTiles: function () {
            if (selectedArray[0].value == selectedArray[1].value) {
                winArray.push(selectedArray[0].value);
                selectedArray[0].destroy;
                selectedArray[1].destroy;
            } else {
                selectedArray[0].frame = 10;
                selectedArray[1].frame = 10;
            }
            selectedArray.length = 0;
        }
    }
    
    var titleScreen = function (game) {};
    titleScreen.prototype = {
        preload: function () {
            
        },
        
        create: function () {
            var style = {
                font: '48px Monospace',
                fill: '#f1f1f1',
                align: 'center'
            }
            
            var text = game.add.text(game.width / 2, game.height / 2, 'Zacznij grę', style);
            text.anchor.set(0.5);
            
            game.input.onDown.add(this.startGame, this);
        },
        
        startGame: function () {
            game.state.start('PlayGame');
        }
    }
    
    game.state.add("TitleScreen", titleScreen);
    game.state.add("PlayGame", playGame);
    game.state.start("TitleScreen");
    
    function clearGameCache () {
        game.cache = new Phaser.Cache(game);
        game.load.reset();
        game.load.removeAll();
    }
    
//    clearGameCache();
}