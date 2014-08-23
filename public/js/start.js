(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (Buffer){
(function() {
  var buffer;

  buffer = function() {
    var buf, index, _i, _ref, _ref1;
    buf = new Buffer((_ref = arguments.length) != null ? _ref : 0);
    for (index = _i = 0, _ref1 = arguments.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
      buf.writeUInt8(arguments[index], index);
    }
    return buf;
  };

  module.exports = buffer;

}).call(this);

//# sourceMappingURL=../../maps/buffer.js.map

}).call(this,require("buffer").Buffer)
},{"buffer":17}],2:[function(require,module,exports){
(function() {
  Function.prototype.property = function(property, description) {
    return Object.defineProperty(this.prototype, property, description);
  };

}).call(this);

//# sourceMappingURL=../maps/define_property.js.map

},{}],3:[function(require,module,exports){
(function() {
  var CYCLE_STATES, Cycle, DIRECTIONS_TO_WALL_TYPES, Wall, directions, playerAttributes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('../define_property');

  playerAttributes = require('./player_attributes');

  directions = require('./directions');

  Wall = require('./wall');

  CYCLE_STATES = {
    RACING: 0,
    EXPLODING: 1,
    DEAD: 2,
    WINNER: 3,
    INSERTING: 4
  };

  DIRECTIONS_TO_WALL_TYPES = {};

  DIRECTIONS_TO_WALL_TYPES[directions.UP] = {};

  DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.UP] = Wall.WALL_TYPES.NORTH_SOUTH;

  DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.DOWN] = Wall.WALL_TYPES.NORTH_SOUTH;

  DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.LEFT] = Wall.WALL_TYPES.NORTH_EAST;

  DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.RIGHT] = Wall.WALL_TYPES.NORTH_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.DOWN] = {};

  DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.UP] = Wall.WALL_TYPES.NORTH_SOUTH;

  DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.DOWN] = Wall.WALL_TYPES.NORTH_SOUTH;

  DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.LEFT] = Wall.WALL_TYPES.SOUTH_EAST;

  DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.RIGHT] = Wall.WALL_TYPES.SOUTH_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.LEFT] = {};

  DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.UP] = Wall.WALL_TYPES.SOUTH_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.DOWN] = Wall.WALL_TYPES.NORTH_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.LEFT] = Wall.WALL_TYPES.EAST_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.RIGHT] = Wall.WALL_TYPES.EAST_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.RIGHT] = {};

  DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.UP] = Wall.WALL_TYPES.SOUTH_EAST;

  DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.DOWN] = Wall.WALL_TYPES.NORTH_EAST;

  DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.LEFT] = Wall.WALL_TYPES.EAST_WEST;

  DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.RIGHT] = Wall.WALL_TYPES.EAST_WEST;

  Cycle = (function() {
    Cycle.STATES = CYCLE_STATES;

    function Cycle(attributes) {
      var wall, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (attributes == null) {
        attributes = {};
      }
      this.explosionStep = __bind(this.explosionStep, this);
      this.player = (_ref = attributes.player) != null ? _ref : playerAttributes[0];
      this.x = 0;
      this.y = 0;
      this.direction = (_ref1 = (_ref2 = attributes.direction) != null ? _ref2 : (_ref3 = attributes.player) != null ? _ref3.direction : void 0) != null ? _ref1 : directions.LEFT;
      this.number = (_ref4 = (_ref5 = attributes.number) != null ? _ref5 : (_ref6 = attributes.player) != null ? _ref6.number : void 0) != null ? _ref4 : 1;
      this.color = (_ref7 = (_ref8 = attributes.color) != null ? _ref8 : (_ref9 = attributes.player) != null ? _ref9.color : void 0) != null ? _ref7 : 1;
      this.state = CYCLE_STATES.RACING;
      this.game = attributes.game;
      this.explosionFrame = 0;
      this.ready = false;
      this.walls = attributes.walls != null ? (function() {
        var _i, _len, _ref10, _results;
        _ref10 = attributes.walls;
        _results = [];
        for (_i = 0, _len = _ref10.length; _i < _len; _i++) {
          wall = _ref10[_i];
          _results.push(new Wall(wall));
        }
        return _results;
      })() : [];
    }

    Cycle.property('inserting', {
      get: function() {
        return this.state === CYCLE_STATES.INSERTING;
      }
    });

    Cycle.property('racing', {
      get: function() {
        return this.state === CYCLE_STATES.RACING;
      }
    });

    Cycle.property('active', {
      get: function() {
        return this.inserting || this.racing;
      }
    });

    Cycle.prototype.navigate = function(movement) {
      if (this.ready && this.game.isStarted) {
        this.game.touch();
        switch (movement) {
          case 27:
            if (this.active) {
              return this.state = CYCLE_STATES.RACING;
            }
            break;
          case 105:
            if (this.active) {
              return this.state = CYCLE_STATES.INSERTING;
            }
            break;
          case 106:
            if (!this.inserting) {
              return this.turnDown();
            }
            break;
          case 107:
            if (!this.inserting) {
              return this.turnUp();
            }
            break;
          case 104:
            if (!this.inserting) {
              return this.turnLeft();
            }
            break;
          case 108:
            if (!this.inserting) {
              return this.turnRight();
            }
        }
      } else if (this.game.isWaiting || this.game.isRestarting || this.game.isFinished) {
        this.game.touch();
        switch (movement) {
          case 27:
            return this.ready = false;
          case 105:
            this.ready = true;
            return this.state = CYCLE_STATES.RACING;
        }
      }
    };

    Cycle.prototype.step = function() {
      switch (this.state) {
        case CYCLE_STATES.EXPLODING:
          return this.explosionStep();
        case CYCLE_STATES.DEAD:
          break;
        default:
          return this.movingStep();
      }
    };

    Cycle.prototype.movingStep = function() {
      if (this.inserting) {
        this.addWall();
      }
      switch (this.direction) {
        case directions.UP:
          if (this.y !== 0) {
            return this.y -= 1;
          }
          break;
        case directions.DOWN:
          if (this.y !== (this.game.height - 1)) {
            return this.y += 1;
          }
          break;
        case directions.LEFT:
          if (this.x !== 0) {
            return this.x -= 1;
          }
          break;
        case directions.RIGHT:
          if (this.x !== (this.game.width - 1)) {
            return this.x += 1;
          }
      }
    };

    Cycle.prototype.addWall = function() {
      return this.walls.push(new Wall({
        x: this.x,
        y: this.y,
        type: this.nextWallType(),
        direction: this.direction
      }));
    };

    Cycle.prototype.explosionStep = function() {
      if (this.explosionFrame <= 10) {
        return this.explosionFrame++;
      } else {
        return this.state = CYCLE_STATES.DEAD;
      }
    };

    Cycle.prototype.checkCollisionWith = function(object) {
      return this.x === object.x && this.y === object.y;
    };

    Cycle.prototype.checkCollisions = function(cycles) {
      var bottomWallY, cycle, rightWallX, wall, _i, _j, _len, _len1, _ref;
      if (this.state === CYCLE_STATES.RACING || this.state === CYCLE_STATES.INSERTING) {
        bottomWallY = this.game.height - 1;
        rightWallX = this.game.width - 1;
        if (this.y <= 0 || this.x <= 0 || this.y >= bottomWallY || this.x >= rightWallX) {
          this.triggerCollision();
          return;
        }
        for (_i = 0, _len = cycles.length; _i < _len; _i++) {
          cycle = cycles[_i];
          if (cycle !== this) {
            if (this.checkCollisionWith(cycle)) {
              this.triggerCollision();
              return;
            }
          }
          _ref = cycle.walls;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            wall = _ref[_j];
            if (this.checkCollisionWith(wall)) {
              this.triggerCollision();
              return;
            }
          }
        }
      }
    };

    Cycle.prototype.triggerCollision = function() {
      this.state = CYCLE_STATES.EXPLODING;
      return this.walls.length = 0;
    };

    Cycle.prototype.nextWallType = function() {
      var lastWallDirection, _ref, _ref1;
      lastWallDirection = (_ref = (_ref1 = this.walls[this.walls.length - 1]) != null ? _ref1.direction : void 0) != null ? _ref : this.direction;
      return DIRECTIONS_TO_WALL_TYPES[lastWallDirection][this.direction];
    };

    Cycle.prototype.turnLeft = function() {
      if (this.direction !== directions.RIGHT) {
        return this.direction = directions.LEFT;
      }
    };

    Cycle.prototype.turnRight = function() {
      if (this.direction !== directions.LEFT) {
        return this.direction = directions.RIGHT;
      }
    };

    Cycle.prototype.turnUp = function() {
      if (this.direction !== directions.DOWN) {
        return this.direction = directions.UP;
      }
    };

    Cycle.prototype.turnDown = function() {
      if (this.direction !== directions.UP) {
        return this.direction = directions.DOWN;
      }
    };

    Cycle.prototype.makeWinner = function() {
      return this.state = Cycle.STATES.WINNER;
    };

    Cycle.prototype.toJSON = function() {
      var wall;
      return {
        number: this.number,
        x: this.x,
        y: this.y,
        color: this.color,
        state: this.state,
        direction: this.direction,
        explosionFrame: this.explosionFrame,
        walls: (function() {
          var _i, _len, _ref, _results;
          _ref = this.walls;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            wall = _ref[_i];
            _results.push(wall.toJSON());
          }
          return _results;
        }).call(this),
        ready: this.ready
      };
    };

    return Cycle;

  })();

  module.exports = Cycle;

}).call(this);

//# sourceMappingURL=../../maps/cycle.js.map

},{"../define_property":2,"./directions":4,"./player_attributes":6,"./wall":7}],4:[function(require,module,exports){
(function() {
  module.exports = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
  };

}).call(this);

//# sourceMappingURL=../../maps/directions.js.map

},{}],5:[function(require,module,exports){
(function() {
  var Cycle, EventEmitter, Game, Moniker, directions, playerAttributes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('../define_property');

  require('moniker');

  EventEmitter = require('events').EventEmitter;

  Moniker = require('moniker');

  directions = require('./directions');

  playerAttributes = require('./player_attributes');

  Cycle = require('./cycle');

  Game = (function(_super) {
    __extends(Game, _super);

    Game.STATES = {
      WAITING: 0,
      COUNTDOWN: 1,
      STARTED: 2,
      FINISHED: 3,
      RESTARTING: 4
    };

    function Game(attributes) {
      var n, _ref, _ref1, _ref2, _ref3;
      if (attributes == null) {
        attributes = {};
      }
      this.countdown = __bind(this.countdown, this);
      this.runGame = __bind(this.runGame, this);
      this.loop = __bind(this.loop, this);
      this.touch = __bind(this.touch, this);
      this.lastUpdated = Date.now();
      this.name = (_ref = attributes.name) != null ? _ref : Moniker.choose();
      this.numberOfPlayers = (_ref1 = attributes.numberOfPlayers) != null ? _ref1 : 1;
      this.availablePlayers = ((function() {
        var _i, _ref2, _results;
        _results = [];
        for (n = _i = 0, _ref2 = this.numberOfPlayers; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; n = 0 <= _ref2 ? ++_i : --_i) {
          _results.push(playerAttributes[n]);
        }
        return _results;
      }).call(this)).reverse();
      this.width = (_ref2 = attributes.width) != null ? _ref2 : 80;
      this.height = (_ref3 = attributes.height) != null ? _ref3 : 22;
      this.cycles = [];
      this.state = Game.STATES.WAITING;
      this._count = 6000;
    }

    Game.property('isWaiting', {
      get: function() {
        return this.state === Game.STATES.WAITING;
      }
    });

    Game.property('isCountingDown', {
      get: function() {
        return this.state === Game.STATES.COUNTDOWN;
      }
    });

    Game.property('isStarted', {
      get: function() {
        return this.state === Game.STATES.STARTED;
      }
    });

    Game.property('isFinished', {
      get: function() {
        return this.state === Game.STATES.FINISHED;
      }
    });

    Game.property('isRestarting', {
      get: function() {
        return this.state === Game.STATES.RESTARTING;
      }
    });

    Game.property('readyCycleCount', {
      get: function() {
        var count, cycle, _i, _len, _ref;
        count = 0;
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          if (cycle.ready) {
            count++;
          }
        }
        return count;
      }
    });

    Game.property('activeCycleCount', {
      get: function() {
        var count, cycle, _i, _len, _ref;
        count = 0;
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          if (cycle.state !== Cycle.STATES.DEAD) {
            count++;
          }
        }
        return count;
      }
    });

    Game.property('outdated', {
      get: function() {
        return (Date.now() - this.lastUpdated) > 180000;
      }
    });

    Game.prototype.touch = function() {
      return this.lastUpdated = Date.now();
    };

    Game.prototype.addCycle = function() {
      var attributes, cycle, player;
      if (this.inProgress || this.availablePlayers.length === 0) {
        return null;
      }
      player = this.availablePlayers.pop();
      attributes = {
        player: player,
        game: this
      };
      cycle = new Cycle(attributes);
      this.cycles.push(cycle);
      this.touch();
      return cycle;
    };

    Game.prototype.removeCycle = function(cycle) {
      var index;
      this.touch();
      this.availablePlayers.push(cycle.player);
      index = this.cycles.indexOf(cycle);
      this.cycles.splice(index, 1);
      if (this.inProgress) {
        this.checkForWinner();
      }
      return this.checkKillGame();
    };

    Game.prototype.checkForWinner = function() {
      var endGameCount;
      endGameCount = this.isPractice ? 0 : 1;
      if (this.activeCycleCount <= endGameCount) {
        return this.finishGame();
      }
    };

    Game.prototype.checkKillGame = function() {
      if (this.activeCycleCount < 1) {
        return this.stop();
      }
    };

    Game.prototype.start = function() {
      this.loop();
      return this.gameLoop = setInterval(this.loop, 100);
    };

    Game.prototype.loop = function() {
      switch (this.state) {
        case Game.STATES.WAITING:
        case Game.STATES.RESTARTING:
          this.checkIfGameStarts();
          break;
        case Game.STATES.COUNTDOWN:
          this.countdown();
          break;
        case Game.STATES.STARTED:
          this.runGame();
          break;
        case Game.STATES.FINISHED:
          this.checkIfGameRestarting();
      }
      return this.emit('game', this);
    };

    Game.prototype.runGame = function() {
      var cycle, _i, _len, _ref;
      _ref = this.cycles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        if (cycle != null) {
          cycle.step();
        }
        if (cycle != null) {
          cycle.checkCollisions(this.cycles);
        }
      }
      return this.checkForWinner();
    };

    Game.prototype.countdown = function() {
      this._count -= 100;
      if (this._count <= 0) {
        return this.state = Game.STATES.STARTED;
      }
    };

    Game.prototype.checkIfGameStarts = function() {
      var cycle, i, playerPosition, playerPositions, _i, _len, _ref, _results;
      if (this.readyCycleCount === this.numberOfPlayers) {
        this._count = 6000;
        this.state = Game.STATES.COUNTDOWN;
        playerPositions = this.calculatePlayerPositions();
        _ref = this.cycles;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cycle = _ref[i];
          i = Math.floor(Math.random() * playerPositions.length);
          playerPosition = playerPositions[i];
          playerPositions.splice(i, 1);
          cycle.x = playerPosition['x'];
          cycle.y = playerPosition['y'];
          _results.push(cycle.direction = playerPosition['direction']);
        }
        return _results;
      }
    };

    Game.prototype.checkIfGameRestarting = function() {
      var cycle, _i, _len, _ref;
      if (this.cycles.some(function(cycle) {
        return cycle.ready;
      })) {
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          cycle.walls = [];
        }
        return this.state = Game.STATES.RESTARTING;
      }
    };

    Game.prototype.finishGame = function() {
      var cycle, _i, _len, _ref;
      this.state = Game.STATES.FINISHED;
      _ref = this.cycles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        cycle.ready = false;
      }
      if (!this.isPractice) {
        return this.determineWinner();
      }
    };

    Game.prototype.stop = function() {
      clearInterval(this.gameLoop);
      return this.emit('stopped', this);
    };

    Game.prototype.determineWinner = function() {
      var cycle, _i, _len, _ref, _results;
      _ref = this.cycles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        if (cycle.state !== Cycle.STATES.DEAD) {
          _results.push(cycle.makeWinner());
        }
      }
      return _results;
    };

    Game.property('inProgress', {
      get: function() {
        return this.state !== Game.STATES.WAITING && this.state !== Game.STATES.RESTARTING;
      }
    });

    Game.property('isPractice', {
      get: function() {
        return this.numberOfPlayers === 1;
      }
    });

    Game.property('count', {
      get: function() {
        return Math.ceil(this._count / 2000.0);
      },
      set: function(value) {
        return this._count = 2000.0 * value;
      }
    });

    Game.prototype.calculatePlayerPositions = function() {
      var halfXDistance, halfYDistance, maxXDistance, maxYDistance, minXDistance, minYDistance;
      minXDistance = 3;
      maxXDistance = this.width - minXDistance;
      halfXDistance = Math.round(this.width / 2);
      minYDistance = 3;
      maxYDistance = this.height - minXDistance;
      halfYDistance = Math.round(this.height / 2);
      return [
        {
          x: minXDistance,
          y: minYDistance,
          direction: directions.RIGHT
        }, {
          x: maxXDistance,
          y: maxYDistance,
          direction: directions.LEFT
        }, {
          x: minXDistance,
          y: maxYDistance,
          direction: directions.UP
        }, {
          x: maxXDistance,
          y: minYDistance,
          direction: directions.DOWN
        }, {
          x: halfXDistance,
          y: minYDistance,
          direction: directions.DOWN
        }, {
          x: halfXDistance,
          y: maxYDistance,
          direction: directions.UP
        }, {
          x: minXDistance,
          y: halfYDistance,
          direction: directions.RIGHT
        }, {
          x: maxXDistance,
          y: halfYDistance,
          direction: directions.LEFT
        }
      ];
    };

    Game.prototype.toJSON = function() {
      var cycle;
      return {
        name: this.name,
        state: this.state,
        count: this.count,
        numberOfPlayers: this.numberOfPlayers,
        width: this.width,
        height: this.height,
        cycles: (function() {
          var _i, _len, _ref, _results;
          _ref = this.cycles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cycle = _ref[_i];
            _results.push(cycle.toJSON());
          }
          return _results;
        }).call(this),
        isPractice: this.isPractice
      };
    };

    return Game;

  })(EventEmitter);

  module.exports = Game;

}).call(this);

//# sourceMappingURL=../../maps/game.js.map

},{"../define_property":2,"./cycle":3,"./directions":4,"./player_attributes":6,"events":20,"moniker":24}],6:[function(require,module,exports){
(function() {
  var directions;

  directions = require('./directions');

  module.exports = [
    {
      number: 1,
      direction: directions.RIGHT,
      color: 6
    }, {
      number: 2,
      direction: directions.LEFT,
      color: 1
    }, {
      number: 3,
      direction: directions.UP,
      color: 3
    }, {
      number: 4,
      direction: directions.DOWN,
      color: 4
    }, {
      number: 5,
      direction: directions.DOWN,
      color: 7
    }, {
      number: 6,
      direction: directions.UP,
      color: 2
    }
  ];

}).call(this);

//# sourceMappingURL=../../maps/player_attributes.js.map

},{"./directions":4}],7:[function(require,module,exports){
(function() {
  var WALL_TYPES, Wall, buffer;

  buffer = require('../client/buffer');

  WALL_TYPES = {
    EAST_WEST: 0,
    NORTH_SOUTH: 1,
    SOUTH_WEST: 2,
    NORTH_WEST: 3,
    NORTH_EAST: 4,
    SOUTH_EAST: 5
  };

  Wall = (function() {
    Wall.WALL_TYPES = WALL_TYPES;

    function Wall(attributes) {
      this.x = attributes.x;
      this.y = attributes.y;
      this.type = attributes.type;
      this.direction = attributes.direction;
    }

    Wall.prototype.toJSON = function() {
      return {
        x: this.x,
        y: this.y,
        type: this.type,
        direction: this.direction
      };
    };

    return Wall;

  })();

  module.exports = Wall;

}).call(this);

//# sourceMappingURL=../../maps/wall.js.map

},{"../client/buffer":1}],8:[function(require,module,exports){
(function() {
  var $, GameListView, GameView, WebClient, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  socketio = require('socket.io-client');

  GameView = require('./views/game_view');

  GameListView = require('./views/game_list_view');

  require('../define_property');

  WebClient = (function() {
    function WebClient(address, port) {
      this.address = address != null ? address : "127.0.0.1";
      this.port = port != null ? port : 8766;
      this.onGames = __bind(this.onGames, this);
      this.andListGames = __bind(this.andListGames, this);
      this.connectError = __bind(this.connectError, this);
      this.onGameUpdate = __bind(this.onGameUpdate, this);
      this.showErrorMessage = __bind(this.showErrorMessage, this);
      this.andJoinGame = __bind(this.andJoinGame, this);
      this.errorMessages = [];
    }

    WebClient.property('url', {
      get: function() {
        return "http://" + this.address + ":" + this.port;
      }
    });

    WebClient.prototype.join = function(gameAttributes) {
      this.gameAttributes = gameAttributes;
      this.checkValidity();
      this.gameView = new GameView;
      this.connect(this.andJoinGame);
      return this.listenToEvents();
    };

    WebClient.prototype.listenToEvents = function() {
      var _this = this;
      return $(document).keyup(function(event) {
        var translatedCode;
        translatedCode = _this.translate(event.keyCode);
        switch (translatedCode) {
          case 113:
            return _this.quit();
          default:
            return _this.socket.emit('movement', translatedCode);
        }
      });
    };

    WebClient.prototype.translate = function(keyCode) {
      switch (keyCode) {
        case 76:
          return 108;
        case 73:
          return 105;
        case 74:
          return 106;
        case 75:
          return 107;
        case 72:
          return 104;
        case 81:
          return 113;
        default:
          return keyCode;
      }
    };

    WebClient.prototype.quit = function() {
      return this.socket.disconnect();
    };

    WebClient.prototype.andJoinGame = function() {
      var _this = this;
      return this.socket.emit('join', this.gameAttributes, function(error, cycleNumber, game) {
        if (error != null) {
          return _this.showErrorMessage(error.message);
        }
        _this.cycleNumber = cycleNumber;
        _this.onGameUpdate(game);
        _this.socket.on('game', _this.onGameUpdate);
        return _this.socket.on('disconnect', _this.quit);
      });
    };

    WebClient.prototype.showErrorMessage = function(message) {
      return this.errorMessages.push(message);
    };

    WebClient.prototype.onGameUpdate = function(game) {
      this.gameView.game = game;
      this.gameView.cycleNumber = this.cycleNumber;
      return this.gameView.render();
    };

    WebClient.prototype.checkValidity = function() {
      var check, errorChecks, errors, message,
        _this = this;
      errorChecks = {
        "Width cannot be smaller than 80": function() {
          if (_this.gameAttributes.width) {
            return _this.gameAttributes.width < 80;
          }
        },
        "Width cannot be greater than screen size": function() {
          if (_this.gameAttributes.width) {
            return _this.gameAttributes.width > screen.columns;
          }
        },
        "Height cannot be smaller than 22": function() {
          if (_this.gameAttributes.width) {
            return _this.gameAttributes.width < 22;
          }
        },
        "Height cannot be greater than screen size": function() {
          if (_this.gameAttributes.height) {
            return _this.gameAttributes.height > screen.rows - 2;
          }
        },
        "Number of players must be between 1 to 6": function() {
          if (_this.gameAttributes.numberOfPlayers) {
            return _this.gameAttributes.numberOfPlayers < 1 || _this.gameAttributes.numberOfPlayers > 6;
          }
        }
      };
      errors = (function() {
        var _results;
        _results = [];
        for (message in errorChecks) {
          check = errorChecks[message];
          if (check()) {
            _results.push(message);
          }
        }
        return _results;
      })();
      if (errors.length > 0) {
        throw new Error("The game parameters are invalid:\n\n" + (errors.join('\n')));
      }
    };

    WebClient.prototype.listGames = function() {
      return this.connect(this.andListGames);
    };

    WebClient.prototype.connect = function(callback) {
      var _this = this;
      if (this.socket) {
        return callback();
      } else {
        if (!this.socket) {
          this.socket = socketio.connect(this.url);
        }
        this.socket.on('connect', callback);
        this.socket.on('connect_error', this.connectError);
        this.socket.on('connect_timeout', this.connectError);
        this.socket.on('error', this.connectError);
        return this.socket.on('connecting', function() {
          return console.log("Connecting to " + _this.url + " ...\n");
        });
      }
    };

    WebClient.prototype.connectError = function(error) {
      console.log(error);
      return console.log("Failed to connect to " + this.url + "\n");
    };

    WebClient.prototype.andListGames = function() {
      this.gameListView = new GameListView;
      this.socket.on('games', this.onGames);
      return this.socket.emit('list');
    };

    WebClient.prototype.onGames = function(games) {
      var _this = this;
      this.gameListView.addGames(games);
      this.gameListView.render();
      return $('.waiting-game').find('a').click(function(event) {
        var gameName;
        event.stopPropagation();
        gameName = $(event.target).attr('data-name');
        return _this.join({
          name: gameName
        });
      });
    };

    return WebClient;

  })();

  module.exports = WebClient;

}).call(this);

//# sourceMappingURL=../../maps/index.js.map

},{"../define_property":2,"./views/game_list_view":12,"./views/game_view":13,"jquery":23,"socket.io-client":93}],9:[function(require,module,exports){
(function() {
  var $, WebClient;

  WebClient = require('./');

  $ = require('jquery');

  $(function() {
    var client;
    client = new WebClient();
    return client.listGames();
  });

}).call(this);

//# sourceMappingURL=../../maps/start.js.map

},{"./":8,"jquery":23}],10:[function(require,module,exports){
(function() {
  module.exports = {
    DIMENSION_SCALE: 10
  };

}).call(this);

//# sourceMappingURL=../../../maps/constants.js.map

},{}],11:[function(require,module,exports){
(function() {
  var CONSTANTS, CYCLE_CHAR, Cycle, CycleView, Game, WallView, directions, pixi, playerColors;

  require('../../define_property');

  pixi = require('pixi');

  directions = require('../../models/directions');

  playerColors = require('./player_colors');

  CONSTANTS = require('./constants');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  WallView = require('./wall_view');

  CYCLE_CHAR = {};

  CycleView = (function() {
    var _this = this;

    CycleView.CYCLE_CHARS = CYCLE_CHAR;

    function CycleView(game) {
      this.game = game;
      this.wallViews = [];
      Object.defineProperty(this, 'nameX', {
        get: this._nameX
      });
      Object.defineProperty(this, 'nameY', {
        get: this._nameY
      });
    }

    CycleView.property('cycle', {
      set: function(cycle) {
        this._cycle = cycle;
        return this.generateWallViews();
      },
      get: function() {
        return this._cycle;
      }
    });

    CycleView.prototype.character = function() {
      var explosionIndex;
      if (this._cycle.state === Cycle.STATES.EXPLODING) {
        explosionIndex = this._cycle.explosionFrame % 3;
        return CYCLE_EXPLOSION[explosionIndex];
      } else if (this._cycle.state === Cycle.STATES.DEAD) {
        return CYCLE_EXPLODED;
      } else {
        return CYCLE_CHAR[this._cycle.direction];
      }
    };

    CycleView.prototype.nextX = function() {
      return (this._cycle.x + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.nextY = function() {
      return (this._cycle.y + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.createCycleCharacter = function() {
      this.cycleCharacter = new pixi.Graphics();
      this.cycle_color = playerColors(this._cycle.number)['web'];
      this.cycleCharacter.lineStyle(2, this.cycle_color);
      return this.cycleCharacter.drawCircle(0, 0, 5);
    };

    CycleView.prototype.render = function(stage) {
      if (this.cycleCharacter === void 0) {
        this.createCycleCharacter();
      }
      this.cycleCharacter.position.x = this.nextX();
      this.cycleCharacter.position.y = this.nextY();
      if (!(stage.children.indexOf(this.cycleCharacter) > 0)) {
        stage.addChild(this.cycleCharacter);
      }
      return this.renderWallViews(stage);
    };

    CycleView.prototype.generateWallViews = function() {
      var wall, _i, _len, _ref, _results;
      _ref = this._cycle.walls;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wall = _ref[_i];
        _results.push(this.createNewWallViews(wall));
      }
      return _results;
    };

    CycleView.prototype.createNewWallViews = function(wall) {
      var wallView;
      wallView = this.wallViews.filter(function(view) {
        return view.wall === wall;
      })[0];
      if (wallView === void 0) {
        wallView = new WallView(wall, this.cycle_color);
        this.wallViews.push(wallView);
        return wallView.wall = wall;
      }
    };

    CycleView.prototype.renderWallViews = function(stage) {
      var wallView, _i, _len, _ref, _results;
      _ref = this.wallViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wallView = _ref[_i];
        _results.push(wallView.render(stage));
      }
      return _results;
    };

    CycleView.prototype.renderName = function() {};

    CycleView.property('nameX', function() {});

    CycleView.property('nameY', function() {
      return CycleView._cycle.y + 1;
    });

    CycleView.prototype.renderWinnerMessage = function() {
      var messageX, messageY;
      messageX = this._cycle.x - 1;
      return messageY = this._cycle.y;
    };

    return CycleView;

  }).call(this);

  module.exports = CycleView;

}).call(this);

//# sourceMappingURL=../../../maps/cycle_view.js.map

},{"../../define_property":2,"../../models/cycle":3,"../../models/directions":4,"../../models/game":5,"./constants":10,"./player_colors":14,"./wall_view":15,"pixi":62}],12:[function(require,module,exports){
(function() {
  var $, Game, GameListView;

  Game = require('../../models/game');

  $ = require('jquery');

  GameListView = (function() {
    function GameListView() {}

    GameListView.prototype.addGames = function(games) {
      return this.activeGames = games;
    };

    GameListView.prototype.render = function() {
      var game, _i, _len, _ref, _results;
      _ref = this.activeGames;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        game = _ref[_i];
        _results.push($('#game-list').append("<li class='waiting-game'>" + game.name + " <a href='#' data-name='" + game.name + "'>join</a></li>"));
      }
      return _results;
    };

    return GameListView;

  })();

  module.exports = GameListView;

}).call(this);

//# sourceMappingURL=../../../maps/game_list_view.js.map

},{"../../models/game":5,"jquery":23}],13:[function(require,module,exports){
(function() {
  var $, CONSTANTS, Cycle, CycleView, Game, GameView, pixi, playerColors,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  require('../../define_property');

  pixi = require('pixi');

  playerColors = require('./player_colors');

  CONSTANTS = require('./constants');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  CycleView = require('./cycle_view');

  GameView = (function() {
    function GameView() {
      this.animate = __bind(this.animate, this);
      this.setStage = __bind(this.setStage, this);
      this.cycleViews = [];
      this.countString = '';
    }

    GameView.property('state', {
      get: function() {
        var _ref;
        return (_ref = this._game) != null ? _ref.state : void 0;
      }
    });

    GameView.property('stateString', {
      get: function() {
        var _ref;
        switch ((_ref = this._game) != null ? _ref.state : void 0) {
          case Game.STATES.WAITING:
            return 'Waiting for other players';
          case Game.STATES.COUNTDOWN:
            return 'Get ready';
          case Game.STATES.STARTED:
            return 'Go';
          case Game.STATES.FINISHED:
            return 'Game over';
        }
      }
    });

    GameView.property('game', {
      set: function(game) {
        this._game = game;
        if (!this.stage) {
          this.setStage();
        }
        if (this.state === Game.STATES.COUNTDOWN) {
          if (this._game.count !== this.lastCount && this.state === Game.STATES.COUNTDOWN) {
            this.lastCount = this._game.count;
            this.countString += "" + this._game.count + "...";
          }
        } else {
          delete this.lastCount;
          this.countString = '';
        }
        return this.generateCycleViews();
      },
      get: function() {
        return this._game;
      }
    });

    GameView.prototype.setStage = function() {
      var height, walls, width;
      this.stage = new pixi.Stage(0xaaaaaa);
      width = this._game.width * CONSTANTS.DIMENSION_SCALE;
      height = this._game.height * CONSTANTS.DIMENSION_SCALE;
      this.renderer = pixi.autoDetectRenderer(width, height);
      document.body.appendChild(this.renderer.view);
      requestAnimationFrame(this.animate);
      walls = new pixi.Graphics();
      walls.lineStyle(3, 0x000000, 1);
      walls.drawRect(0, 0, width, height);
      return this.stage.addChild(walls);
    };

    GameView.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.renderer.render(this.stage);
    };

    GameView.prototype.render = function() {
      $('#game-status').html(this.stateString);
      if (this.state === Game.STATES.WAITING || (this.state === Game.STATES.RESTARTING && this.playerCycle.ready)) {
        this.renderWaitScreen();
      } else if (this.state === Game.STATES.COUNTDOWN) {
        this.renderCountdown();
      } else if (this.state === Game.STATES.FINISHED || this.state === Game.STATES.RESTARTING) {
        this.renderFinishScreen();
      } else {
        this.renderArena();
        this.renderCycleViews();
      }
      return this.renderGameInfo();
    };

    GameView.prototype.renderWaitScreen = function() {
      return $('#game-status').html(this.stateString);
    };

    GameView.prototype.renderCountdown = function() {
      return $('#game-status').html(this.countString);
    };

    GameView.prototype.renderFinishScreen = function() {
      return $('#game-status').html(this.stateString);
    };

    GameView.prototype.renderArena = function() {};

    GameView.prototype.generateCycleViews = function() {
      var cycle, _i, _len, _ref, _results;
      _ref = this._game.cycles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        _results.push(this.createOrUpdateCycleView(cycle));
      }
      return _results;
    };

    GameView.prototype.createOrUpdateCycleView = function(cycle) {
      var cycleView;
      cycleView = this.cycleViews.filter(function(view) {
        return view.cycle.number === cycle.number;
      })[0];
      if (cycleView === void 0) {
        cycleView = new CycleView(this._game);
        this.cycleViews.push(cycleView);
      }
      return cycleView.cycle = cycle;
    };

    GameView.prototype.renderCycleViews = function() {
      var cycle_view, _i, _len, _ref;
      _ref = this.cycleViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle_view = _ref[_i];
        cycle_view.render(this.stage);
      }
      return true;
    };

    GameView.prototype.renderGameInfo = function() {};

    return GameView;

  })();

  module.exports = GameView;

}).call(this);

//# sourceMappingURL=../../../maps/game_view.js.map

},{"../../define_property":2,"../../models/cycle":3,"../../models/game":5,"./constants":10,"./cycle_view":11,"./player_colors":14,"jquery":23,"pixi":62}],14:[function(require,module,exports){
(function() {
  var colors;

  colors = {
    1: {
      'cli': 6,
      'web': 0x49ffff
    },
    2: {
      'cli': 1,
      'web': 0xff0000
    },
    3: {
      'cli': 3,
      'web': 0xffff00
    },
    4: {
      'cli': 4,
      'web': 0x0000ff
    },
    5: {
      'cli': 7,
      'web': 0xffffff
    },
    6: {
      'cli': 2,
      'web': 0x4fff00
    }
  };

  module.exports = function(cycleNumber) {
    return colors[cycleNumber];
  };

}).call(this);

//# sourceMappingURL=../../../maps/player_colors.js.map

},{}],15:[function(require,module,exports){
(function() {
  var CONSTANTS, Wall, WallView, pixi;

  pixi = require('pixi');

  CONSTANTS = require('./constants');

  Wall = require('../../models/wall');

  WallView = (function() {
    function WallView(wall, color) {
      this.wall = wall;
      this.color = color;
    }

    WallView.prototype.wallX = function() {
      return (this.wall.x + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    WallView.prototype.wallY = function() {
      return (this.wall.y + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    WallView.prototype.render = function(stage) {
      if (this.wallCharacter === void 0) {
        return this.createWallCharacter(stage);
      }
    };

    WallView.prototype.createWallCharacter = function(stage) {
      this.wallCharacter = new pixi.Graphics();
      this.wallCharacter.lineStyle(2, this.color);
      this.wallCharacter.drawRect(0, 0, 2, 2);
      this.wallCharacter.position.x = this.wallX();
      this.wallCharacter.position.y = this.wallY();
      if (!(stage.children.indexOf(this.wallCharacter) > 0)) {
        return stage.addChild(this.wallCharacter);
      }
    };

    return WallView;

  })();

  module.exports = WallView;

}).call(this);

//# sourceMappingURL=../../../maps/wall_view.js.map

},{"../../models/wall":7,"./constants":10,"pixi":62}],16:[function(require,module,exports){

},{}],17:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  if (encoding === 'base64' && type === 'string') {
    subject = base64clean(subject)
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str.toString()
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.compare = function (a, b) {
  assert(Buffer.isBuffer(a) && Buffer.isBuffer(b), 'Arguments must be Buffers')
  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) {
    return -1
  }
  if (y < x) {
    return 1
  }
  return 0
}

// BUFFER INSTANCE METHODS
// =======================

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end === undefined) ? self.length : Number(end)

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = asciiSlice(self, start, end)
      break
    case 'binary':
      ret = binarySlice(self, start, end)
      break
    case 'base64':
      ret = base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

Buffer.prototype.equals = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.compare = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return readUInt16(this, offset, false, noAssert)
}

function readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return readInt16(this, offset, false, noAssert)
}

function readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return readInt32(this, offset, false, noAssert)
}

function readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return readFloat(this, offset, false, noAssert)
}

function readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
  return offset + 1
}

function writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
  return offset + 2
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, false, noAssert)
}

function writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
  return offset + 4
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
  return offset + 1
}

function writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
  return offset + 2
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, false, noAssert)
}

function writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
  return offset + 4
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, false, noAssert)
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":18,"ieee754":19}],18:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],19:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],21:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("FWaASH"))
},{"FWaASH":22}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],23:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],24:[function(require,module,exports){
(function (__dirname){
var Fs = require('fs'),
    Path = require('path');

exports.choose = choose;
exports.noun = noun;
exports.verb = verb;
exports.adjective = adjective;
exports.read = read;
exports.generator = generator;
exports.Dictionary = Dictionary;
exports.Generator = Generator;


// ## Shortcuts ##

function noun(opt) {
  return read(builtin('nouns'), opt);
}

function verb(opt) {
  return read(builtin('verbs'), opt);
}

function adjective(opt) {
  return read(builtin('adjectives'), opt);
}

function read(path, opt) {
  return (new Dictionary()).read(path, opt);
}

function generator(dicts, opt) {
  var gen = new Generator(opt);

  dicts.forEach(function(dict) {
    gen.use(dict, opt);
  });

  return gen;
}

var _names;
function choose() {
  if (!_names)
    _names = generator([adjective, noun]);
  return _names.choose();
}


// ## Dictionary ##

function Dictionary() {
  this.words = [];
}

Dictionary.prototype.read = function(path, opt) {
  var words = this.words,
      maxSize = opt && opt.maxSize,
      enc = (opt && opt.encoding) || 'utf-8',
      data = Fs.readFileSync(path, enc);

  data.split(/\s+/).forEach(function(word) {
    if (word && (!maxSize || word.length <= maxSize))
      words.push(word);
  });

  return this;
};

Dictionary.prototype.choose = function() {
  return this.words[random(this.words.length)];
};


// ## Generator ##

function Generator(opt) {
  this.dicts = [];
  this.glue = (opt && opt.glue) || '-';
}

Generator.prototype.choose = function() {
  var dicts = this.dicts,
      size = dicts.length;

  if (size === 0)
    throw new Error('no available dictionaries.');

  if (size === 1)
    return dicts[0].choose();

  var probe, tries = 10, used = {};
  var seq = dicts.map(function(dict) {
    for (var i = 0; i < tries; i++) {
      if (!used.hasOwnProperty(probe = dict.choose()))
        break;
    }

    if (i === tries)
      throw new Error('too many tries to find a unique word');

    used[probe] = true;
    return probe;
  });

  return seq.join(this.glue);
};

Generator.prototype.use = function(dict, opt) {
  var dicts = this.dicts;

  if (dict instanceof Dictionary)
    dicts.push(dict);
  if (typeof dict == 'string')
    dicts.push((new Dictionary()).read(dict, opt));
  else if (typeof dict == 'function')
    dicts.push(dict(opt));
  else
    next(new Error('unrecognized dictionary type'));

  return this;
};


// ## Helpers ##

function builtin(name) {
  return Path.join(__dirname, '../dict', name + '.txt');
}

function random(limit) {
  return Math.floor(Math.random() * limit);
}

}).call(this,"/../../node_modules/moniker/lib")
},{"fs":16,"path":21}],25:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function InteractionData(){this.global=new Point,this.local=new Point,this.target=null,this.originalEvent=null}function InteractionManager(a){this.stage=a,this.mouse=new InteractionData,this.touchs={},this.tempPoint=new Point,this.mouseoverEnabled=!0,this.pool=[],this.interactiveItems=[],this.interactionDOMElement=null,this.last=0}var globals=require("./core/globals"),Point=require("./geom/Point"),Sprite=require("./display/Sprite"),platform=require("./platform");InteractionData.prototype.getLocalPosition=function(a){var b=a.worldTransform,c=this.global,d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=1/(d*h+e*-g);return new Point(h*j*c.x+-e*j*c.y+(i*e-f*h)*j,d*j*c.y+-g*j*c.x+(-i*d+f*g)*j)};var proto=InteractionManager.prototype;proto.handleEvent=function(a){switch(a.type){case"mousedown":this.onMouseDown(a);break;case"mousemove":this.onMouseMove(a);break;case"mouseup":this.onMouseUp(a);break;case"mouseout":this.onMouseOut(a);break;case"touchstart":this.onTouchStart(a);break;case"touchmove":this.onTouchMove(a);break;case"touchend":this.onTouchEnd(a)}},proto.collectInteractiveSprite=function(a,b){for(var c=a.children,d=c.length-1;d>=0;d--){var e=c[d];e.interactive?(b.interactiveChildren=!0,this.interactiveItems.push(e),e.children.length>0&&this.collectInteractiveSprite(e,e)):(e.__iParent=null,e.children.length>0&&this.collectInteractiveSprite(e,b))}},proto.setTarget=function(a){a?null===this.interactionDOMElement&&this.setTargetDomElement(a.view):null!==this.target&&platform.window.removeEventListener("mouseup",this,!0),platform.window.addEventListener("mouseup",this,!0),this.target=a},proto.setTargetDomElement=function(a){null!==this.interactionDOMElement&&(this.interactionDOMElement.style["-ms-content-zooming"]="",this.interactionDOMElement.style["-ms-touch-action"]="",this.interactionDOMElement.removeEventListener("mousemove",this,!0),this.interactionDOMElement.removeEventListener("mousedown",this,!0),this.interactionDOMElement.removeEventListener("mouseout",this,!0),this.interactionDOMElement.removeEventListener("touchstart",this,!0),this.interactionDOMElement.removeEventListener("touchend",this,!0),this.interactionDOMElement.removeEventListener("touchmove",this,!0));var b=platform.navigator;b&&b.msPointerEnabled&&(a.style["-ms-content-zooming"]="none",a.style["-ms-touch-action"]="none"),a.addEventListener("mousemove",this,!0),a.addEventListener("mousedown",this,!0),a.addEventListener("mouseout",this,!0),a.addEventListener("touchstart",this,!0),a.addEventListener("touchend",this,!0),a.addEventListener("touchmove",this,!0),this.interactionDOMElement=a},proto.update=function(){if(this.target){var a=Date.now(),b=a-this.last;if(b=30*b/1e3,!(1>b)){this.last=a;var c,d;if(this.dirty){for(this.dirty=!1,c=0,d=this.interactiveItems.length;d>c;c++)this.interactiveItems[c].interactiveChildren=!1;this.interactiveItems=[],this.stage.interactive&&this.interactiveItems.push(this.stage),this.collectInteractiveSprite(this.stage,this.stage)}for(this.interactionDOMElement.style.cursor="inherit",c=0,d=this.interactiveItems.length;d>c;c++){var e=this.interactiveItems[c];(e.mouseover||e.mouseout||e.buttonMode)&&(e.__hit=this.hitTest(e,this.mouse),this.mouse.target=e,e.__hit?(e.buttonMode&&(this.interactionDOMElement.style.cursor=e.defaultCursor),e.__isOver||(e.mouseover&&e.mouseover(this.mouse),e.__isOver=!0)):e.__isOver&&(e.mouseout&&e.mouseout(this.mouse),e.__isOver=!1))}}}},proto.onMouseMove=function(a){this.mouse.originalEvent=a;var b=this.interactionDOMElement.getBoundingClientRect();this.mouse.global.x=(a.clientX-b.left)*(this.target.width/b.width),this.mouse.global.y=(a.clientY-b.top)*(this.target.height/b.height);for(var c=0,d=this.interactiveItems.length;d>c;c++){var e=this.interactiveItems[c];e.mousemove&&e.mousemove(this.mouse)}},proto.onMouseDown=function(a){this.mouse.originalEvent=a;for(var b=0,c=this.interactiveItems.length;c>b;b++){var d=this.interactiveItems[b];if((d.mousedown||d.click)&&(d.__mouseIsDown=!0,d.__hit=this.hitTest(d,this.mouse),d.__hit&&(d.mousedown&&d.mousedown(this.mouse),d.__isDown=!0,!d.interactiveChildren)))break}},proto.onMouseOut=function(){this.interactionDOMElement.style.cursor="inherit";for(var a=0,b=this.interactiveItems.length;b>a;a++){var c=this.interactiveItems[a];c.__isOver&&(this.mouse.target=c,c.mouseout&&c.mouseout(this.mouse),c.__isOver=!1)}},proto.onMouseUp=function(a){this.mouse.originalEvent=a;for(var b=!1,c=0,d=this.interactiveItems.length;d>c;c++){var e=this.interactiveItems[c];(e.mouseup||e.mouseupoutside||e.click)&&(e.__hit=this.hitTest(e,this.mouse),e.__hit&&!b?(e.mouseup&&e.mouseup(this.mouse),e.__isDown&&e.click&&e.click(this.mouse),e.interactiveChildren||(b=!0)):e.__isDown&&e.mouseupoutside&&e.mouseupoutside(this.mouse),e.__isDown=!1)}},proto.hitTest=function(a,b){var c=b.global;if(a.vcount!==globals.visibleCount)return!1;var d=a instanceof Sprite,e=a.worldTransform,f=e[0],g=e[1],h=e[2],i=e[3],j=e[4],k=e[5],l=1/(f*j+g*-i),m=j*l*c.x+-g*l*c.y+(k*g-h*j)*l,n=f*l*c.y+-i*l*c.x+(-k*f+h*i)*l;if(b.target=a,a.hitArea&&a.hitArea.contains)return a.hitArea.contains(m,n)?(b.target=a,!0):!1;if(d){var o,p=a.texture.frame.width,q=a.texture.frame.height,r=-p*a.anchor.x;if(m>r&&r+p>m&&(o=-q*a.anchor.y,n>o&&o+q>n))return b.target=a,!0}for(var s=0,t=a.children.length;t>s;s++){var u=a.children[s],v=this.hitTest(u,b);if(v)return b.target=a,!0}return!1},proto.onTouchMove=function(a){var b,c,d,e,f,g,h,i=this.interactionDOMElement.getBoundingClientRect(),j=a.changedTouches;for(b=0,c=j.length;c>b;b++)for(d=j[b],e=this.touchs[d.identifier],e.originalEvent=a,e.global.x=(d.clientX-i.left)*(this.target.width/i.width),e.global.y=(d.clientY-i.top)*(this.target.height/i.height),f=0,g=this.interactiveItems.length;g>f;f++)h=this.interactiveItems[b],h.touchmove&&h.touchmove(e)},proto.onTouchStart=function(a){for(var b=this.interactionDOMElement.getBoundingClientRect(),c=a.changedTouches,d=0,e=c.length;e>d;d++){var f=c[d],g=this.pool.pop();g||(g=new InteractionData),g.originalEvent=a,this.touchs[f.identifier]=g,g.global.x=(f.clientX-b.left)*(this.target.width/b.width),g.global.y=(f.clientY-b.top)*(this.target.height/b.height);for(var h=0,i=this.interactiveItems.length;i>h;h++){var j=this.interactiveItems[h];if((j.touchstart||j.tap)&&(j.__hit=this.hitTest(j,g),j.__hit&&(j.touchstart&&j.touchstart(g),j.__isDown=!0,j.__touchData=g,!j.interactiveChildren)))break}}},proto.onTouchEnd=function(a){for(var b=this.interactionDOMElement.getBoundingClientRect(),c=a.changedTouches,d=0,e=c.length;e>d;d++){var f=c[d],g=this.touchs[f.identifier],h=!1;g.global.x=(f.clientX-b.left)*(this.target.width/b.width),g.global.y=(f.clientY-b.top)*(this.target.height/b.height);for(var i=0,j=this.interactiveItems.length;j>i;i++){var k=this.interactiveItems[i],l=k.__touchData;k.__hit=this.hitTest(k,g),l===g&&(g.originalEvent=a,(k.touchend||k.tap)&&(k.__hit&&!h?(k.touchend&&k.touchend(g),k.__isDown&&k.tap&&k.tap(g),k.interactiveChildren||(h=!0)):k.__isDown&&k.touchendoutside&&k.touchendoutside(g),k.__isDown=!1),k.__touchData=null)}this.pool.push(g),this.touchs[f.identifier]=null}},module.exports=InteractionManager;
},{"./core/globals":26,"./display/Sprite":30,"./geom/Point":58,"./platform":69}],26:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";module.exports={gl:null,primitiveShader:null,stripShader:null,defaultShader:null,offset:null,projection:null,texturesToUpdate:[],texturesToDestroy:[],visibleCount:0};
},{}],27:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
function DisplayObject(){this.last=this,this.first=this,this.position=new Point,this.scale=new Point(1,1),this.pivot=new Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.hitArea=null,this.buttonMode=!1,this.renderable=!1,this.parent=null,this.stage=null,this.worldAlpha=1,this._interactive=!1,this.defaultCursor="pointer",this.worldTransform=mat3.create(),this.localTransform=mat3.create(),this.color=[],this.dynamic=!0,this._sr=0,this._cr=1,this.filterArea=new Rectangle(0,0,1,1)}var globals=require("../core/globals"),mat3=require("../geom/matrix").mat3,FilterBlock=require("../filters/FilterBlock"),Point=require("../geom/Point"),Rectangle=require("../geom/Rectangle"),proto=DisplayObject.prototype;proto.setInteractive=function(a){this.interactive=a},Object.defineProperty(proto,"interactive",{get:function(){return this._interactive},set:function(a){this._interactive=a,this.stage&&(this.stage.dirty=!0)}}),Object.defineProperty(proto,"mask",{get:function(){return this._mask},set:function(a){a?this._mask?(a.start=this._mask.start,a.end=this._mask.end):(this.addFilter(a),a.renderable=!1):(this.removeFilter(this._mask),this._mask.renderable=!0),this._mask=a}}),Object.defineProperty(proto,"filters",{get:function(){return this._filters},set:function(a){if(a){this._filters&&this.removeFilter(this._filters),this.addFilter(a);for(var b=[],c=0;c<a.length;c++)for(var d=a[c].passes,e=0;e<d.length;e++)b.push(d[e]);a.start.filterPasses=b}else this._filters&&this.removeFilter(this._filters);this._filters=a}}),proto.addFilter=function(a){var b=new FilterBlock,c=new FilterBlock;a.start=b,a.end=c,b.data=a,c.data=a,b.first=b.last=this,c.first=c.last=this,b.open=!0,b.target=this;var d,e,f=b,g=b;e=this.first._iPrev,e?(d=e._iNext,f._iPrev=e,e._iNext=f):d=this,d&&(d._iPrev=g,g._iNext=d),f=c,g=c,d=null,e=null,e=this.last,d=e._iNext,d&&(d._iPrev=g,g._iNext=d),f._iPrev=e,e._iNext=f;for(var h=this,i=this.last;h;)h.last===i&&(h.last=c),h=h.parent;this.first=b,this.__renderGroup&&this.__renderGroup.addFilterBlocks(b,c)},proto.removeFilter=function(a){var b=a.start,c=b._iNext,d=b._iPrev;c&&(c._iPrev=d),d&&(d._iNext=c),this.first=b._iNext;var e=a.end;c=e._iNext,d=e._iPrev,c&&(c._iPrev=d),d._iNext=c;for(var f=e._iPrev,g=this;g.last===e&&(g.last=f,g=g.parent););this.__renderGroup&&this.__renderGroup.removeFilterBlocks(b,e)},proto.updateTransform=function(){this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation));var a=this.localTransform,b=this.parent.worldTransform,c=this.worldTransform;a[0]=this._cr*this.scale.x,a[1]=-this._sr*this.scale.y,a[3]=this._sr*this.scale.x,a[4]=this._cr*this.scale.y;var d=this.pivot.x,e=this.pivot.y,f=a[0],g=a[1],h=this.position.x-a[0]*d-e*a[1],i=a[3],j=a[4],k=this.position.y-a[4]*e-d*a[3],l=b[0],m=b[1],n=b[2],o=b[3],p=b[4],q=b[5];a[2]=h,a[5]=k,c[0]=l*f+m*i,c[1]=l*g+m*j,c[2]=l*h+m*k+n,c[3]=o*f+p*i,c[4]=o*g+p*j,c[5]=o*h+p*k+q,this.worldAlpha=this.alpha*this.parent.worldAlpha,this.vcount=globals.visibleCount},module.exports=DisplayObject;
},{"../core/globals":26,"../filters/FilterBlock":48,"../geom/Point":58,"../geom/Rectangle":60,"../geom/matrix":61}],28:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function DisplayObjectContainer(){DisplayObject.call(this),this.children=[]}var DisplayObject=require("./DisplayObject"),proto=DisplayObjectContainer.prototype=Object.create(DisplayObject.prototype,{constructor:{value:DisplayObjectContainer}});proto.addChild=function(a){if(a.parent&&a.parent!==this&&a.parent.removeChild(a),a.parent=this,this.children.push(a),this.stage){var b=a;do b.interactive&&(this.stage.dirty=!0),b.stage=this.stage,b=b._iNext;while(b)}var c,d,e=a.first,f=a.last;d=this._filters||this._mask?this.last._iPrev:this.last,c=d._iNext;for(var g=this,h=d;g;)g.last===h&&(g.last=a.last),g=g.parent;c&&(c._iPrev=f,f._iNext=c),e._iPrev=d,d._iNext=e,this.__renderGroup&&(a.__renderGroup&&a.__renderGroup.removeDisplayObjectAndChildren(a),this.__renderGroup.addDisplayObjectAndChildren(a))},proto.addChildAt=function(a,b){if(!(b>=0&&b<=this.children.length))throw new Error(a+" The index "+b+" supplied is out of bounds "+this.children.length);if(void 0!==a.parent&&a.parent.removeChild(a),a.parent=this,this.stage){var c=a;do c.interactive&&(this.stage.dirty=!0),c.stage=this.stage,c=c._iNext;while(c)}var d,e,f=a.first,g=a.last;if(b===this.children.length){e=this.last;for(var h=this,i=this.last;h;)h.last===i&&(h.last=a.last),h=h.parent}else e=0===b?this:this.children[b-1].last;d=e._iNext,d&&(d._iPrev=g,g._iNext=d),f._iPrev=e,e._iNext=f,this.children.splice(b,0,a),this.__renderGroup&&(a.__renderGroup&&a.__renderGroup.removeDisplayObjectAndChildren(a),this.__renderGroup.addDisplayObjectAndChildren(a))},proto.swapChildren=function(a,b){if(a!==b){var c=this.children.indexOf(a),d=this.children.indexOf(b);if(0>c||0>d)throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");this.removeChild(a),this.removeChild(b),d>c?(this.addChildAt(b,c),this.addChildAt(a,d)):(this.addChildAt(a,d),this.addChildAt(b,c))}},proto.getChildAt=function(a){if(a>=0&&a<this.children.length)return this.children[a];throw new Error("Both the supplied DisplayObjects must be a child of the caller "+this)},proto.removeChild=function(a){var b=this.children.indexOf(a);if(-1===b)throw new Error(a+" The supplied DisplayObject must be a child of the caller "+this);var c=a.first,d=a.last,e=d._iNext,f=c._iPrev;if(e&&(e._iPrev=f),f._iNext=e,this.last===d)for(var g=c._iPrev,h=this;h.last===d&&(h.last=g,h=h.parent););if(d._iNext=null,c._iPrev=null,this.stage){var i=a;do i.interactive&&(this.stage.dirty=!0),i.stage=null,i=i._iNext;while(i)}a.__renderGroup&&a.__renderGroup.removeDisplayObjectAndChildren(a),a.parent=void 0,this.children.splice(b,1)},proto.updateTransform=function(){if(this.visible){DisplayObject.prototype.updateTransform.call(this);for(var a=0,b=this.children.length;b>a;a++)this.children[a].updateTransform()}},module.exports=DisplayObjectContainer;
},{"./DisplayObject":27}],29:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function MovieClip(a){Sprite.call(this,a[0]),this.textures=a,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this.currentFrame=0,this.playing=!1}var Sprite=require("./Sprite"),proto=MovieClip.prototype=Object.create(Sprite.prototype,{constructor:{value:MovieClip}});Object.defineProperty(proto,"totalFrames",{get:function(){return this.textures.length}}),proto.stop=function(){this.playing=!1},proto.play=function(){this.playing=!0},proto.gotoAndStop=function(a){this.playing=!1,this.currentFrame=a;var b=this.currentFrame+.5|0;this.setTexture(this.textures[b%this.textures.length])},proto.gotoAndPlay=function(a){this.currentFrame=a,this.playing=!0},proto.updateTransform=function(){if(Sprite.prototype.updateTransform.call(this),this.playing){this.currentFrame+=this.animationSpeed;var a=this.currentFrame+.5|0;this.loop||a<this.textures.length?this.setTexture(this.textures[a%this.textures.length]):a>=this.textures.length&&(this.gotoAndStop(this.textures.length-1),this.onComplete&&this.onComplete())}},module.exports=MovieClip;
},{"./Sprite":30}],30:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Sprite(a){if(DisplayObjectContainer.call(this),this.anchor=new Point,this.texture=a,this.blendMode=blendModes.NORMAL,this._width=0,this._height=0,a.baseTexture.hasLoaded)this.updateFrame=!0;else{var b=this;this.texture.addEventListener("update",function(){b.onTextureUpdate()})}this.renderable=!0}var blendModes=require("./blendModes"),DisplayObjectContainer=require("./DisplayObjectContainer"),Point=require("../geom/Point"),Texture=require("../textures/Texture"),proto=Sprite.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:Sprite}});Object.defineProperty(proto,"width",{get:function(){return this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(proto,"height",{get:function(){return this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),proto.setTexture=function(a){this.texture.baseTexture!==a.baseTexture?(this.textureChange=!0,this.texture=a,this.__renderGroup&&this.__renderGroup.updateTexture(this)):this.texture=a,this.updateFrame=!0},proto.onTextureUpdate=function(){this._width&&(this.scale.x=this._width/this.texture.frame.width),this._height&&(this.scale.y=this._height/this.texture.frame.height),this.updateFrame=!0},Sprite.fromFrame=function(a){var b=Texture.cache[a];if(!b)throw new Error('The frameId "'+a+'" does not exist in the texture cache'+this);return new Sprite(b)},Sprite.fromImage=function(a){var b=Texture.fromImage(a);return new Sprite(b)},module.exports=Sprite;
},{"../geom/Point":58,"../textures/Texture":87,"./DisplayObjectContainer":28,"./blendModes":32}],31:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Stage(a){DisplayObjectContainer.call(this),this.worldTransform=mat3.create(),this.interactive=!0,this.interactionManager=new InteractionManager(this),this.dirty=!0,this.__childrenAdded=[],this.__childrenRemoved=[],this.stage=this,this.stage.hitArea=new Rectangle(0,0,1e5,1e5),this.setBackgroundColor(a),this.worldVisible=!0}var globals=require("../core/globals"),mat3=require("../geom/matrix").mat3,hex2rgb=require("../utils/color").hex2rgb,DisplayObjectContainer=require("./DisplayObjectContainer"),InteractionManager=require("../InteractionManager"),Rectangle=require("../geom/Rectangle"),proto=Stage.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:Stage}});proto.setInteractionDelegate=function(a){this.interactionManager.setTargetDomElement(a)},proto.updateTransform=function(){this.worldAlpha=1,this.vcount=globals.visibleCount;for(var a=0,b=this.children.length;b>a;a++)this.children[a].updateTransform();this.dirty&&(this.dirty=!1,this.interactionManager.dirty=!0),this.interactive&&this.interactionManager.update()},proto.setBackgroundColor=function(a){this.backgroundColor=a||0,this.backgroundColorSplit=hex2rgb(this.backgroundColor);var b=this.backgroundColor.toString(16);b="000000".substr(0,6-b.length)+b,this.backgroundColorString="#"+b},proto.getMousePosition=function(){return this.interactionManager.mouse.global},module.exports=Stage;
},{"../InteractionManager":25,"../core/globals":26,"../geom/Rectangle":60,"../geom/matrix":61,"../utils/color":90,"./DisplayObjectContainer":28}],32:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";module.exports={NORMAL:0,SCREEN:1};
},{}],33:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function EventTarget(){var a={};this.addEventListener=this.on=function(b,c){void 0===a[b]&&(a[b]=[]),-1===a[b].indexOf(c)&&a[b].push(c)},this.dispatchEvent=this.emit=function(b){if(a[b.type]&&a[b.type].length)for(var c=0,d=a[b.type].length;d>c;c++)a[b.type][c](b)},this.removeEventListener=this.off=function(b,c){var d=a[b].indexOf(c);-1!==d&&a[b].splice(d,1)},this.removeAllEventListeners=function(b){var c=a[b];c&&(c.length=0)}}module.exports=EventTarget;
},{}],34:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function CustomRenderable(){DisplayObject.call(this),this.renderable=!0}var DisplayObject=require("../display/DisplayObject"),proto=CustomRenderable.prototype=Object.create(DisplayObject.prototype,{constructor:{value:CustomRenderable}});proto.renderCanvas=function(){},proto.initWebGL=function(){},proto.renderWebGL=function(){},module.exports=CustomRenderable;
},{"../display/DisplayObject":27}],35:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Rope(a,b){Strip.call(this,a),this.points=b;try{this.verticies=new Float32Array(4*b.length),this.uvs=new Float32Array(4*b.length),this.colors=new Float32Array(2*b.length),this.indices=new Uint16Array(2*b.length)}catch(c){this.verticies=new Array(4*b.length),this.uvs=new Array(4*b.length),this.colors=new Array(2*b.length),this.indices=new Array(2*b.length)}this.refresh()}var Strip=require("./Strip"),DisplayObjectContainer=require("../display/DisplayObjectContainer"),proto=Rope.prototype=Object.create(Strip.prototype,{constructor:{value:Rope}});proto.refresh=function(){var a=this.points;if(!(a.length<1)){var b=this.uvs,c=a[0],d=this.indices,e=this.colors;this.count-=.2,b[0]=0,b[1]=1,b[2]=0,b[3]=1,e[0]=1,e[1]=1,d[0]=0,d[1]=1;for(var f,g,h,i=a.length,j=1;i>j;j++)f=a[j],g=4*j,h=j/(i-1),j%2?(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1):(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1),g=2*j,e[g]=1,e[g+1]=1,g=2*j,d[g]=g,d[g+1]=g+1,c=f}},proto.updateTransform=function(){var a=this.points;if(!(a.length<1)){var b,c=a[0],d={x:0,y:0};this.count-=.2;var e=this.verticies;e[0]=c.x+d.x,e[1]=c.y+d.y,e[2]=c.x-d.x,e[3]=c.y-d.y;for(var f,g,h,i,j,k=a.length,l=1;k>l;l++)f=a[l],g=4*l,b=l<a.length-1?a[l+1]:f,d.y=-(b.x-c.x),d.x=b.y-c.y,h=10*(1-l/(k-1)),h>1&&(h=1),i=Math.sqrt(d.x*d.x+d.y*d.y),j=this.texture.height/2,d.x/=i,d.y/=i,d.x*=j,d.y*=j,e[g]=f.x+d.x,e[g+1]=f.y+d.y,e[g+2]=f.x-d.x,e[g+3]=f.y-d.y,c=f;DisplayObjectContainer.prototype.updateTransform.call(this)}},proto.setTexture=function(a){this.texture=a,this.updateFrame=!0},module.exports=Rope;
},{"../display/DisplayObjectContainer":28,"./Strip":37}],36:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Spine(a){if(DisplayObjectContainer.call(this),this.spineData=Spine.animCache[a],!this.spineData)throw new Error("Spine data must be preloaded using SpineLoader or AssetLoader: "+a);this.skeleton=new spine.Skeleton(this.spineData),this.skeleton.updateWorldTransform(),this.stateData=new spine.AnimationStateData(this.spineData),this.state=new spine.AnimationState(this.stateData),this.slotContainers=[];for(var b=0,c=this.skeleton.drawOrder.length;c>b;b++){var d=this.skeleton.drawOrder[b],e=d.attachment,f=new DisplayObjectContainer;if(this.slotContainers.push(f),this.addChild(f),e instanceof spine.RegionAttachment){var g=e.rendererObject.name,h=this.createSprite(d,e.rendererObject);d.currentSprite=h,d.currentSpriteName=g,f.addChild(h)}}}var spine=require("../utils/spine"),DisplayObjectContainer=require("../display/DisplayObjectContainer"),Sprite=require("../display/Sprite"),Texture=require("../textures/Texture"),proto=Spine.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:Spine}});proto.updateTransform=function(){this.lastTime=this.lastTime||Date.now();var a=.001*(Date.now()-this.lastTime);this.lastTime=Date.now(),this.state.update(a),this.state.apply(this.skeleton),this.skeleton.updateWorldTransform();for(var b=this.skeleton.drawOrder,c=0,d=b.length;d>c;c++){var e=b[c],f=e.attachment,g=this.slotContainers[c];if(f instanceof spine.RegionAttachment){if(f.rendererObject&&(!e.currentSpriteName||e.currentSpriteName!==f.name)){var h=f.rendererObject.name;if(void 0!==e.currentSprite&&(e.currentSprite.visible=!1),e.sprites=e.sprites||{},void 0!==e.sprites[h])e.sprites[h].visible=!0;else{var i=this.createSprite(e,f.rendererObject);g.addChild(i)}e.currentSprite=e.sprites[h],e.currentSpriteName=h}g.visible=!0;var j=e.bone;g.position.x=j.worldX+f.x*j.m00+f.y*j.m01,g.position.y=j.worldY+f.x*j.m10+f.y*j.m11,g.scale.x=j.worldScaleX,g.scale.y=j.worldScaleY,g.rotation=-(e.bone.worldRotation*Math.PI/180)}else g.visible=!1}DisplayObjectContainer.prototype.updateTransform.call(this)},proto.createSprite=function(a,b){var c=Texture.cache[b.name]?b.name:b.name+".png",d=new Sprite(Texture.fromFrame(c));return d.scale=b.scale,d.rotation=b.rotation,d.anchor.x=d.anchor.y=.5,a.sprites=a.sprites||{},a.sprites[b.name]=d,d},Spine.animCache={},module.exports=Spine;
},{"../display/DisplayObjectContainer":28,"../display/Sprite":30,"../textures/Texture":87,"../utils/spine":92}],37:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Strip(a,b,c){DisplayObjectContainer.call(this),this.texture=a,this.blendMode=blendModes.NORMAL;try{this.uvs=new Float32Array([0,1,1,1,1,0,0,1]),this.verticies=new Float32Array([0,0,0,0,0,0,0,0,0]),this.colors=new Float32Array([1,1,1,1]),this.indices=new Uint16Array([0,1,2,3])}catch(d){this.uvs=[0,1,1,1,1,0,0,1],this.verticies=[0,0,0,0,0,0,0,0,0],this.colors=[1,1,1,1],this.indices=[0,1,2,3]}if(this.width=b,this.height=c,a.baseTexture.hasLoaded)this.width=this.texture.frame.width,this.height=this.texture.frame.height,this.updateFrame=!0;else{var e=this;this.texture.addEventListener("update",function(){e.onTextureUpdate()})}this.renderable=!0}var blendModes=require("../display/blendModes"),DisplayObjectContainer=require("../display/DisplayObjectContainer"),proto=Strip.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:Strip}});proto.setTexture=function(a){this.texture=a,this.width=a.frame.width,this.height=a.frame.height,this.updateFrame=!0},proto.onTextureUpdate=function(){this.updateFrame=!0},module.exports=Strip;
},{"../display/DisplayObjectContainer":28,"../display/blendModes":32}],38:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function TilingSprite(a,b,c){DisplayObjectContainer.call(this),this.texture=a,this.width=b,this.height=c,this.tileScale=new Point(1,1),this.tilePosition=new Point(0,0),this.renderable=!0,this.blendMode=blendModes.NORMAL}var blendModes=require("../display/blendModes"),DisplayObjectContainer=require("../display/DisplayObjectContainer"),Point=require("../geom/Point"),proto=TilingSprite.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:TilingSprite}});proto.setTexture=function(a){this.texture=a,this.updateFrame=!0},proto.onTextureUpdate=function(){this.updateFrame=!0},module.exports=TilingSprite;
},{"../display/DisplayObjectContainer":28,"../display/blendModes":32,"../geom/Point":58}],39:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function AbstractFilter(a,b){this.passes=[this],this.dirty=!0,this.padding=0,this.uniforms=b||{},this.fragmentSrc=a||[]}module.exports=AbstractFilter;
},{}],40:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BlurFilter(){this.blurXFilter=new BlurXFilter,this.blurYFilter=new BlurYFilter,this.passes=[this.blurXFilter,this.blurYFilter]}var BlurXFilter=require("./BlurXFilter"),BlurYFilter=require("./BlurYFilter"),proto=BlurFilter.prototype;Object.defineProperty(proto,"blur",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=this.blurYFilter.blur=a}}),Object.defineProperty(proto,"blurX",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=a}}),Object.defineProperty(proto,"blurY",{get:function(){return this.blurYFilter.blur},set:function(a){this.blurYFilter.blur=a}}),module.exports=BlurFilter;
},{"./BlurXFilter":41,"./BlurYFilter":42}],41:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BlurXFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;","   gl_FragColor = sum;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=BlurXFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:BlurXFilter}});Object.defineProperty(proto,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.dirty=!0,this.uniforms.blur.value=1/7e3*a}}),module.exports=BlurXFilter;
},{"./AbstractFilter":39}],42:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BlurYFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;","   gl_FragColor = sum;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=BlurYFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:BlurYFilter}});Object.defineProperty(proto,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),module.exports=BlurYFilter;
},{"./AbstractFilter":39}],43:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function ColorMatrixFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={matrix:{type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float invert;","uniform mat4 matrix;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;","   gl_FragColor = gl_FragColor * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=ColorMatrixFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:ColorMatrixFilter}});Object.defineProperty(proto,"matrix",{get:function(){return this.uniforms.matrix.value},set:function(a){this.uniforms.matrix.value=a}}),module.exports=ColorMatrixFilter;
},{"./AbstractFilter":39}],44:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function ColorStepFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={step:{type:"1f",value:5}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","uniform float step;","void main(void) {","   vec4 color = texture2D(uSampler, vTextureCoord);","   color = floor(color * step) / step;","   gl_FragColor = color * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=ColorStepFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:ColorStepFilter}});Object.defineProperty(proto,"step",{get:function(){return this.uniforms.step.value},set:function(a){this.uniforms.step.value=a}}),module.exports=ColorStepFilter;
},{"./AbstractFilter":39}],45:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function CrossHatchFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);","    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);","    if (lum < 1.00) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.75) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.50) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.3) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","}"]}var AbstractFilter=require("./AbstractFilter"),proto=CrossHatchFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:CrossHatchFilter}});Object.defineProperty(proto,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),module.exports=CrossHatchFilter;
},{"./AbstractFilter":39}],46:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function DisplacementFilter(a){AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={displacementMap:{type:"sampler2D",value:a},scale:{type:"2f",value:{x:30,y:30}},offset:{type:"2f",value:{x:0,y:0}},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mapDimensions.value.x=a.width,this.uniforms.mapDimensions.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D displacementMap;","uniform sampler2D uSampler;","uniform vec2 scale;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   vec2 matSample = texture2D(displacementMap, mapCords).xy;","   matSample -= 0.5;","   matSample *= scale;","   matSample /= mapDimensions;","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);","   vec2 cord = vTextureCoord;","   gl_FragColor = gl_FragColor * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=DisplacementFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:DisplacementFilter}});proto.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.displacementMap.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.displacementMap.value.height,this.uniforms.displacementMap.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(proto,"map",{get:function(){return this.uniforms.displacementMap.value},set:function(a){this.uniforms.displacementMap.value=a}}),Object.defineProperty(proto,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.uniforms.scale.value=a}}),Object.defineProperty(proto,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.uniforms.offset.value=a}}),module.exports=DisplacementFilter;
},{"./AbstractFilter":39}],47:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function DotScreenFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={scale:{type:"1f",value:1},angle:{type:"1f",value:5},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float angle;","uniform float scale;","float pattern() {","   float s = sin(angle), c = cos(angle);","   vec2 tex = vTextureCoord * dimensions.xy;","   vec2 point = vec2(","       c * tex.x - s * tex.y,","       s * tex.x + c * tex.y","   ) * scale;","   return (sin(point.x) * sin(point.y)) * 4.0;","}","void main() {","   vec4 color = texture2D(uSampler, vTextureCoord);","   float average = (color.r + color.g + color.b) / 3.0;","   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);","}"]}var AbstractFilter=require("./AbstractFilter"),proto=DotScreenFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:DotScreenFilter}});Object.defineProperty(proto,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.dirty=!0,this.uniforms.scale.value=a}}),Object.defineProperty(proto,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),module.exports=DotScreenFilter;
},{"./AbstractFilter":39}],48:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function FilterBlock(){this.visible=!0,this.renderable=!0}module.exports=FilterBlock;
},{}],49:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function GrayFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={gray:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","uniform float gray;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);","   gl_FragColor = gl_FragColor * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=GrayFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:GrayFilter}});Object.defineProperty(proto,"gray",{get:function(){return this.uniforms.gray.value},set:function(a){this.uniforms.gray.value=a}}),module.exports=GrayFilter;
},{"./AbstractFilter":39}],50:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function InvertFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float invert;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);","   gl_FragColor = gl_FragColor * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=InvertFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:InvertFilter}});Object.defineProperty(proto,"invert",{get:function(){return this.uniforms.invert.value},set:function(a){this.uniforms.invert.value=a}}),module.exports=InvertFilter;
},{"./AbstractFilter":39}],51:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function PixelateFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:0},dimensions:{type:"4fv",value:new Float32Array([1e4,100,10,10])},pixelSize:{type:"2f",value:{x:10,y:10}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform vec2 testDim;","uniform vec4 dimensions;","uniform vec2 pixelSize;","uniform sampler2D uSampler;","void main(void) {","   vec2 coord = vTextureCoord;","   vec2 size = dimensions.xy/pixelSize;","   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;","   gl_FragColor = texture2D(uSampler, color);","}"]}var AbstractFilter=require("./AbstractFilter"),proto=PixelateFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:PixelateFilter}});Object.defineProperty(proto,"size",{get:function(){return this.uniforms.pixelSize.value},set:function(a){this.dirty=!0,this.uniforms.pixelSize.value=a}}),module.exports=PixelateFilter;
},{"./AbstractFilter":39}],52:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function RGBSplitFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={red:{type:"2f",value:{x:20,y:20}},green:{type:"2f",value:{x:-20,y:20}},blue:{type:"2f",value:{x:20,y:-20}},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform vec2 red;","uniform vec2 green;","uniform vec2 blue;","uniform vec4 dimensions;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;","   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;","   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;","   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=RGBSplitFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:RGBSplitFilter}});Object.defineProperty(proto,"angle",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),module.exports=RGBSplitFilter;
},{"./AbstractFilter":39}],53:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function SepiaFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={sepia:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float sepia;","uniform sampler2D uSampler;","const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);","   gl_FragColor = gl_FragColor * vColor;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=SepiaFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:SepiaFilter}});Object.defineProperty(proto,"sepia",{get:function(){return this.uniforms.sepia.value},set:function(a){this.uniforms.sepia.value=a}}),module.exports=SepiaFilter;
},{"./AbstractFilter":39}],54:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function SmartBlurFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","uniform sampler2D uSampler;","const vec2 delta = vec2(1.0/10.0, 0.0);","float random(vec3 scale, float seed) {","   return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);","}","void main(void) {","   vec4 color = vec4(0.0);","   float total = 0.0;","   float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);","   for (float t = -30.0; t <= 30.0; t++) {","       float percent = (t + offset - 0.5) / 30.0;","       float weight = 1.0 - abs(percent);","       vec4 sample = texture2D(uSampler, vTextureCoord + delta * percent);","       sample.rgb *= sample.a;","       color += sample * weight;","       total += weight;","   }","   gl_FragColor = color / total;","   gl_FragColor.rgb /= gl_FragColor.a + 0.00001;","}"]}var AbstractFilter=require("./AbstractFilter"),proto=SmartBlurFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:SmartBlurFilter}});Object.defineProperty(proto,"blur",{get:function(){return this.uniforms.blur.value},set:function(a){this.uniforms.blur.value=a}}),module.exports=SmartBlurFilter;
},{"./AbstractFilter":39}],55:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function TwistFilter(){AbstractFilter.call(this),this.passes=[this],this.uniforms={radius:{type:"1f",value:.5},angle:{type:"1f",value:5},offset:{type:"2f",value:{x:.5,y:.5}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float radius;","uniform float angle;","uniform vec2 offset;","void main(void) {","   vec2 coord = vTextureCoord - offset;","   float distance = length(coord);","   if (distance < radius) {","       float ratio = (radius - distance) / radius;","       float angleMod = ratio * ratio * angle;","       float s = sin(angleMod);","       float c = cos(angleMod);","       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);","   }","   gl_FragColor = texture2D(uSampler, coord+offset);","}"]}var AbstractFilter=require("./AbstractFilter"),proto=TwistFilter.prototype=Object.create(AbstractFilter.prototype,{constructor:{value:TwistFilter}});Object.defineProperty(proto,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.dirty=!0,this.uniforms.offset.value=a}}),Object.defineProperty(proto,"radius",{get:function(){return this.uniforms.radius.value},set:function(a){this.dirty=!0,this.uniforms.radius.value=a}}),Object.defineProperty(proto,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),module.exports=TwistFilter;
},{"./AbstractFilter":39}],56:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Circle(a,b,c){this.x=a||0,this.y=b||0,this.radius=c||0}var proto=Circle.prototype;proto.clone=function(){return new Circle(this.x,this.y,this.radius)},proto.contains=function(a,b){if(this.radius<=0)return!1;var c=this.x-a,d=this.y-b,e=this.radius*this.radius;return c*=c,d*=d,e>=c+d},module.exports=Circle;
},{}],57:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Ellipse(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0}var Rectangle=require("./Rectangle"),proto=Ellipse.prototype;proto.clone=function(){return new Ellipse(this.x,this.y,this.width,this.height)},proto.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=(a-this.x)/this.width-.5,d=(b-this.y)/this.height-.5;return c*=c,d*=d,.25>c+d},proto.getBounds=function(){return new Rectangle(this.x,this.y,this.width,this.height)},module.exports=Ellipse;
},{"./Rectangle":60}],58:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Point(a,b){this.x=a||0,this.y=b||0}Point.prototype.clone=function(){return new Point(this.x,this.y)},module.exports=Point;
},{}],59:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Polygon(a){if(a instanceof Array||(a=Array.prototype.slice.call(arguments)),"number"==typeof a[0]){for(var b=[],c=0,d=a.length;d>c;c+=2)b.push(new Point(a[c],a[c+1]));a=b}this.points=a}var Point=require("./Point"),proto=Polygon.prototype;proto.clone=function(){for(var a=[],b=0;b<this.points.length;b++)a.push(this.points[b].clone());return new Polygon(a)},proto.contains=function(a,b){for(var c=!1,d=0,e=this.points.length-1;d<this.points.length;e=d++){var f=this.points[d].x,g=this.points[d].y,h=this.points[e].x,i=this.points[e].y,j=g>b!=i>b&&(h-f)*(b-g)/(i-g)+f>a;j&&(c=!c)}return c},module.exports=Polygon;
},{"./Point":58}],60:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Rectangle(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0}var proto=Rectangle.prototype;proto.clone=function(){return new Rectangle(this.x,this.y,this.width,this.height)},proto.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=this.x;if(a>=c&&a<=c+this.width){var d=this.y;if(b>=d&&b<=d+this.height)return!0}return!1},module.exports=Rectangle;
},{}],61:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var Matrix=exports.Matrix="undefined"!=typeof Float32Array?Float32Array:Array,mat3=exports.mat3={},mat4=exports.mat4={};mat3.create=function(){var a=new Matrix(9);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},mat3.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},mat4.create=function(){var a=new Matrix(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat3.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],f=a[2],g=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],m=b[0],n=b[1],o=b[2],p=b[3],q=b[4],r=b[5],s=b[6],t=b[7],u=b[8];return c[0]=m*d+n*g+o*j,c[1]=m*e+n*h+o*k,c[2]=m*f+n*i+o*l,c[3]=p*d+q*g+r*j,c[4]=p*e+q*h+r*k,c[5]=p*f+q*i+r*l,c[6]=s*d+t*g+u*j,c[7]=s*e+t*h+u*k,c[8]=s*f+t*i+u*l,c},mat3.clone=function(a){var b=new Matrix(9);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b},mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];return a[1]=a[3],a[2]=a[6],a[3]=c,a[5]=a[7],a[6]=d,a[7]=e,a}return b[0]=a[0],b[1]=a[3],b[2]=a[6],b[3]=a[1],b[4]=a[4],b[5]=a[7],b[6]=a[2],b[7]=a[5],b[8]=a[8],b},mat3.toMat4=function(a,b){return b||(b=mat4.create()),b[15]=1,b[14]=0,b[13]=0,b[12]=0,b[11]=0,b[10]=a[8],b[9]=a[7],b[8]=a[6],b[7]=0,b[6]=a[5],b[5]=a[4],b[4]=a[3],b[3]=0,b[2]=a[2],b[1]=a[1],b[0]=a[0],b},mat4.create=function(){var a=new Matrix(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],f=a[6],g=a[7],h=a[11];return a[1]=a[4],a[2]=a[8],a[3]=a[12],a[4]=c,a[6]=a[9],a[7]=a[13],a[8]=d,a[9]=f,a[11]=a[14],a[12]=e,a[13]=g,a[14]=h,a}return b[0]=a[0],b[1]=a[4],b[2]=a[8],b[3]=a[12],b[4]=a[1],b[5]=a[5],b[6]=a[9],b[7]=a[13],b[8]=a[2],b[9]=a[6],b[10]=a[10],b[11]=a[14],b[12]=a[3],b[13]=a[7],b[14]=a[11],b[15]=a[15],b},mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],f=a[2],g=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],m=a[9],n=a[10],o=a[11],p=a[12],q=a[13],r=a[14],s=a[15],t=b[0],u=b[1],v=b[2],w=b[3];return c[0]=t*d+u*h+v*l+w*p,c[1]=t*e+u*i+v*m+w*q,c[2]=t*f+u*j+v*n+w*r,c[3]=t*g+u*k+v*o+w*s,t=b[4],u=b[5],v=b[6],w=b[7],c[4]=t*d+u*h+v*l+w*p,c[5]=t*e+u*i+v*m+w*q,c[6]=t*f+u*j+v*n+w*r,c[7]=t*g+u*k+v*o+w*s,t=b[8],u=b[9],v=b[10],w=b[11],c[8]=t*d+u*h+v*l+w*p,c[9]=t*e+u*i+v*m+w*q,c[10]=t*f+u*j+v*n+w*r,c[11]=t*g+u*k+v*o+w*s,t=b[12],u=b[13],v=b[14],w=b[15],c[12]=t*d+u*h+v*l+w*p,c[13]=t*e+u*i+v*m+w*q,c[14]=t*f+u*j+v*n+w*r,c[15]=t*g+u*k+v*o+w*s,c};
},{}],62:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var globals=require("./core/globals"),shaders=require("./renderers/webgl/shaders"),matrix=require("./geom/matrix"),pixi=module.exports=Object.create(globals);pixi.Point=require("./geom/Point"),pixi.Rectangle=require("./geom/Rectangle"),pixi.Polygon=require("./geom/Polygon"),pixi.Circle=require("./geom/Circle"),pixi.Ellipse=require("./geom/Ellipse"),pixi.Matrix=matrix.Matrix,pixi.mat3=matrix.mat3,pixi.mat4=matrix.mat4,pixi.blendModes=require("./display/blendModes"),pixi.DisplayObject=require("./display/DisplayObject"),pixi.DisplayObjectContainer=require("./display/DisplayObjectContainer"),pixi.Sprite=require("./display/Sprite"),pixi.MovieClip=require("./display/MovieClip"),pixi.AbstractFilter=require("./filters/AbstractFilter"),pixi.BlurFilter=require("./filters/BlurFilter"),pixi.BlurXFilter=require("./filters/BlurXFilter"),pixi.BlurYFilter=require("./filters/BlurYFilter"),pixi.ColorMatrixFilter=require("./filters/ColorMatrixFilter"),pixi.ColorStepFilter=require("./filters/ColorStepFilter"),pixi.CrossHatchFilter=require("./filters/CrossHatchFilter"),pixi.DisplacementFilter=require("./filters/DisplacementFilter"),pixi.DotScreenFilter=require("./filters/DotScreenFilter"),pixi.FilterBlock=require("./filters/FilterBlock"),pixi.GrayFilter=require("./filters/GrayFilter"),pixi.InvertFilter=require("./filters/InvertFilter"),pixi.PixelateFilter=require("./filters/PixelateFilter"),pixi.RGBSplitFilter=require("./filters/RGBSplitFilter"),pixi.SepiaFilter=require("./filters/SepiaFilter"),pixi.SmartBlurFilter=require("./filters/SmartBlurFilter"),pixi.TwistFilter=require("./filters/TwistFilter"),pixi.Text=require("./text/Text"),pixi.BitmapText=require("./text/BitmapText"),pixi.InteractionManager=require("./InteractionManager"),pixi.Stage=require("./display/Stage"),pixi.EventTarget=require("./events/EventTarget"),pixi.autoDetectRenderer=require("./utils/autoDetectRenderer"),pixi.PolyK=require("./utils/Polyk"),pixi.WebGLGraphics=require("./renderers/webgl/graphics"),pixi.WebGLRenderer=require("./renderers/webgl/WebGLRenderer"),pixi.WebGLBatch=require("./renderers/webgl/WebGLBatch"),pixi.WebGLRenderGroup=require("./renderers/webgl/WebGLRenderGroup"),pixi.CanvasRenderer=require("./renderers/canvas/CanvasRenderer"),pixi.CanvasGraphics=require("./renderers/canvas/graphics"),pixi.Graphics=require("./primitives/Graphics"),pixi.Strip=require("./extras/Strip"),pixi.Rope=require("./extras/Rope"),pixi.TilingSprite=require("./extras/TilingSprite"),pixi.Spine=require("./extras/Spine"),pixi.CustomRenderable=require("./extras/CustomRenderable"),pixi.BaseTexture=require("./textures/BaseTexture"),pixi.Texture=require("./textures/Texture"),pixi.RenderTexture=require("./textures/RenderTexture"),pixi.AssetLoader=require("./loaders/AssetLoader"),pixi.JsonLoader=require("./loaders/JsonLoader"),pixi.SpriteSheetLoader=require("./loaders/SpriteSheetLoader"),pixi.ImageLoader=require("./loaders/ImageLoader"),pixi.BitmapFontLoader=require("./loaders/BitmapFontLoader"),pixi.SpineLoader=require("./loaders/SpineLoader"),pixi.initDefaultShaders=shaders.initDefaultShaders,pixi.activatePrimitiveShader=shaders.activatePrimitiveShader,pixi.deactivatePrimitiveShader=shaders.deactivatePrimitiveShader,pixi.activateStripShader=shaders.activateStripShader,pixi.deactivateStripShader=shaders.deactivateStripShader;var debug=require("./utils/debug");pixi.runList=debug.runList;
},{"./InteractionManager":25,"./core/globals":26,"./display/DisplayObject":27,"./display/DisplayObjectContainer":28,"./display/MovieClip":29,"./display/Sprite":30,"./display/Stage":31,"./display/blendModes":32,"./events/EventTarget":33,"./extras/CustomRenderable":34,"./extras/Rope":35,"./extras/Spine":36,"./extras/Strip":37,"./extras/TilingSprite":38,"./filters/AbstractFilter":39,"./filters/BlurFilter":40,"./filters/BlurXFilter":41,"./filters/BlurYFilter":42,"./filters/ColorMatrixFilter":43,"./filters/ColorStepFilter":44,"./filters/CrossHatchFilter":45,"./filters/DisplacementFilter":46,"./filters/DotScreenFilter":47,"./filters/FilterBlock":48,"./filters/GrayFilter":49,"./filters/InvertFilter":50,"./filters/PixelateFilter":51,"./filters/RGBSplitFilter":52,"./filters/SepiaFilter":53,"./filters/SmartBlurFilter":54,"./filters/TwistFilter":55,"./geom/Circle":56,"./geom/Ellipse":57,"./geom/Point":58,"./geom/Polygon":59,"./geom/Rectangle":60,"./geom/matrix":61,"./loaders/AssetLoader":63,"./loaders/BitmapFontLoader":64,"./loaders/ImageLoader":65,"./loaders/JsonLoader":66,"./loaders/SpineLoader":67,"./loaders/SpriteSheetLoader":68,"./primitives/Graphics":70,"./renderers/canvas/CanvasRenderer":71,"./renderers/canvas/graphics":72,"./renderers/webgl/WebGLBatch":76,"./renderers/webgl/WebGLRenderGroup":78,"./renderers/webgl/WebGLRenderer":79,"./renderers/webgl/graphics":81,"./renderers/webgl/shaders":82,"./text/BitmapText":83,"./text/Text":84,"./textures/BaseTexture":85,"./textures/RenderTexture":86,"./textures/Texture":87,"./utils/Polyk":88,"./utils/autoDetectRenderer":89,"./utils/debug":91}],63:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function getDataType(a){var b="data:",c=a.slice(0,b.length).toLowerCase();if(c===b){var d=a.slice(b.length),e=d.indexOf(",");if(-1===e)return null;var f=d.slice(0,e).split(";")[0];return f&&"text/plain"!==f.toLowerCase()?f.split("/").pop().toLowerCase():"txt"}return null}function AssetLoader(a,b){EventTarget.call(this),this.assetURLs=a,this.crossorigin=b}var EventTarget=require("../events/EventTarget"),loadersByType={},proto=AssetLoader.prototype;proto.load=function(){function a(){b.onAssetLoaded()}var b=this;this.loadCount=this.assetURLs.length;for(var c=0,d=this.assetURLs.length;d>c;c++){var e=this.assetURLs[c],f=getDataType(e);f||(f=e.split("?").shift().split(".").pop().toLowerCase());var g=loadersByType[f];if(!g)throw new Error(f+" is an unsupported file type");var h=new g(e,this.crossorigin);h.addEventListener("loaded",a),h.load()}},proto.onAssetLoaded=function(){this.loadCount--,this.dispatchEvent({type:"onProgress",content:this}),this.onProgress&&this.onProgress(),this.loadCount||(this.dispatchEvent({type:"onComplete",content:this}),this.onComplete&&this.onComplete())},AssetLoader.registerLoaderType=function(a,b){loadersByType[a]=b},module.exports=AssetLoader;
},{"../events/EventTarget":33}],64:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BitmapFontLoader(a,b){EventTarget.call(this),this.url=a,this.crossorigin=b,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null}var AssetLoader=require("./AssetLoader"),ImageLoader=require("./ImageLoader"),Rectangle=require("../geom/Rectangle"),EventTarget=require("../events/EventTarget"),BitmapText=require("../text/BitmapText"),Texture=require("../textures/Texture"),platform=require("../platform"),proto=BitmapFontLoader.prototype;proto.handleEvent=function(a){switch(a.type){case"load":this.onXMLLoaded();break;default:this.onError()}},proto.load=function(){this.request=platform.createRequest(),this.request.addEventListener("load",this),this.request.addEventListener("error",this),this.request.open("GET",this.url,!0),this.request.overrideMimeType&&this.request.overrideMimeType("application/xml"),this.request.send(null)},proto.onXMLLoaded=function(){var a=this.baseUrl+this.request.responseXML.getElementsByTagName("page")[0].attributes.getNamedItem("file").nodeValue,b=new ImageLoader(a,this.crossorigin);this.texture=b.texture.baseTexture;var c={},d=this.request.responseXML.getElementsByTagName("info")[0],e=this.request.responseXML.getElementsByTagName("common")[0];c.font=d.attributes.getNamedItem("face").nodeValue,c.size=parseInt(d.attributes.getNamedItem("size").nodeValue,10),c.lineHeight=parseInt(e.attributes.getNamedItem("lineHeight").nodeValue,10),c.chars={};for(var f=this.request.responseXML.getElementsByTagName("char"),g=0;g<f.length;g++){var h=parseInt(f[g].attributes.getNamedItem("id").nodeValue,10),i=new Rectangle(parseInt(f[g].attributes.getNamedItem("x").nodeValue,10),parseInt(f[g].attributes.getNamedItem("y").nodeValue,10),parseInt(f[g].attributes.getNamedItem("width").nodeValue,10),parseInt(f[g].attributes.getNamedItem("height").nodeValue,10));c.chars[h]={xOffset:parseInt(f[g].attributes.getNamedItem("xoffset").nodeValue,10),yOffset:parseInt(f[g].attributes.getNamedItem("yoffset").nodeValue,10),xAdvance:parseInt(f[g].attributes.getNamedItem("xadvance").nodeValue,10),kerning:{},texture:Texture.cache[h]=new Texture(this.texture,i)}}var j=this.request.responseXML.getElementsByTagName("kerning");for(g=0;g<j.length;g++){var k=parseInt(j[g].attributes.getNamedItem("first").nodeValue,10),l=parseInt(j[g].attributes.getNamedItem("second").nodeValue,10),m=parseInt(j[g].attributes.getNamedItem("amount").nodeValue,10);c.chars[l].kerning[k]=m}BitmapText.fonts[c.font]=c;var n=this;b.addEventListener("loaded",function(){n.onLoaded()}),b.load()},proto.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},proto.onError=function(){this.dispatchEvent({type:"error",content:this})},AssetLoader.registerLoaderType("xml",BitmapFontLoader),AssetLoader.registerLoaderType("fnt",BitmapFontLoader),module.exports=BitmapFontLoader;
},{"../events/EventTarget":33,"../geom/Rectangle":60,"../platform":69,"../text/BitmapText":83,"../textures/Texture":87,"./AssetLoader":63,"./ImageLoader":65}],65:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function ImageLoader(a,b){EventTarget.call(this),this.texture=Texture.fromImage(a,b),this.frames=[]}var AssetLoader=require("./AssetLoader"),EventTarget=require("../events/EventTarget"),Texture=require("../textures/Texture"),proto=ImageLoader.prototype;proto.load=function(){if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var a=this;this.texture.baseTexture.addEventListener("loaded",function(){a.onLoaded()})}},proto.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},proto.loadFramedSpriteSheet=function(a,b,c){this.frames=[];for(var d=Math.floor(this.texture.width/a),e=Math.floor(this.texture.height/b),f=0,g=0;e>g;g++)for(var h=0;d>h;h++,f++){var i=new Texture(this.texture,{x:h*a,y:g*b,width:a,height:b});this.frames.push(i),c&&(Texture.cache[c+"-"+f]=i)}if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var j=this;this.texture.baseTexture.addEventListener("loaded",function(){j.onLoaded()})}},AssetLoader.registerLoaderType("jpg",ImageLoader),AssetLoader.registerLoaderType("jpeg",ImageLoader),AssetLoader.registerLoaderType("png",ImageLoader),AssetLoader.registerLoaderType("gif",ImageLoader),module.exports=ImageLoader;
},{"../events/EventTarget":33,"../textures/Texture":87,"./AssetLoader":63}],66:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function JsonLoader(a,b){EventTarget.call(this),this.url=a,this.crossorigin=b,this.baseUrl=a.replace(/[^\/]*$/,""),this.loaded=!1}var AssetLoader=require("./AssetLoader"),ImageLoader=require("./ImageLoader"),EventTarget=require("../events/EventTarget"),Texture=require("../textures/Texture"),Spine=require("../extras/Spine"),SkeletonJson=require("../utils/spine").SkeletonJson,platform=require("../platform"),proto=JsonLoader.prototype;proto.handleEvent=function(a){switch(a.type){case"load":this.onJSONLoaded();break;default:this.onError()}},proto.load=function(){this.request=platform.createRequest(),this.request.addEventListener("load",this),this.request.addEventListener("error",this),this.request.open("GET",this.url,!0),this.request.overrideMimeType&&this.request.overrideMimeType("application/json"),this.request.send(null)},proto.onJSONLoaded=function(){if(this.json=JSON.parse(this.request.responseText),this.json.frames){var a=this,b=this.baseUrl+this.json.meta.image,c=new ImageLoader(b,this.crossorigin),d=this.json.frames;this.texture=c.texture.baseTexture,c.addEventListener("loaded",function(){a.onLoaded()});for(var e in d){var f=d[e].frame;f&&(Texture.cache[e]=new Texture(this.texture,{x:f.x,y:f.y,width:f.w,height:f.h}),d[e].trimmed&&(Texture.cache[e].realSize=d[e].spriteSourceSize,Texture.cache[e].trim.x=0))}c.load()}else if(this.json.bones){var g=new SkeletonJson,h=g.readSkeletonData(this.json);Spine.animCache[this.url]=h,this.onLoaded()}else this.onLoaded()},proto.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},proto.onError=function(){this.dispatchEvent({type:"error",content:this})},AssetLoader.registerLoaderType("json",JsonLoader),module.exports=JsonLoader;
},{"../events/EventTarget":33,"../extras/Spine":36,"../platform":69,"../textures/Texture":87,"../utils/spine":92,"./AssetLoader":63,"./ImageLoader":65}],67:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function SpineLoader(a,b){EventTarget.call(this),this.url=a,this.crossorigin=b,this.loaded=!1}var AssetLoader=require("./AssetLoader"),JsonLoader=require("./JsonLoader"),EventTarget=require("../events/EventTarget"),Spine=require("../extras/Spine"),SkeletonJson=require("../utils/spine").SkeletonJson,proto=SpineLoader.prototype;proto.load=function(){var a=this,b=new JsonLoader(this.url,this.crossorigin);b.addEventListener("loaded",function(b){a.json=b.content.json,a.onJSONLoaded()}),b.load()},proto.onJSONLoaded=function(){var a=new SkeletonJson,b=a.readSkeletonData(this.json);Spine.animCache[this.url]=b,this.onLoaded()},proto.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},AssetLoader.registerLoaderType("anim",SpineLoader),module.exports=SpineLoader;
},{"../events/EventTarget":33,"../extras/Spine":36,"../utils/spine":92,"./AssetLoader":63,"./JsonLoader":66}],68:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function SpriteSheetLoader(a,b){EventTarget.call(this),this.url=a,this.crossorigin=b,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null,this.frames={}}var JsonLoader=require("./JsonLoader"),ImageLoader=require("./ImageLoader"),EventTarget=require("../events/EventTarget"),Texture=require("../textures/Texture"),proto=SpriteSheetLoader.prototype;proto.load=function(){var a=this,b=new JsonLoader(this.url,this.crossorigin);b.addEventListener("loaded",function(b){a.json=b.content.json,a.onJSONLoaded()}),b.load()},proto.onJSONLoaded=function(){var a=this,b=this.baseUrl+this.json.meta.image,c=new ImageLoader(b,this.crossorigin),d=this.json.frames;this.texture=c.texture.baseTexture,c.addEventListener("loaded",function(){a.onLoaded()});for(var e in d){var f=d[e].frame;f&&(Texture.cache[e]=new Texture(this.texture,{x:f.x,y:f.y,width:f.w,height:f.h}),d[e].trimmed&&(Texture.cache[e].realSize=d[e].spriteSourceSize,Texture.cache[e].trim.x=0))}c.load()},proto.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},module.exports=SpriteSheetLoader;
},{"../events/EventTarget":33,"../textures/Texture":87,"./ImageLoader":65,"./JsonLoader":66}],69:[function(require,module,exports){
(function (global){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
module.exports={console:global.console,document:global.document,location:global.location,navigator:global.navigator,window:global.window,createCanvas:function(){return global.document.createElement("canvas")},createImage:function(){return new global.Image},createRequest:function(){return new global.XMLHttpRequest}};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],70:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Graphics(){DisplayObjectContainer.call(this),this.renderable=!0,this.fillAlpha=1,this.lineWidth=0,this.lineColor="black",this.graphicsData=[],this.currentPath={points:[]}}var DisplayObjectContainer=require("../display/DisplayObjectContainer"),Rectangle=require("../geom/Rectangle"),proto=Graphics.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:Graphics}});proto.lineStyle=function(a,b,c){this.currentPath.points.length||this.graphicsData.pop(),this.lineWidth=a||0,this.lineColor=b||0,this.lineAlpha=arguments.length<3?1:c,this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:Graphics.POLY},this.graphicsData.push(this.currentPath)},proto.moveTo=function(a,b){this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:Graphics.POLY},this.currentPath.points.push(a,b),this.graphicsData.push(this.currentPath)},proto.lineTo=function(a,b){this.currentPath.points.push(a,b),this.dirty=!0},proto.beginFill=function(a,b){this.filling=!0,this.fillColor=a||0,this.fillAlpha=arguments.length<2?1:b},proto.endFill=function(){this.filling=!1,this.fillColor=null,this.fillAlpha=1},proto.drawRect=function(a,b,c,d){this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,b,c,d],type:Graphics.RECT},this.graphicsData.push(this.currentPath),this.dirty=!0},proto.drawCircle=function(a,b,c){this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,b,c,c],type:Graphics.CIRC},this.graphicsData.push(this.currentPath),this.dirty=!0},proto.drawElipse=function(a,b,c,d){this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,b,c,d],type:Graphics.ELIP},this.graphicsData.push(this.currentPath),this.dirty=!0},proto.clear=function(){this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this.bounds=null},proto.updateFilterBounds=function(){if(!this.bounds){for(var a,b,c,d=1/0,e=-1/0,f=1/0,g=-1/0,h=0;h<this.graphicsData.length;h++){var i=this.graphicsData[h],j=i.type,k=i.lineWidth;if(a=i.points,j===Graphics.RECT){b=a.x-k/2,c=a.y-k/2;var l=a.width+k,m=a.height+k;d=d>b?b:d,e=b+l>e?b+l:e,f=f>c?b:f,g=c+m>g?c+m:g}else if(j===Graphics.CIRC||j===Graphics.ELIP){b=a.x,c=a.y;var n=a.radius+k/2;d=d>b-n?b-n:d,e=b+n>e?b+n:e,f=f>c-n?c-n:f,g=c+n>g?c+n:g}else for(var o=0;o<a.length;o+=2)b=a[o],c=a[o+1],d=d>b-k?b-k:d,e=b+k>e?b+k:e,f=f>c-k?c-k:f,g=c+k>g?c+k:g}this.bounds=new Rectangle(d,f,e-d,g-f)}},Graphics.POLY=0,Graphics.RECT=1,Graphics.CIRC=2,Graphics.ELIP=3,module.exports=Graphics;
},{"../display/DisplayObjectContainer":28,"../geom/Rectangle":60}],71:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function CanvasRenderer(a,b,c,d){this.transparent=d,this.width=a||800,this.height=b||600,this.view=c||platform.createCanvas(),this.context=this.view.getContext("2d"),this.smoothProperty=null,"imageSmoothingEnabled"in this.context?this.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context&&(this.smoothProperty="oImageSmoothingEnabled"),this.scaleMode=null,this.refresh=!0,this.view.width=this.width,this.view.height=this.height,this.count=0}var platform=require("../../platform"),globals=require("../../core/globals"),canvasGraphics=require("./graphics"),BaseTexture=require("../../textures/BaseTexture"),Texture=require("../../textures/Texture"),Sprite=require("../../display/Sprite"),TilingSprite=require("../../extras/TilingSprite"),Strip=require("../../extras/Strip"),CustomRenderable=require("../../extras/CustomRenderable"),Graphics=require("../../primitives/Graphics"),FilterBlock=require("../../filters/FilterBlock"),proto=CanvasRenderer.prototype;proto.render=function(a){globals.texturesToUpdate=[],globals.texturesToDestroy=[],globals.visibleCount++,a.updateTransform(),this.view.style.backgroundColor===a.backgroundColorString||this.transparent||(this.view.style.backgroundColor=a.backgroundColorString),this.context.setTransform(1,0,0,1,0,0),this.context.clearRect(0,0,this.width,this.height),this.renderDisplayObject(a),a.interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this))),Texture.frameUpdates.length>0&&(Texture.frameUpdates=[])},proto.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b},proto.renderDisplayObject=function(a){var b,c=this.context;c.globalCompositeOperation="source-over";var d=a.last._iNext;a=a.first;do if(b=a.worldTransform,a.visible)if(a.renderable){if(a instanceof Sprite){var e=a.texture.frame;e&&e.width&&e.height&&a.texture.baseTexture.source&&(c.globalAlpha=a.worldAlpha,c.setTransform(b[0],b[3],b[1],b[4],b[2],b[5]),this.smoothProperty&&this.scaleMode!==a.texture.baseTexture.scaleMode&&(this.scaleMode=a.texture.baseTexture.scaleMode,c[this.smoothProperty]=this.scaleMode===BaseTexture.SCALE_MODE.LINEAR),c.drawImage(a.texture.baseTexture.source,e.x,e.y,e.width,e.height,a.anchor.x*-e.width,a.anchor.y*-e.height,e.width,e.height))}else if(a instanceof Strip)c.setTransform(b[0],b[3],b[1],b[4],b[2],b[5]),this.renderStrip(a);else if(a instanceof TilingSprite)c.setTransform(b[0],b[3],b[1],b[4],b[2],b[5]),this.renderTilingSprite(a);else if(a instanceof CustomRenderable)c.setTransform(b[0],b[3],b[1],b[4],b[2],b[5]),a.renderCanvas(this);else if(a instanceof Graphics)c.setTransform(b[0],b[3],b[1],b[4],b[2],b[5]),canvasGraphics.renderGraphics(a,c);else if(a instanceof FilterBlock&&a.data instanceof Graphics){var f=a.data;if(a.open){c.save();var g=f.alpha,h=f.worldTransform;c.setTransform(h[0],h[3],h[1],h[4],h[2],h[5]),f.worldAlpha=.5,c.worldAlpha=0,canvasGraphics.renderGraphicsMask(f,c),c.clip(),f.worldAlpha=g}else c.restore()}a=a._iNext}else a=a._iNext;else a=a.last._iNext;while(a!==d)},proto.renderStripFlat=function(a){var b=this.context,c=a.verticies,d=c.length/2;this.count++,b.beginPath();for(var e=1;d-2>e;e++){var f=2*e,g=c[f],h=c[f+2],i=c[f+4],j=c[f+1],k=c[f+3],l=c[f+5];b.moveTo(g,j),b.lineTo(h,k),b.lineTo(i,l)}b.fillStyle="#FF0000",b.fill(),b.closePath()},proto.renderTilingSprite=function(a){var b=this.context;b.globalAlpha=a.worldAlpha,a.__tilePattern||(a.__tilePattern=b.createPattern(a.texture.baseTexture.source,"repeat")),b.beginPath();var c=a.tilePosition,d=a.tileScale;b.scale(d.x,d.y),b.translate(c.x,c.y),b.fillStyle=a.__tilePattern,b.fillRect(-c.x,-c.y,a.width/d.x,a.height/d.y),b.scale(1/d.x,1/d.y),b.translate(-c.x,-c.y),b.closePath()},proto.renderStrip=function(a){var b=this.context,c=a.verticies,d=a.uvs,e=c.length/2;this.count++;for(var f=1;e-2>f;f++){var g=2*f,h=c[g],i=c[g+2],j=c[g+4],k=c[g+1],l=c[g+3],m=c[g+5],n=d[g]*a.texture.width,o=d[g+2]*a.texture.width,p=d[g+4]*a.texture.width,q=d[g+1]*a.texture.height,r=d[g+3]*a.texture.height,s=d[g+5]*a.texture.height;b.save(),b.beginPath(),b.moveTo(h,k),b.lineTo(i,l),b.lineTo(j,m),b.closePath(),b.clip();var t=n*r+q*p+o*s-r*p-q*o-n*s,u=h*r+q*j+i*s-r*j-q*i-h*s,v=n*i+h*p+o*j-i*p-h*o-n*j,w=n*r*j+q*i*p+h*o*s-h*r*p-q*o*j-n*i*s,x=k*r+q*m+l*s-r*m-q*l-k*s,y=n*l+k*p+o*m-l*p-k*o-n*m,z=n*r*m+q*l*p+k*o*s-k*r*p-q*o*m-n*l*s;b.transform(u/t,x/t,v/t,y/t,w/t,z/t),b.drawImage(a.texture.baseTexture.source,0,0),b.restore()}},module.exports=CanvasRenderer;
},{"../../core/globals":26,"../../display/Sprite":30,"../../extras/CustomRenderable":34,"../../extras/Strip":37,"../../extras/TilingSprite":38,"../../filters/FilterBlock":48,"../../platform":69,"../../primitives/Graphics":70,"../../textures/BaseTexture":85,"../../textures/Texture":87,"./graphics":72}],72:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var platform=require("../../platform"),Graphics=require("../../primitives/Graphics");exports.renderGraphics=function(a,b){for(var c,d,e,f,g=a.worldAlpha,h="",i=0,j=a.graphicsData.length;j>i;i++)if(c=a.graphicsData[i],d=c.points,h=b.strokeStyle="#"+("00000"+(0|c.lineColor).toString(16)).substr(-6),b.lineWidth=c.lineWidth,c.type===Graphics.POLY){for(b.beginPath(),b.moveTo(d[0],d[1]),e=1,f=d.length/2;f>e;e++)b.lineTo(d[2*e],d[2*e+1]);d[0]===d[d.length-2]&&d[1]===d[d.length-1]&&b.closePath(),c.fill&&(b.globalAlpha=c.fillAlpha*g,b.fillStyle=h="#"+("00000"+(0|c.fillColor).toString(16)).substr(-6),b.fill()),c.lineWidth&&(b.globalAlpha=c.lineAlpha*g,b.stroke())}else if(c.type===Graphics.RECT)(c.fillColor||0===c.fillColor)&&(b.globalAlpha=c.fillAlpha*g,b.fillStyle=h="#"+("00000"+(0|c.fillColor).toString(16)).substr(-6),b.fillRect(d[0],d[1],d[2],d[3])),c.lineWidth&&(b.globalAlpha=c.lineAlpha*g,b.strokeRect(d[0],d[1],d[2],d[3]));else if(c.type===Graphics.CIRC)b.beginPath(),b.arc(d[0],d[1],d[2],0,2*Math.PI),b.closePath(),c.fill&&(b.globalAlpha=c.fillAlpha*g,b.fillStyle=h="#"+("00000"+(0|c.fillColor).toString(16)).substr(-6),b.fill()),c.lineWidth&&(b.globalAlpha=c.lineAlpha*g,b.stroke());else if(c.type===Graphics.ELIP){var k=c.points,l=2*k[2],m=2*k[3],n=k[0]-l/2,o=k[1]-m/2;b.beginPath();var p=.5522848,q=l/2*p,r=m/2*p,s=n+l,t=o+m,u=n+l/2,v=o+m/2;b.moveTo(n,v),b.bezierCurveTo(n,v-r,u-q,o,u,o),b.bezierCurveTo(u+q,o,s,v-r,s,v),b.bezierCurveTo(s,v+r,u+q,t,u,t),b.bezierCurveTo(u-q,t,n,v+r,n,v),b.closePath(),c.fill&&(b.globalAlpha=c.fillAlpha*g,b.fillStyle=h="#"+("00000"+(0|c.fillColor).toString(16)).substr(-6),b.fill()),c.lineWidth&&(b.globalAlpha=c.lineAlpha*g,b.stroke())}},exports.renderGraphicsMask=function(a,b){var c=a.graphicsData.length;if(0!==c){c>1&&(c=1,platform.console.warn("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));for(var d=0;1>d;d++){var e=a.graphicsData[d],f=e.points;if(e.type===Graphics.POLY){b.beginPath(),b.moveTo(f[0],f[1]);for(var g=1;g<f.length/2;g++)b.lineTo(f[2*g],f[2*g+1]);f[0]===f[f.length-2]&&f[1]===f[f.length-1]&&b.closePath()}else if(e.type===Graphics.RECT)b.beginPath(),b.rect(f[0],f[1],f[2],f[3]),b.closePath();else if(e.type===Graphics.CIRC)b.beginPath(),b.arc(f[0],f[1],f[2],0,2*Math.PI),b.closePath();else if(e.type===Graphics.ELIP){var h=e.points,i=2*h[2],j=2*h[3],k=h[0]-i/2,l=h[1]-j/2;b.beginPath();var m=.5522848,n=i/2*m,o=j/2*m,p=k+i,q=l+j,r=k+i/2,s=l+j/2;b.moveTo(k,s),b.bezierCurveTo(k,s-o,r-n,l,r,l),b.bezierCurveTo(r+n,l,p,s-o,p,s),b.bezierCurveTo(p,s+o,r+n,q,r,q),b.bezierCurveTo(r-n,q,k,s+o,k,s),b.closePath()}}}};
},{"../../platform":69,"../../primitives/Graphics":70}],73:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function PixiShader(){this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;","}"],this.textureCount=0}var compile=require("./compile"),globals=require("../../core/globals"),proto=PixiShader.prototype;proto.init=function(){var a=globals.gl,b=compile.program(a,this.vertexSrc||PixiShader.defaultVertexSrc,this.fragmentSrc);a.useProgram(b),this.uSampler=a.getUniformLocation(b,"uSampler"),this.projectionVector=a.getUniformLocation(b,"projectionVector"),this.offsetVector=a.getUniformLocation(b,"offsetVector"),this.dimensions=a.getUniformLocation(b,"dimensions"),this.aVertexPosition=a.getAttribLocation(b,"aVertexPosition"),this.colorAttribute=a.getAttribLocation(b,"aColor"),this.aTextureCoord=a.getAttribLocation(b,"aTextureCoord");for(var c in this.uniforms)this.uniforms[c].uniformLocation=a.getUniformLocation(b,c);this.initUniforms(),this.program=b},proto.initUniforms=function(){this.textureCount=1;var a;for(var b in this.uniforms){a=this.uniforms[b];var c=a.type;"sampler2D"===c?(a._init=!1,null!==a.value&&this.initSampler2D(a)):"mat2"===c||"mat3"===c||"mat4"===c?(a.glMatrix=!0,a.glValueLength=1,"mat2"===c?a.glFunc=globals.gl.uniformMatrix2fv:"mat3"===c?a.glFunc=globals.gl.uniformMatrix3fv:"mat4"===c&&(a.glFunc=globals.gl.uniformMatrix4fv)):(a.glFunc=globals.gl["uniform"+c],a.glValueLength="2f"===c||"2i"===c?2:"3f"===c||"3i"===c?3:"4f"===c||"4i"===c?4:1)}},proto.initSampler2D=function(a){if(a.value&&a.value.baseTexture&&a.value.baseTexture.hasLoaded){if(globals.gl.activeTexture(globals.gl["TEXTURE"+this.textureCount]),globals.gl.bindTexture(globals.gl.TEXTURE_2D,a.value.baseTexture._glTexture),a.textureData){var b=a.textureData,c=b.magFilter?b.magFilter:globals.gl.LINEAR,d=b.minFilter?b.minFilter:globals.gl.LINEAR,e=b.wrapS?b.wrapS:globals.gl.CLAMP_TO_EDGE,f=b.wrapT?b.wrapT:globals.gl.CLAMP_TO_EDGE,g=b.luminance?globals.gl.LUMINANCE:globals.gl.RGBA;if(b.repeat&&(e=globals.gl.REPEAT,f=globals.gl.REPEAT),globals.gl.pixelStorei(globals.gl.UNPACK_FLIP_Y_WEBGL,!1),b.width){var h=b.width?b.width:512,i=b.height?b.height:2,j=b.border?b.border:0;globals.gl.texImage2D(globals.gl.TEXTURE_2D,0,g,h,i,j,g,globals.gl.UNSIGNED_BYTE,null)}else globals.gl.texImage2D(globals.gl.TEXTURE_2D,0,g,globals.gl.RGBA,globals.gl.UNSIGNED_BYTE,a.value.baseTexture.source);globals.gl.texParameteri(globals.gl.TEXTURE_2D,globals.gl.TEXTURE_MAG_FILTER,c),globals.gl.texParameteri(globals.gl.TEXTURE_2D,globals.gl.TEXTURE_MIN_FILTER,d),globals.gl.texParameteri(globals.gl.TEXTURE_2D,globals.gl.TEXTURE_WRAP_S,e),globals.gl.texParameteri(globals.gl.TEXTURE_2D,globals.gl.TEXTURE_WRAP_T,f)}globals.gl.uniform1i(a.uniformLocation,this.textureCount),a._init=!0,this.textureCount++}},proto.syncUniforms=function(){this.textureCount=1;var a;for(var b in this.uniforms)a=this.uniforms[b],1===a.glValueLength?a.glMatrix===!0?a.glFunc.call(globals.gl,a.uniformLocation,a.transpose,a.value):a.glFunc.call(globals.gl,a.uniformLocation,a.value):2===a.glValueLength?a.glFunc.call(globals.gl,a.uniformLocation,a.value.x,a.value.y):3===a.glValueLength?a.glFunc.call(globals.gl,a.uniformLocation,a.value.x,a.value.y,a.value.z):4===a.glValueLength?a.glFunc.call(globals.gl,a.uniformLocation,a.value.x,a.value.y,a.value.z,a.value.w):"sampler2D"===a.type&&(a._init?(globals.gl.activeTexture(globals.gl["TEXTURE"+this.textureCount]),globals.gl.bindTexture(globals.gl.TEXTURE_2D,a.value.baseTexture._glTexture),globals.gl.uniform1i(a.uniformLocation,this.textureCount),this.textureCount++):this.initSampler2D(a))},PixiShader.defaultVertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute float aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","varying float vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"],module.exports=PixiShader;
},{"../../core/globals":26,"./compile":80}],74:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function PrimitiveShader(){this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec4 aColor;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform float alpha;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = aColor  * alpha;","}"]}var compile=require("./compile"),globals=require("../../core/globals");PrimitiveShader.prototype.init=function(){var a=globals.gl,b=compile.program(a,this.vertexSrc,this.fragmentSrc);a.useProgram(b),this.projectionVector=a.getUniformLocation(b,"projectionVector"),this.offsetVector=a.getUniformLocation(b,"offsetVector"),this.aVertexPosition=a.getAttribLocation(b,"aVertexPosition"),this.colorAttribute=a.getAttribLocation(b,"aColor"),this.translationMatrix=a.getUniformLocation(b,"translationMatrix"),this.alpha=a.getUniformLocation(b,"alpha"),this.program=b},module.exports=PrimitiveShader;
},{"../../core/globals":26,"./compile":80}],75:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function StripShader(){this.program=null,this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying float vColor;","uniform float alpha;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));","   gl_FragColor = gl_FragColor * alpha;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute float aColor;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","varying vec2 vTextureCoord;","varying vec2 offsetVector;","varying float vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / projectionVector.y + 1.0 , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"]}var compile=require("./compile"),globals=require("../../core/globals");StripShader.prototype.init=function(){var a=globals.gl,b=compile.program(a,this.vertexSrc,this.fragmentSrc);a.useProgram(b),this.uSampler=a.getUniformLocation(b,"uSampler"),this.projectionVector=a.getUniformLocation(b,"projectionVector"),this.offsetVector=a.getUniformLocation(b,"offsetVector"),this.colorAttribute=a.getAttribLocation(b,"aColor"),this.aVertexPosition=a.getAttribLocation(b,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(b,"aTextureCoord"),this.translationMatrix=a.getUniformLocation(b,"translationMatrix"),this.alpha=a.getUniformLocation(b,"alpha"),this.program=b},module.exports=StripShader;
},{"../../core/globals":26,"./compile":80}],76:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function WebGLBatch(a){this.gl=a,this.size=0,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.colorBuffer=a.createBuffer(),this.blendMode=blendModes.NORMAL,this.dynamicSize=1}var globals=require("../../core/globals"),blendModes=require("../../display/blendModes"),proto=WebGLBatch.prototype;proto.clean=function(){this.verticies=[],this.uvs=[],this.indices=[],this.colors=[],this.dynamicSize=1,this.texture=null,this.last=null,this.size=0,this.head=null,this.tail=null},proto.restoreLostContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.colorBuffer=a.createBuffer()},proto.init=function(a){a.batch=this,this.dirty=!0,this.blendMode=a.blendMode,this.texture=a.texture.baseTexture,this.head=a,this.tail=a,this.size=1,this.growBatch()},proto.insertBefore=function(a,b){this.size++,a.batch=this,this.dirty=!0;var c=b.__prev;b.__prev=a,a.__next=b,c?(a.__prev=c,c.__next=a):this.head=a},proto.insertAfter=function(a,b){this.size++,a.batch=this,this.dirty=!0;var c=b.__next;b.__next=a,a.__prev=b,c?(a.__next=c,c.__prev=a):this.tail=a},proto.remove=function(a){return this.size--,this.size?(a.__prev?a.__prev.__next=a.__next:(this.head=a.__next,this.head.__prev=null),a.__next?a.__next.__prev=a.__prev:(this.tail=a.__prev,this.tail.__next=null),a.batch=null,a.__next=null,a.__prev=null,this.dirty=!0,void 0):(a.batch=null,a.__prev=null,a.__next=null,void 0)},proto.split=function(a){this.dirty=!0;var b=new WebGLBatch(this.gl);b.init(a),b.texture=this.texture,b.tail=this.tail,this.tail=a.__prev,this.tail.__next=null,a.__prev=null;for(var c=0;a;)c++,a.batch=b,a=a.__next;return b.size=c,this.size-=c,b},proto.merge=function(a){this.dirty=!0,this.tail.__next=a.head,a.head.__prev=this.tail,this.size+=a.size,this.tail=a.tail;for(var b=a.head;b;)b.batch=this,b=b.__next},proto.growBatch=function(){var a=this.gl;this.dynamicSize=1===this.size?1:1.5*this.size,this.verticies=new Float32Array(8*this.dynamicSize),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.verticies,a.DYNAMIC_DRAW),this.uvs=new Float32Array(8*this.dynamicSize),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),a.bufferData(a.ARRAY_BUFFER,this.uvs,a.DYNAMIC_DRAW),this.dirtyUVS=!0,this.colors=new Float32Array(4*this.dynamicSize),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,this.colors,a.DYNAMIC_DRAW),this.dirtyColors=!0,this.indices=new Uint16Array(6*this.dynamicSize);for(var b=0,c=this.indices.length/6;c>b;b++){var d=6*b,e=4*b;this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3}a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW)},proto.refresh=function(){this.dynamicSize<this.size&&this.growBatch();for(var a,b,c=0,d=this.head;d;){a=8*c;var e=d.texture,f=e.frame,g=e.baseTexture.width,h=e.baseTexture.height;this.uvs[a+0]=f.x/g,this.uvs[a+1]=f.y/h,this.uvs[a+2]=(f.x+f.width)/g,this.uvs[a+3]=f.y/h,this.uvs[a+4]=(f.x+f.width)/g,this.uvs[a+5]=(f.y+f.height)/h,this.uvs[a+6]=f.x/g,this.uvs[a+7]=(f.y+f.height)/h,d.updateFrame=!1,b=4*c,this.colors[b]=this.colors[b+1]=this.colors[b+2]=this.colors[b+3]=d.worldAlpha,d=d.__next,c++}this.dirtyUVS=!0,this.dirtyColors=!0},proto.update=function(){for(var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q=0,r=this.head,s=this.verticies,t=this.uvs,u=this.colors;r;){if(r.vcount===globals.visibleCount){if(b=r.texture.frame.width,c=r.texture.frame.height,d=r.anchor.x,e=r.anchor.y,f=b*(1-d),g=b*-d,h=c*(1-e),i=c*-e,j=8*q,a=r.worldTransform,k=a[0],l=a[3],m=a[1],n=a[4],o=a[2],p=a[5],s[j+0]=k*g+m*i+o,s[j+1]=n*i+l*g+p,s[j+2]=k*f+m*i+o,s[j+3]=n*i+l*f+p,s[j+4]=k*f+m*h+o,s[j+5]=n*h+l*f+p,s[j+6]=k*g+m*h+o,s[j+7]=n*h+l*g+p,r.updateFrame||r.texture.updateFrame){this.dirtyUVS=!0;var v=r.texture,w=v.frame,x=v.baseTexture.width,y=v.baseTexture.height;t[j+0]=w.x/x,t[j+1]=w.y/y,t[j+2]=(w.x+w.width)/x,t[j+3]=w.y/y,t[j+4]=(w.x+w.width)/x,t[j+5]=(w.y+w.height)/y,t[j+6]=w.x/x,t[j+7]=(w.y+w.height)/y,r.updateFrame=!1}if(r.cacheAlpha!==r.worldAlpha){r.cacheAlpha=r.worldAlpha;var z=4*q;u[z]=u[z+1]=u[z+2]=u[z+3]=r.worldAlpha,this.dirtyColors=!0}}else j=8*q,s[j+0]=s[j+1]=s[j+2]=s[j+3]=s[j+4]=s[j+5]=s[j+6]=s[j+7]=0;q++,r=r.__next}},proto.render=function(a,b){if(a=a||0,arguments.length<2&&(b=this.size),this.dirty&&(this.refresh(),this.dirty=!1),this.size){this.update();var c=this.gl,d=globals.defaultShader;c.bindBuffer(c.ARRAY_BUFFER,this.vertexBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,this.verticies),c.vertexAttribPointer(d.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this.uvBuffer),this.dirtyUVS&&(this.dirtyUVS=!1,c.bufferSubData(c.ARRAY_BUFFER,0,this.uvs)),c.vertexAttribPointer(d.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture._glTexture),c.bindBuffer(c.ARRAY_BUFFER,this.colorBuffer),this.dirtyColors&&(this.dirtyColors=!1,c.bufferSubData(c.ARRAY_BUFFER,0,this.colors)),c.vertexAttribPointer(d.colorAttribute,1,c.FLOAT,!1,0,0),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var e=b-a;c.drawElements(c.TRIANGLES,6*e,c.UNSIGNED_SHORT,2*a*6)}};var batches=[];WebGLBatch.restoreBatches=function(a){for(var b=0,c=batches.length;c>b;b++)batches[b].restoreLostContext(a)},WebGLBatch.getBatch=function(){return batches.length?batches.pop():new WebGLBatch(globals.gl)},WebGLBatch.returnBatch=function(a){a.clean(),batches.push(a)},module.exports=WebGLBatch;
},{"../../core/globals":26,"../../display/blendModes":32}],77:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function FilterTexture(a,b){var c=globals.gl;this.frameBuffer=c.createFramebuffer(),this.texture=c.createTexture(),c.bindTexture(c.TEXTURE_2D,this.texture),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,c.LINEAR),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,c.LINEAR),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE),c.bindFramebuffer(c.FRAMEBUFFER,this.framebuffer),c.bindFramebuffer(c.FRAMEBUFFER,this.frameBuffer),c.framebufferTexture2D(c.FRAMEBUFFER,c.COLOR_ATTACHMENT0,c.TEXTURE_2D,this.texture,0),this.resize(a,b)}function WebGLFilterManager(a){this.transparent=a,this.filterStack=[],this.texturePool=[],this.offsetX=0,this.offsetY=0,this.initShaderBuffers()}var globals=require("../../core/globals"),Sprite=require("../../display/Sprite"),Graphics=require("../../primitives/Graphics"),PixiShader=require("./PixiShader");FilterTexture.prototype.resize=function(a,b){if(this.width!==a||this.height!==b){this.width=a,this.height=b;var c=globals.gl;c.bindTexture(c.TEXTURE_2D,this.texture),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,a,b,0,c.RGBA,c.UNSIGNED_BYTE,null)}};var proto=WebGLFilterManager.prototype;proto.begin=function(a,b){this.width=2*a.x,this.height=2*-a.y,this.buffer=b},proto.pushFilter=function(a){var b=globals.gl;this.filterStack.push(a);var c=a.filterPasses[0];this.offsetX+=a.target.filterArea.x,this.offsetY+=a.target.filterArea.y;var d=this.texturePool.pop();d?d.resize(this.width,this.height):d=new FilterTexture(this.width,this.height),b.bindTexture(b.TEXTURE_2D,d.texture),this.getBounds(a.target);var e=a.target.filterArea,f=c.padding;e.x-=f,e.y-=f,e.width+=2*f,e.height+=2*f,e.x<0&&(e.x=0),e.width>this.width&&(e.width=this.width),e.y<0&&(e.y=0),e.height>this.height&&(e.height=this.height),b.bindFramebuffer(b.FRAMEBUFFER,d.frameBuffer),b.viewport(0,0,e.width,e.height),globals.projection.x=e.width/2,globals.projection.y=-e.height/2,globals.offset.x=-e.x,globals.offset.y=-e.y,b.uniform2f(globals.defaultShader.projectionVector,e.width/2,-e.height/2),b.uniform2f(globals.defaultShader.offsetVector,-e.x,-e.y),b.colorMask(!0,!0,!0,!0),b.clearColor(0,0,0,0),b.clear(b.COLOR_BUFFER_BIT),a._glFilterTexture=d},proto.popFilter=function(){var a=globals.gl,b=this.filterStack.pop(),c=b.target.filterArea,d=b._glFilterTexture;if(b.filterPasses.length>1){a.viewport(0,0,c.width,c.height),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=0,this.vertexArray[1]=c.height,this.vertexArray[2]=c.width,this.vertexArray[3]=c.height,this.vertexArray[4]=0,this.vertexArray[5]=0,this.vertexArray[6]=c.width,this.vertexArray[7]=0,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=c.width/this.width,this.uvArray[5]=c.height/this.height,this.uvArray[6]=c.width/this.width,this.uvArray[7]=c.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray);var e=d,f=this.texturePool.pop();f||(f=new FilterTexture(this.width,this.height)),a.bindFramebuffer(a.FRAMEBUFFER,f.frameBuffer),a.clear(a.COLOR_BUFFER_BIT),a.disable(a.BLEND);for(var g=0;g<b.filterPasses.length-1;g++){var h=b.filterPasses[g];a.bindFramebuffer(a.FRAMEBUFFER,f.frameBuffer),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e.texture),this.applyFilterPass(h,c,c.width,c.height);var i=e;e=f,f=i}a.enable(a.BLEND),d=e,this.texturePool.push(f)}var j=b.filterPasses[b.filterPasses.length-1];this.offsetX-=c.x,this.offsetY-=c.y;var k=this.width,l=this.height,m=0,n=0,o=this.buffer;if(0===this.filterStack.length)a.colorMask(!0,!0,!0,this.transparent);else{var p=this.filterStack[this.filterStack.length-1];c=p.target.filterArea,k=c.width,l=c.height,m=c.x,n=c.y,o=p._glFilterTexture.frameBuffer}globals.projection.x=k/2,globals.projection.y=-l/2,globals.offset.x=m,globals.offset.y=n,c=b.target.filterArea;var q=c.x-m,r=c.y-n;a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=q,this.vertexArray[1]=r+c.height,this.vertexArray[2]=q+c.width,this.vertexArray[3]=r+c.height,this.vertexArray[4]=q,this.vertexArray[5]=r,this.vertexArray[6]=q+c.width,this.vertexArray[7]=r,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=c.width/this.width,this.uvArray[5]=c.height/this.height,this.uvArray[6]=c.width/this.width,this.uvArray[7]=c.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray),a.viewport(0,0,k,l),a.bindFramebuffer(a.FRAMEBUFFER,o),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,d.texture),this.applyFilterPass(j,c,k,l),a.useProgram(globals.defaultShader.program),a.uniform2f(globals.defaultShader.projectionVector,k/2,-l/2),a.uniform2f(globals.defaultShader.offsetVector,-m,-n),this.texturePool.push(d),b._glFilterTexture=null},proto.applyFilterPass=function(a,b,c,d){var e=globals.gl,f=a.shader;f||(f=new PixiShader,f.fragmentSrc=a.fragmentSrc,f.uniforms=a.uniforms,f.init(),a.shader=f),e.useProgram(f.program),e.uniform2f(f.projectionVector,c/2,-d/2),e.uniform2f(f.offsetVector,0,0),a.uniforms.dimensions&&(a.uniforms.dimensions.value[0]=this.width,a.uniforms.dimensions.value[1]=this.height,a.uniforms.dimensions.value[2]=this.vertexArray[0],a.uniforms.dimensions.value[3]=this.vertexArray[5]),f.syncUniforms(),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer),e.vertexAttribPointer(f.aVertexPosition,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.uvBuffer),e.vertexAttribPointer(f.aTextureCoord,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)},proto.initShaderBuffers=function(){var a=globals.gl;this.vertexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.vertexArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertexArray,a.STATIC_DRAW),this.uvArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),a.bufferData(a.ARRAY_BUFFER,this.uvArray,a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,3,2]),a.STATIC_DRAW)},proto.getBounds=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z=a.first,A=a.last._iNext,B=-1/0,C=-1/0,D=1/0,E=1/0;do{if(z.visible)if(z instanceof Sprite)c=z.texture.frame.width,d=z.texture.frame.height,e=z.anchor.x,f=z.anchor.y,g=c*(1-e),h=c*-e,i=d*(1-f),j=d*-f,k=!0;else if(z instanceof Graphics){z.updateFilterBounds();var F=z.bounds;c=F.width,d=F.height,g=F.x,h=F.x+F.width,i=F.y,j=F.y+F.height,k=!0}k&&(b=z.worldTransform,l=b[0],m=b[3],n=b[1],o=b[4],p=b[2],q=b[5],r=l*h+n*j+p,v=o*j+m*h+q,s=l*g+n*j+p,w=o*j+m*g+q,t=l*g+n*i+p,x=o*i+m*g+q,u=l*h+n*i+p,y=o*i+m*h+q,D=D>r?r:D,D=D>s?s:D,D=D>t?t:D,D=D>u?u:D,E=E>v?v:E,E=E>w?w:E,E=E>x?x:E,E=E>y?y:E,B=r>B?r:B,B=s>B?s:B,B=t>B?t:B,B=u>B?u:B,C=v>C?v:C,C=w>C?w:C,C=x>C?x:C,C=y>C?y:C),k=!1,z=z._iNext}while(z!==A);a.filterArea.x=D,a.filterArea.y=E,a.filterArea.width=B-D,a.filterArea.height=C-E},module.exports=WebGLFilterManager;
},{"../../core/globals":26,"../../display/Sprite":30,"../../primitives/Graphics":70,"./PixiShader":73}],78:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function WebGLRenderGroup(a,b){this.gl=a,this.root=null,this.backgroundColor=void 0,this.transparent=void 0===b?!0:b,this.batchs=[],this.toRemove=[],this.filterManager=new WebGLFilterManager(this.transparent)}var globals=require("../../core/globals"),shaders=require("./shaders"),webglGraphics=require("./graphics"),WebGLBatch=require("./WebGLBatch"),WebGLFilterManager=require("./WebGLFilterManager"),mat3=require("../../geom/matrix").mat3,BaseTexture=require("../../textures/BaseTexture"),TilingSprite=require("../../extras/TilingSprite"),Strip=require("../../extras/Strip"),Graphics=require("../../primitives/Graphics"),FilterBlock=require("../../filters/FilterBlock"),Sprite=require("../../display/Sprite"),CustomRenderable=require("../../extras/CustomRenderable"),proto=WebGLRenderGroup.prototype;proto.setRenderable=function(a){this.root&&this.removeDisplayObjectAndChildren(this.root),a.worldVisible=a.visible,this.root=a,this.addDisplayObjectAndChildren(a)},proto.render=function(a,b){var c=this.gl;WebGLRenderGroup.updateTextures(c),c.uniform2f(globals.defaultShader.projectionVector,a.x,a.y),this.filterManager.begin(a,b),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA);for(var d,e=0;e<this.batchs.length;e++)d=this.batchs[e],d instanceof WebGLBatch?this.batchs[e].render():this.renderSpecial(d,a)},proto.handleFilter=function(){},proto.renderSpecific=function(a,b,c){var d=this.gl;WebGLRenderGroup.updateTextures(d),d.uniform2f(globals.defaultShader.projectionVector,b.x,b.y),this.filterManager.begin(b,c);for(var e,f,g,h,i,j,k=a.first;k._iNext&&(!k.renderable||!k.__renderGroup);)k=k._iNext;var l=k.batch;if(k instanceof Sprite)if(l=k.batch,j=l.head,j===k)e=0;else for(e=1;j.__next!==k;)e++,j=j.__next;else l=k;for(var m=a.last;m._iPrev&&(!m.renderable||!m.__renderGroup);)m=m._iNext;if(m instanceof Sprite)if(i=m.batch,j=i.head,j===m)g=0;else for(g=1;j.__next!==m;)g++,j=j.__next;else i=m;if(l===i)return l instanceof WebGLBatch?l.render(e,g+1):this.renderSpecial(l,b),void 0;f=this.batchs.indexOf(l),h=this.batchs.indexOf(i),l instanceof WebGLBatch?l.render(e):this.renderSpecial(l,b);for(var n,o=f+1;h>o;o++)n=this.batchs[o],n instanceof WebGLBatch?this.batchs[o].render():this.renderSpecial(n,b);i instanceof WebGLBatch?i.render(0,g+1):this.renderSpecial(i,b)},proto.renderSpecial=function(a,b){var c=a.vcount===globals.visibleCount;a instanceof TilingSprite?c&&this.renderTilingSprite(a,b):a instanceof Strip?c&&this.renderStrip(a,b):a instanceof CustomRenderable?c&&a.renderWebGL(this,b):a instanceof Graphics?c&&a.renderable&&webglGraphics.renderGraphics(a,b):a instanceof FilterBlock&&this.handleFilterBlock(a,b)};var maskStack=[];proto.handleFilterBlock=function(a,b){var c=globals.gl;if(a.open)a.data instanceof Array?this.filterManager.pushFilter(a):(maskStack.push(a),c.enable(c.STENCIL_TEST),c.colorMask(!1,!1,!1,!1),c.stencilFunc(c.ALWAYS,1,1),c.stencilOp(c.KEEP,c.KEEP,c.INCR),webglGraphics.renderGraphics(a.data,b),c.colorMask(!0,!0,!0,!0),c.stencilFunc(c.NOTEQUAL,0,maskStack.length),c.stencilOp(c.KEEP,c.KEEP,c.KEEP));else if(a.data instanceof Array)this.filterManager.popFilter();else{var d=maskStack.pop(a);d&&(c.colorMask(!1,!1,!1,!1),c.stencilFunc(c.ALWAYS,1,1),c.stencilOp(c.KEEP,c.KEEP,c.DECR),webglGraphics.renderGraphics(d.data,b),c.colorMask(!0,!0,!0,!0),c.stencilFunc(c.NOTEQUAL,0,maskStack.length),c.stencilOp(c.KEEP,c.KEEP,c.KEEP)),c.disable(c.STENCIL_TEST)}},proto.updateTexture=function(a){this.removeObject(a);for(var b=a.first;b!==this.root&&(b=b._iPrev,!b.renderable||!b.__renderGroup););for(var c=a.last;c._iNext&&(c=c._iNext,!c.renderable||!c.__renderGroup););this.insertObject(a,b,c)},proto.addFilterBlocks=function(a,b){a.__renderGroup=this,b.__renderGroup=this;for(var c=a;c!==this.root.first&&(c=c._iPrev,!c.renderable||!c.__renderGroup););this.insertAfter(a,c);for(var d=b;d!==this.root.first&&(d=d._iPrev,!d.renderable||!d.__renderGroup););this.insertAfter(b,d)},proto.removeFilterBlocks=function(a,b){this.removeObject(a),this.removeObject(b)},proto.addDisplayObjectAndChildren=function(a){a.__renderGroup&&a.__renderGroup.removeDisplayObjectAndChildren(a);for(var b=a.first;b!==this.root.first&&(b=b._iPrev,!b.renderable||!b.__renderGroup););for(var c=a.last;c._iNext&&(c=c._iNext,!c.renderable||!c.__renderGroup););var d=a.first,e=a.last._iNext;do d.__renderGroup=this,d.renderable&&(this.insertObject(d,b,c),b=d),d=d._iNext;while(d!==e)},proto.removeDisplayObjectAndChildren=function(a){if(a.__renderGroup===this)do a.__renderGroup=null,a.renderable&&this.removeObject(a),a=a._iNext;while(a)},proto.insertObject=function(a,b,c){var d,e,f=b,g=c;if(a instanceof Sprite){var h,i;if(f instanceof Sprite){if(h=f.batch,h&&h.texture===a.texture.baseTexture&&h.blendMode===a.blendMode)return h.insertAfter(a,f),void 0}else h=f;if(g)if(g instanceof Sprite){if(i=g.batch){if(i.texture===a.texture.baseTexture&&i.blendMode===a.blendMode)return i.insertBefore(a,g),void 0;if(i===h){var j=h.split(g);return d=WebGLBatch.getBatch(),e=this.batchs.indexOf(h),d.init(a),this.batchs.splice(e+1,0,d,j),void 0}}}else i=g;return d=WebGLBatch.getBatch(),d.init(a),h?(e=this.batchs.indexOf(h),this.batchs.splice(e+1,0,d)):this.batchs.push(d),void 0}a instanceof TilingSprite?this.initTilingSprite(a):a instanceof Strip&&this.initStrip(a),this.insertAfter(a,f)},proto.insertAfter=function(a,b){var c,d,e;b instanceof Sprite?(c=b.batch,c?c.tail===b?(e=this.batchs.indexOf(c),this.batchs.splice(e+1,0,a)):(d=c.split(b.__next),e=this.batchs.indexOf(c),this.batchs.splice(e+1,0,a,d)):this.batchs.push(a)):(e=this.batchs.indexOf(b),this.batchs.splice(e+1,0,a))},proto.removeObject=function(a){var b,c;if(a instanceof Sprite){var d=a.batch;if(!d)return;d.remove(a),d.size||(b=d)}else b=a;if(b){if(c=this.batchs.indexOf(b),-1===c)return;if(0===c||c===this.batchs.length-1)return this.batchs.splice(c,1),b instanceof WebGLBatch&&WebGLBatch.returnBatch(b),void 0;if(this.batchs[c-1]instanceof WebGLBatch&&this.batchs[c+1]instanceof WebGLBatch&&this.batchs[c-1].texture===this.batchs[c+1].texture&&this.batchs[c-1].blendMode===this.batchs[c+1].blendMode)return this.batchs[c-1].merge(this.batchs[c+1]),b instanceof WebGLBatch&&WebGLBatch.returnBatch(b),WebGLBatch.returnBatch(this.batchs[c+1]),this.batchs.splice(c,2),void 0;this.batchs.splice(c,1),b instanceof WebGLBatch&&WebGLBatch.returnBatch(b)}},proto.initTilingSprite=function(a){var b=this.gl;a.verticies=new Float32Array([0,0,a.width,0,a.width,a.height,0,a.height]),a.uvs=new Float32Array([0,0,1,0,1,1,0,1]),a.colors=new Float32Array([1,1,1,1]),a.indices=new Uint16Array([0,1,3,2]),a._vertexBuffer=b.createBuffer(),a._indexBuffer=b.createBuffer(),a._uvBuffer=b.createBuffer(),a._colorBuffer=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,a._vertexBuffer),b.bufferData(b.ARRAY_BUFFER,a.verticies,b.STATIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,a._uvBuffer),b.bufferData(b.ARRAY_BUFFER,a.uvs,b.DYNAMIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,a._colorBuffer),b.bufferData(b.ARRAY_BUFFER,a.colors,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,a._indexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,a.indices,b.STATIC_DRAW),a.texture.baseTexture._glTexture?(b.bindTexture(b.TEXTURE_2D,a.texture.baseTexture._glTexture),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.REPEAT),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.REPEAT),a.texture.baseTexture._powerOf2=!0):a.texture.baseTexture._powerOf2=!0},proto.renderStrip=function(a,b){var c=this.gl;shaders.activateStripShader();var d=globals.stripShader,e=mat3.clone(a.worldTransform);mat3.transpose(e),c.uniformMatrix3fv(d.translationMatrix,!1,e),c.uniform2f(d.projectionVector,b.x,b.y),c.uniform2f(d.offsetVector,-globals.offset.x,-globals.offset.y),c.uniform1f(d.alpha,a.worldAlpha),a.dirty?(a.dirty=!1,c.bindBuffer(c.ARRAY_BUFFER,a._vertexBuffer),c.bufferData(c.ARRAY_BUFFER,a.verticies,c.STATIC_DRAW),c.vertexAttribPointer(d.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,a._uvBuffer),c.bufferData(c.ARRAY_BUFFER,a.uvs,c.STATIC_DRAW),c.vertexAttribPointer(d.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,a.texture.baseTexture._glTexture),c.bindBuffer(c.ARRAY_BUFFER,a._colorBuffer),c.bufferData(c.ARRAY_BUFFER,a.colors,c.STATIC_DRAW),c.vertexAttribPointer(d.colorAttribute,1,c.FLOAT,!1,0,0),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,a._indexBuffer),c.bufferData(c.ELEMENT_ARRAY_BUFFER,a.indices,c.STATIC_DRAW)):(c.bindBuffer(c.ARRAY_BUFFER,a._vertexBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,a.verticies),c.vertexAttribPointer(d.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,a._uvBuffer),c.vertexAttribPointer(d.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,a.texture.baseTexture._glTexture),c.bindBuffer(c.ARRAY_BUFFER,a._colorBuffer),c.vertexAttribPointer(d.colorAttribute,1,c.FLOAT,!1,0,0),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,a._indexBuffer)),c.drawElements(c.TRIANGLE_STRIP,a.indices.length,c.UNSIGNED_SHORT,0),shaders.deactivateStripShader()},proto.renderTilingSprite=function(a,b){var c=this.gl,d=a.tilePosition,e=a.tileScale,f=d.x/a.texture.baseTexture.width,g=d.y/a.texture.baseTexture.height,h=a.width/a.texture.baseTexture.width/e.x,i=a.height/a.texture.baseTexture.height/e.y;a.uvs[0]=0-f,a.uvs[1]=0-g,a.uvs[2]=1*h-f,a.uvs[3]=0-g,a.uvs[4]=1*h-f,a.uvs[5]=1*i-g,a.uvs[6]=0-f,a.uvs[7]=1*i-g,c.bindBuffer(c.ARRAY_BUFFER,a._uvBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,a.uvs),this.renderStrip(a,b)},proto.initStrip=function(a){var b=this.gl;a._vertexBuffer=b.createBuffer(),a._indexBuffer=b.createBuffer(),a._uvBuffer=b.createBuffer(),a._colorBuffer=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,a._vertexBuffer),b.bufferData(b.ARRAY_BUFFER,a.verticies,b.DYNAMIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,a._uvBuffer),b.bufferData(b.ARRAY_BUFFER,a.uvs,b.STATIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,a._colorBuffer),b.bufferData(b.ARRAY_BUFFER,a.colors,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,a._indexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,a.indices,b.STATIC_DRAW)},WebGLRenderGroup.updateTexture=function(a,b){b._glTexture||(b._glTexture=a.createTexture()),b.hasLoaded&&(a.bindTexture(a.TEXTURE_2D,b._glTexture),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,b.source),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,b.scaleMode===BaseTexture.SCALE_MODE.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,b.scaleMode===BaseTexture.SCALE_MODE.LINEAR?a.LINEAR:a.NEAREST),b._powerOf2?(a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.REPEAT)):(a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE)),a.bindTexture(a.TEXTURE_2D,null))},WebGLRenderGroup.destroyTexture=function(a,b){b._glTexture&&(b._glTexture=a.createTexture(),a.deleteTexture(a.TEXTURE_2D,b._glTexture))},WebGLRenderGroup.updateTextures=function(a){for(var b=0,c=globals.texturesToUpdate.length;c>b;b++)WebGLRenderGroup.updateTexture(a,globals.texturesToUpdate[b]);for(b=0,c=globals.texturesToDestroy.length;c>b;b++)WebGLRenderGroup.destroyTexture(a,globals.texturesToDestroy[b]);globals.texturesToUpdate=[],globals.texturesToDestroy=[]},module.exports=WebGLRenderGroup;
},{"../../core/globals":26,"../../display/Sprite":30,"../../extras/CustomRenderable":34,"../../extras/Strip":37,"../../extras/TilingSprite":38,"../../filters/FilterBlock":48,"../../geom/matrix":61,"../../primitives/Graphics":70,"../../textures/BaseTexture":85,"./WebGLBatch":76,"./WebGLFilterManager":77,"./graphics":81,"./shaders":82}],79:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function WebGLRenderer(a,b,c,d,e){var f;this.transparent=!!d,this.width=a||800,this.height=b||600,this.view=c||platform.createCanvas(),this.view.width=this.width,this.view.height=this.height;var g=this;this.view.addEventListener("webglcontextlost",function(a){g.handleContextLost(a)},!1),this.view.addEventListener("webglcontextrestored",function(a){g.handleContextRestored(a)},!1),this.batchs=[];var h={alpha:this.transparent,antialias:!!e,premultipliedAlpha:!1,stencil:!0};try{f=this.view.getContext("experimental-webgl",h)}catch(i){try{f=this.view.getContext("webgl",h)}catch(j){throw new Error(" This browser does not support webGL. Try using the canvas renderer"+this)}}this.gl=globals.gl=f,shaders.initDefaultShaders(),f.useProgram(globals.defaultShader.program),this.batch=new WebGLBatch(f),f.disable(f.DEPTH_TEST),f.disable(f.CULL_FACE),f.enable(f.BLEND),f.colorMask(!0,!0,!0,this.transparent),this.projection=globals.projection=new Point(400,300),this.offset=globals.offset=new Point(0,0),this.resize(this.width,this.height),this.contextLost=!1,this.stageRenderGroup=new WebGLRenderGroup(this.gl,this.transparent)}var platform=require("../../platform"),globals=require("../../core/globals"),shaders=require("./shaders"),WebGLBatch=require("./WebGLBatch"),WebGLRenderGroup=require("./WebGLRenderGroup"),Point=require("../../geom/Point"),Texture=require("../../textures/Texture"),proto=WebGLRenderer.prototype;proto.render=function(a){if(!this.contextLost){this.__stage!==a&&(this.__stage=a,this.stageRenderGroup.setRenderable(a));var b=this.gl;if(WebGLRenderGroup.updateTextures(b),globals.visibleCount++,a.updateTransform(),b.colorMask(!0,!0,!0,this.transparent),b.viewport(0,0,this.width,this.height),b.bindFramebuffer(b.FRAMEBUFFER,null),b.clearColor(a.backgroundColorSplit[0],a.backgroundColorSplit[1],a.backgroundColorSplit[2],!this.transparent),b.clear(b.COLOR_BUFFER_BIT),this.stageRenderGroup.backgroundColor=a.backgroundColorSplit,this.projection.x=this.width/2,this.projection.y=-this.height/2,this.stageRenderGroup.render(this.projection),a.interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this))),Texture.frameUpdates.length>0){for(var c=0,d=Texture.frameUpdates.length;d>c;c++)Texture.frameUpdates[c].updateFrame=!1;Texture.frameUpdates=[]}}},proto.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b,this.gl.viewport(0,0,this.width,this.height),this.projection.x=this.width/2,this.projection.y=-this.height/2},proto.handleContextLost=function(a){a.preventDefault(),this.contextLost=!0},proto.handleContextRestored=function(){var a=this.gl=this.view.getContext("experimental-webgl",{alpha:!0});this.initShaders();for(var b in Texture.cache){var c=Texture.cache[b].baseTexture;c._glTexture=null,WebGLRenderGroup.updateTexture(a,c)}for(var d=0,e=this.batchs.length;e>d;d++)this.batchs[d].restoreLostContext(a),this.batchs[d].dirty=!0;WebGLBatch.restoreBatches(a),this.contextLost=!1},module.exports=WebGLRenderer;
},{"../../core/globals":26,"../../geom/Point":58,"../../platform":69,"../../textures/Texture":87,"./WebGLBatch":76,"./WebGLRenderGroup":78,"./shaders":82}],80:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var platform=require("../../platform");exports.shader=function(a,b,c){var d=b.join("\n"),e=a.createShader(c);return a.shaderSource(e,d),a.compileShader(e),a.getShaderParameter(e,a.COMPILE_STATUS)?e:(platform.console&&platform.console.error(a.getShaderInfoLog(e)),null)},exports.program=function(a,b,c){var d=exports.shader(a,c,a.FRAGMENT_SHADER),e=exports.shader(a,b,a.VERTEX_SHADER),f=a.createProgram();return a.attachShader(f,e),a.attachShader(f,d),a.linkProgram(f),a.getProgramParameter(f,a.LINK_STATUS)?f:(platform.console&&platform.console.error("Could not initialise shaders"),null)};
},{"../../platform":69}],81:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var shaders=require("./shaders"),globals=require("../../core/globals"),mat3=require("../../geom/matrix").mat3,hex2rgb=require("../../utils/color").hex2rgb,triangulate=require("../../utils/Polyk").triangulate,Point=require("../../geom/Point"),Graphics=require("../../primitives/Graphics");exports.renderGraphics=function(a,b){var c=globals.gl;a._webGL||(a._webGL={points:[],indices:[],lastIndex:0,buffer:c.createBuffer(),indexBuffer:c.createBuffer()}),a.dirty&&(a.dirty=!1,a.clearDirty&&(a.clearDirty=!1,a._webGL.lastIndex=0,a._webGL.points=[],a._webGL.indices=[]),exports.updateGraphics(a)),shaders.activatePrimitiveShader();var d=mat3.clone(a.worldTransform);mat3.transpose(d),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.uniformMatrix3fv(globals.primitiveShader.translationMatrix,!1,d),c.uniform2f(globals.primitiveShader.projectionVector,b.x,-b.y),c.uniform2f(globals.primitiveShader.offsetVector,-globals.offset.x,-globals.offset.y),c.uniform1f(globals.primitiveShader.alpha,a.worldAlpha),c.bindBuffer(c.ARRAY_BUFFER,a._webGL.buffer),c.vertexAttribPointer(globals.primitiveShader.aVertexPosition,2,c.FLOAT,!1,24,0),c.vertexAttribPointer(globals.primitiveShader.colorAttribute,4,c.FLOAT,!1,24,8),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,a._webGL.indexBuffer),c.drawElements(c.TRIANGLE_STRIP,a._webGL.indices.length,c.UNSIGNED_SHORT,0),shaders.deactivatePrimitiveShader()},exports.updateGraphics=function(a){for(var b=a._webGL.lastIndex;b<a.graphicsData.length;b++){var c=a.graphicsData[b];c.type===Graphics.POLY?(c.fill&&c.points.length>3&&exports.buildPoly(c,a._webGL),c.lineWidth>0&&exports.buildLine(c,a._webGL)):c.type===Graphics.RECT?exports.buildRectangle(c,a._webGL):c.type===Graphics.CIRC||c.type===Graphics.ELIP,exports.buildCircle(c,a._webGL)}a._webGL.lastIndex=a.graphicsData.length;var d=globals.gl;a._webGL.glPoints=new Float32Array(a._webGL.points),d.bindBuffer(d.ARRAY_BUFFER,a._webGL.buffer),d.bufferData(d.ARRAY_BUFFER,a._webGL.glPoints,d.STATIC_DRAW),a._webGL.glIndicies=new Uint16Array(a._webGL.indices),d.bindBuffer(d.ELEMENT_ARRAY_BUFFER,a._webGL.indexBuffer),d.bufferData(d.ELEMENT_ARRAY_BUFFER,a._webGL.glIndicies,d.STATIC_DRAW)},exports.buildRectangle=function(a,b){var c=a.points,d=c[0],e=c[1],f=c[2],g=c[3];if(a.fill){var h=hex2rgb(a.fillColor),i=a.fillAlpha,j=h[0]*i,k=h[1]*i,l=h[2]*i,m=b.points,n=b.indices,o=m.length/6;m.push(d,e),m.push(j,k,l,i),m.push(d+f,e),m.push(j,k,l,i),m.push(d,e+g),m.push(j,k,l,i),m.push(d+f,e+g),m.push(j,k,l,i),n.push(o,o,o+1,o+2,o+3,o+3)}a.lineWidth&&(a.points=[d,e,d+f,e,d+f,e+g,d,e+g,d,e],exports.buildLine(a,b))},exports.buildCircle=function(a,b){var c=a.points,d=c[0],e=c[1],f=c[2],g=c[3],h=40,i=2*Math.PI/h,j=0;if(a.fill){var k=hex2rgb(a.fillColor),l=a.fillAlpha,m=k[0]*l,n=k[1]*l,o=k[2]*l,p=b.points,q=b.indices,r=p.length/6;for(q.push(r),j=0;h+1>j;j++)p.push(d,e,m,n,o,l),p.push(d+Math.sin(i*j)*f,e+Math.cos(i*j)*g,m,n,o,l),q.push(r++,r++);q.push(r-1)}if(a.lineWidth){for(a.points=[],j=0;h+1>j;j++)a.points.push(d+Math.sin(i*j)*f,e+Math.cos(i*j)*g);exports.buildLine(a,b)}},exports.buildLine=function(a,b){var c=0,d=a.points;if(0!==d.length){if(a.lineWidth%2)for(c=0;c<d.length;c++)d[c]+=.5;var e=new Point(d[0],d[1]),f=new Point(d[d.length-2],d[d.length-1]);if(e.x===f.x&&e.y===f.y){d.pop(),d.pop(),f=new Point(d[d.length-2],d[d.length-1]);var g=f.x+.5*(e.x-f.x),h=f.y+.5*(e.y-f.y);d.unshift(g,h),d.push(g,h)}var i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F=b.points,G=b.indices,H=d.length/2,I=d.length,J=F.length/6,K=a.lineWidth/2,L=hex2rgb(a.lineColor),M=a.lineAlpha,N=L[0]*M,O=L[1]*M,P=L[2]*M;for(k=d[0],l=d[1],m=d[2],n=d[3],q=-(l-n),r=k-m,E=Math.sqrt(q*q+r*r),q/=E,r/=E,q*=K,r*=K,F.push(k-q,l-r,N,O,P,M),F.push(k+q,l+r,N,O,P,M),c=1;H-1>c;c++)k=d[2*(c-1)],l=d[2*(c-1)+1],m=d[2*c],n=d[2*c+1],o=d[2*(c+1)],p=d[2*(c+1)+1],q=-(l-n),r=k-m,E=Math.sqrt(q*q+r*r),q/=E,r/=E,q*=K,r*=K,s=-(n-p),t=m-o,E=Math.sqrt(s*s+t*t),s/=E,t/=E,s*=K,t*=K,w=-r+l-(-r+n),x=-q+m-(-q+k),y=(-q+k)*(-r+n)-(-q+m)*(-r+l),z=-t+p-(-t+n),A=-s+m-(-s+o),B=(-s+o)*(-t+n)-(-s+m)*(-t+p),C=w*A-z*x,Math.abs(C)<.1?(C+=10.1,F.push(m-q,n-r,N,O,P,M),F.push(m+q,n+r,N,O,P,M)):(i=(x*B-A*y)/C,j=(z*y-w*B)/C,D=(i-m)*(i-m)+(j-n)+(j-n),D>19600?(u=q-s,v=r-t,E=Math.sqrt(u*u+v*v),u/=E,v/=E,u*=K,v*=K,F.push(m-u,n-v),F.push(N,O,P,M),F.push(m+u,n+v),F.push(N,O,P,M),F.push(m-u,n-v),F.push(N,O,P,M),I++):(F.push(i,j),F.push(N,O,P,M),F.push(m-(i-m),n-(j-n)),F.push(N,O,P,M)));for(k=d[2*(H-2)],l=d[2*(H-2)+1],m=d[2*(H-1)],n=d[2*(H-1)+1],q=-(l-n),r=k-m,E=Math.sqrt(q*q+r*r),q/=E,r/=E,q*=K,r*=K,F.push(m-q,n-r),F.push(N,O,P,M),F.push(m+q,n+r),F.push(N,O,P,M),G.push(J),c=0;I>c;c++)G.push(J++);G.push(J-1)}},exports.buildPoly=function(a,b){var c=a.points;if(!(c.length<6)){var d=b.points,e=b.indices,f=c.length/2,g=hex2rgb(a.fillColor),h=a.fillAlpha,i=g[0]*h,j=g[1]*h,k=g[2]*h,l=triangulate(c),m=d.length/6,n=0;for(n=0;n<l.length;n+=3)e.push(l[n]+m),e.push(l[n]+m),e.push(l[n+1]+m),e.push(l[n+2]+m),e.push(l[n+2]+m);for(n=0;f>n;n++)d.push(c[2*n],c[2*n+1],i,j,k,h)}};
},{"../../core/globals":26,"../../geom/Point":58,"../../geom/matrix":61,"../../primitives/Graphics":70,"../../utils/Polyk":88,"../../utils/color":90,"./shaders":82}],82:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var globals=require("../../core/globals"),PrimitiveShader=require("./PrimitiveShader"),StripShader=require("./StripShader"),PixiShader=require("./PixiShader");exports.initDefaultShaders=function(){globals.primitiveShader=new PrimitiveShader,globals.primitiveShader.init(),globals.stripShader=new StripShader,globals.stripShader.init(),globals.defaultShader=new PixiShader,globals.defaultShader.init();var a=globals.gl,b=globals.defaultShader.program;a.useProgram(b),a.enableVertexAttribArray(globals.defaultShader.aVertexPosition),a.enableVertexAttribArray(globals.defaultShader.colorAttribute),a.enableVertexAttribArray(globals.defaultShader.aTextureCoord)},exports.activatePrimitiveShader=function(){var a=globals.gl;a.useProgram(globals.primitiveShader.program),a.disableVertexAttribArray(globals.defaultShader.aVertexPosition),a.disableVertexAttribArray(globals.defaultShader.colorAttribute),a.disableVertexAttribArray(globals.defaultShader.aTextureCoord),a.enableVertexAttribArray(globals.primitiveShader.aVertexPosition),a.enableVertexAttribArray(globals.primitiveShader.colorAttribute)},exports.deactivatePrimitiveShader=function(){var a=globals.gl;a.useProgram(globals.defaultShader.program),a.disableVertexAttribArray(globals.primitiveShader.aVertexPosition),a.disableVertexAttribArray(globals.primitiveShader.colorAttribute),a.enableVertexAttribArray(globals.defaultShader.aVertexPosition),a.enableVertexAttribArray(globals.defaultShader.colorAttribute),a.enableVertexAttribArray(globals.defaultShader.aTextureCoord)},exports.activateStripShader=function(){var a=globals.gl;a.useProgram(globals.stripShader.program)},exports.deactivateStripShader=function(){var a=globals.gl;a.useProgram(globals.defaultShader.program)};
},{"../../core/globals":26,"./PixiShader":73,"./PrimitiveShader":74,"./StripShader":75}],83:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BitmapText(a,b){DisplayObjectContainer.call(this),this.setText(a),this.setStyle(b),this.updateText(),this.dirty=!1}var DisplayObjectContainer=require("../display/DisplayObjectContainer"),Sprite=require("../display/Sprite"),Point=require("../geom/Point"),proto=BitmapText.prototype=Object.create(DisplayObjectContainer.prototype,{constructor:{value:BitmapText}});proto.setText=function(a){this.text=a||" ",this.dirty=!0},proto.setStyle=function(a){a=a||{},a.align=a.align||"left",this.style=a;var b=a.font.split(" ");this.fontName=b[b.length-1],this.fontSize=b.length>=2?parseInt(b[b.length-2],10):BitmapText.fonts[this.fontName].size,this.dirty=!0},proto.updateText=function(){for(var a=BitmapText.fonts[this.fontName],b=new Point,c=null,d=[],e=0,f=[],g=0,h=this.fontSize/a.size,i=0;i<this.text.length;i++){var j=this.text.charCodeAt(i);if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))f.push(b.x),e=Math.max(e,b.x),g++,b.x=0,b.y+=a.lineHeight,c=null;else{var k=a.chars[j];k&&(c&&k[c]&&(b.x+=k.kerning[c]),d.push({texture:k.texture,line:g,charCode:j,position:new Point(b.x+k.xOffset,b.y+k.yOffset)}),b.x+=k.xAdvance,c=j)}}f.push(b.x),e=Math.max(e,b.x);var l=[];for(i=0;g>=i;i++){var m=0;"right"===this.style.align?m=e-f[i]:"center"===this.style.align&&(m=(e-f[i])/2),l.push(m)}for(i=0;i<d.length;i++){var n=new Sprite(d[i].texture);n.position.x=(d[i].position.x+l[d[i].line])*h,n.position.y=d[i].position.y*h,n.scale.x=n.scale.y=h,this.addChild(n)}this.width=e*h,this.height=(b.y+a.lineHeight)*h},proto.updateTransform=function(){if(this.dirty){for(;this.children.length>0;)this.removeChild(this.getChildAt(0));this.updateText(),this.dirty=!1}DisplayObjectContainer.prototype.updateTransform.call(this)},BitmapText.fonts={},module.exports=BitmapText;
},{"../display/DisplayObjectContainer":28,"../display/Sprite":30,"../geom/Point":58}],84:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Text(a,b){this.canvas=platform.createCanvas(),this.context=this.canvas.getContext("2d"),Sprite.call(this,Texture.fromCanvas(this.canvas)),this.setText(a),this.setStyle(b),this.updateText(),this.dirty=!1}var platform=require("../platform"),globals=require("../core/globals"),Point=require("../geom/Point"),Sprite=require("../display/Sprite"),Texture=require("../textures/Texture"),proto=Text.prototype=Object.create(Sprite.prototype,{constructor:{value:Text}});proto.setStyle=function(a){a=a||{},a.font=a.font||"bold 20pt Arial",a.fill=a.fill||"black",a.align=a.align||"left",a.stroke=a.stroke||"black",a.strokeThickness=a.strokeThickness||0,a.wordWrap=a.wordWrap||!1,a.wordWrapWidth=a.wordWrapWidth||100,this.style=a,this.dirty=!0},proto.setText=function(a){this.text=a.toString()||" ",this.dirty=!0},proto.updateText=function(){this.context.font=this.style.font;var a=this.text;this.style.wordWrap&&(a=this.wordWrap(this.text));for(var b=a.split(/(?:\r\n|\r|\n)/),c=[],d=0,e=0;e<b.length;e++){var f=this.context.measureText(b[e]).width;c[e]=f,d=Math.max(d,f)}this.canvas.width=d+this.style.strokeThickness;var g=this.determineFontHeight("font: "+this.style.font+";")+this.style.strokeThickness;for(this.canvas.height=g*b.length,this.context.fillStyle=this.style.fill,this.context.font=this.style.font,this.context.strokeStyle=this.style.stroke,this.context.lineWidth=this.style.strokeThickness,this.context.textBaseline="top",e=0;e<b.length;e++){var h=new Point(this.style.strokeThickness/2,this.style.strokeThickness/2+e*g);"right"===this.style.align?h.x+=d-c[e]:"center"===this.style.align&&(h.x+=(d-c[e])/2),this.style.stroke&&this.style.strokeThickness&&this.context.strokeText(b[e],h.x,h.y),this.style.fill&&this.context.fillText(b[e],h.x,h.y)}this.updateTexture()},proto.updateTexture=function(){this.texture.baseTexture.width=this.canvas.width,this.texture.baseTexture.height=this.canvas.height,this.texture.frame.width=this.canvas.width,this.texture.frame.height=this.canvas.height,this._width=this.canvas.width,this._height=this.canvas.height,globals.texturesToUpdate.push(this.texture.baseTexture)},proto.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),Sprite.prototype.updateTransform.call(this)},proto.determineFontHeight=function(a){var b=Text.heightCache[a];if(!b){var c=platform.document.getElementsByTagName("body")[0],d=platform.document.createElement("div"),e=platform.document.createTextNode("M");d.appendChild(e),d.setAttribute("style",a+";position:absolute;top:0;left:0"),c.appendChild(d),b=d.offsetHeight,Text.heightCache[a]=b,c.removeChild(d)}return b},proto.wordWrap=function(a){for(var b="",c=a.split("\n"),d=0;d<c.length;d++){for(var e=this.style.wordWrapWidth,f=c[d].split(" "),g=0;g<f.length;g++){var h=this.context.measureText(f[g]).width,i=h+this.context.measureText(" ").width;i>e?(g>0&&(b+="\n"),b+=f[g]+" ",e=this.style.wordWrapWidth-h):(e-=i,b+=f[g]+" ")}b+="\n"}return b},proto.destroy=function(a){a&&this.texture.destroy()},Text.heightCache={},module.exports=Text;
},{"../core/globals":26,"../display/Sprite":30,"../geom/Point":58,"../platform":69,"../textures/Texture":87}],85:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function BaseTexture(a,b){if(EventTarget.call(this),this.width=100,this.height=100,this.scaleMode=b||BaseTexture.SCALE_MODE.DEFAULT,this.hasLoaded=!1,this.source=a,a){if("complete"in this.source)if(this.source.complete)this.hasLoaded=!0,this.width=this.source.width,this.height=this.source.height,globals.texturesToUpdate.push(this);else{var c=this;this.source.onload=function(){c.hasLoaded=!0,c.width=c.source.width,c.height=c.source.height,globals.texturesToUpdate.push(c),c.dispatchEvent({type:"loaded",content:c})}}else this.hasLoaded=!0,this.width=this.source.width,this.height=this.source.height,globals.texturesToUpdate.push(this);this.imageUrl=null,this._powerOf2=!1}}var platform=require("../platform"),globals=require("../core/globals"),EventTarget=require("../events/EventTarget"),baseTextureCache={},proto=BaseTexture.prototype;proto.destroy=function(){this.source.src&&(this.imageUrl in baseTextureCache&&delete baseTextureCache[this.imageUrl],this.imageUrl=null,this.source.src=null),this.source=null,globals.texturesToDestroy.push(this)},proto.updateSourceImage=function(a){this.hasLoaded=!1,this.source.src=null,this.source.src=a},BaseTexture.fromImage=function(a,b,c){var d=baseTextureCache[a];if(!d){var e=new platform.createImage;b&&(e.crossOrigin=""),e.src=a,d=new BaseTexture(e,c),d.imageUrl=a,baseTextureCache[a]=d}return d},BaseTexture.SCALE_MODE={DEFAULT:0,LINEAR:0,NEAREST:1},module.exports=BaseTexture;
},{"../core/globals":26,"../events/EventTarget":33,"../platform":69}],86:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function RenderTexture(a,b){EventTarget.call(this),this.width=a||100,this.height=b||100,this.identityMatrix=mat3.create(),this.frame=new Rectangle(0,0,this.width,this.height),globals.gl?this.initWebGL():this.initCanvas()}var globals=require("../core/globals"),mat3=require("../geom/matrix").mat3,Texture=require("./Texture"),BaseTexture=require("./BaseTexture"),Point=require("../geom/Point"),Rectangle=require("../geom/Rectangle"),EventTarget=require("../events/EventTarget"),CanvasRenderer=require("../renderers/canvas/CanvasRenderer"),WebGLRenderGroup=require("../renderers/webgl/WebGLRenderGroup"),proto=RenderTexture.prototype=Object.create(Texture.prototype,{constructor:{value:RenderTexture}});proto.initWebGL=function(){var a=globals.gl;this.glFramebuffer=a.createFramebuffer(),a.bindFramebuffer(a.FRAMEBUFFER,this.glFramebuffer),this.glFramebuffer.width=this.width,this.glFramebuffer.height=this.height,this.baseTexture=new BaseTexture,this.baseTexture.width=this.width,this.baseTexture.height=this.height,this.baseTexture._glTexture=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.baseTexture._glTexture),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,this.width,this.height,0,a.RGBA,a.UNSIGNED_BYTE,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this.baseTexture.isRender=!0,a.bindFramebuffer(a.FRAMEBUFFER,this.glFramebuffer),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.baseTexture._glTexture,0),this.projection=new Point(this.width/2,-this.height/2),this.render=this.renderWebGL},proto.resize=function(a,b){if(this.width=a,this.height=b,globals.gl){this.projection.x=this.width/2,this.projection.y=-this.height/2;var c=globals.gl;c.bindTexture(c.TEXTURE_2D,this.baseTexture._glTexture),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,this.width,this.height,0,c.RGBA,c.UNSIGNED_BYTE,null)}else this.frame.width=this.width,this.frame.height=this.height,this.renderer.resize(this.width,this.height)},proto.initCanvas=function(){this.renderer=new CanvasRenderer(this.width,this.height,null,0),this.baseTexture=new BaseTexture(this.renderer.view),this.frame=new Rectangle(0,0,this.width,this.height),this.render=this.renderCanvas},proto.renderWebGL=function(a,b,c){var d=globals.gl;d.colorMask(!0,!0,!0,!0),d.viewport(0,0,this.width,this.height),d.bindFramebuffer(d.FRAMEBUFFER,this.glFramebuffer),c&&(d.clearColor(0,0,0,0),d.clear(d.COLOR_BUFFER_BIT));var e=a.children,f=a.worldTransform;a.worldTransform=mat3.create(),a.worldTransform[4]=-1,a.worldTransform[5]=-2*this.projection.y,b&&(a.worldTransform[2]=b.x,a.worldTransform[5]-=b.y),globals.visibleCount++,a.vcount=globals.visibleCount;for(var g=0,h=e.length;h>g;g++)e[g].updateTransform();var i=a.__renderGroup;i?a===i.root?i.render(this.projection,this.glFramebuffer):i.renderSpecific(a,this.projection,this.glFramebuffer):(this.renderGroup||(this.renderGroup=new WebGLRenderGroup(d)),this.renderGroup.setRenderable(a),this.renderGroup.render(this.projection,this.glFramebuffer)),a.worldTransform=f},proto.renderCanvas=function(a,b,c){var d=a.children;a.worldTransform=mat3.create(),b&&(a.worldTransform[2]=b.x,a.worldTransform[5]=b.y);for(var e=0,f=d.length;f>e;e++)d[e].updateTransform();c&&this.renderer.context.clearRect(0,0,this.width,this.height),this.renderer.renderDisplayObject(a),this.renderer.context.setTransform(1,0,0,1,0,0)},module.exports=RenderTexture;
},{"../core/globals":26,"../events/EventTarget":33,"../geom/Point":58,"../geom/Rectangle":60,"../geom/matrix":61,"../renderers/canvas/CanvasRenderer":71,"../renderers/webgl/WebGLRenderGroup":78,"./BaseTexture":85,"./Texture":87}],87:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function Texture(a,b){if(EventTarget.call(this),b||(this.noFrame=!0,b=new Rectangle(0,0,1,1)),a instanceof Texture&&(a=a.baseTexture),this.baseTexture=a,this.frame=b,this.trim=new Point,this.scope=this,a.hasLoaded)this.noFrame&&(b=new Rectangle(0,0,a.width,a.height)),this.setFrame(b);else{var c=this;a.addEventListener("loaded",function(){c.onBaseTextureLoaded()})}}var BaseTexture=require("./BaseTexture"),Point=require("../geom/Point"),Rectangle=require("../geom/Rectangle"),EventTarget=require("../events/EventTarget"),proto=Texture.prototype;proto.onBaseTextureLoaded=function(){var a=this.baseTexture;a.removeEventListener("loaded",this.onLoaded),this.noFrame&&(this.frame=new Rectangle(0,0,a.width,a.height)),this.noFrame=!1,this.width=this.frame.width,this.height=this.frame.height,this.scope.dispatchEvent({type:"update",content:this})},proto.destroy=function(a){a&&this.baseTexture.destroy()},proto.setFrame=function(a){if(this.frame=a,this.width=a.width,this.height=a.height,a.x+a.width>this.baseTexture.width||a.y+a.height>this.baseTexture.height)throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);this.updateFrame=!0,Texture.frameUpdates.push(this)},Texture.fromImage=function(a,b,c){var d=Texture.cache[a];return d||(d=new Texture(BaseTexture.fromImage(a,b,c)),Texture.cache[a]=d),d},Texture.fromFrame=function(a){var b=Texture.cache[a];if(!b)throw new Error('The frameId "'+a+'" does not exist in the texture cache '+this);return b},Texture.fromCanvas=function(a,b){var c=new BaseTexture(a,b);return new Texture(c)},Texture.addTextureToCache=function(a,b){Texture.cache[b]=a},Texture.removeTextureFromCache=function(a){var b=Texture.cache[a];return Texture.cache[a]=null,b},Texture.cache={},Texture.frameUpdates=[],Texture.SCALE_MODE=BaseTexture.SCALE_MODE,module.exports=Texture;
},{"../events/EventTarget":33,"../geom/Point":58,"../geom/Rectangle":60,"./BaseTexture":85}],88:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function pointInTriangle(a,b,c,d,e,f,g,h){var i=g-c,j=h-d,k=e-c,l=f-d,m=a-c,n=b-d,o=i*i+j*j,p=i*k+j*l,q=i*m+j*n,r=k*k+l*l,s=k*m+l*n,t=1/(o*r-p*p),u=(r*q-p*s)*t,v=(o*s-p*q)*t;return u>=0&&v>=0&&1>u+v}function convex(a,b,c,d,e,f,g){return(b-d)*(e-c)+(c-a)*(f-d)>=0===g}var platform=require("../platform");exports.triangulate=function(a){var b=!0,c=a.length>>1;if(3>c)return[];for(var d=[],e=[],f=0;c>f;f++)e.push(f);f=0;for(var g=c;g>3;){var h=e[(f+0)%g],i=e[(f+1)%g],j=e[(f+2)%g],k=a[2*h],l=a[2*h+1],m=a[2*i],n=a[2*i+1],o=a[2*j],p=a[2*j+1],q=!1;if(convex(k,l,m,n,o,p,b)){q=!0;for(var r=0;g>r;r++){var s=e[r];if(s!==h&&s!==i&&s!==j&&pointInTriangle(a[2*s],a[2*s+1],k,l,m,n,o,p)){q=!1;break}}}if(q)d.push(h,i,j),e.splice((f+1)%g,1),g--,f=0;else if(f++>3*g){if(!b)return platform.console.warn("PIXI Warning: shape too complex to fill"),[];for(d=[],e=[],f=0;c>f;f++)e.push(f);f=0,g=c,b=!1}}return d.push(e[0],e[1],e[2]),d};
},{"../platform":69}],89:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var platform=require("../platform"),CanvasRenderer=require("../renderers/canvas/CanvasRenderer"),WebGLRenderer=require("../renderers/webgl/WebGLRenderer");module.exports=function(a,b,c,d,e){a||(a=800),b||(b=600);var f=function(){try{var a=platform.createCanvas();return!!platform.window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}();if(f&&platform.navigator){var g=-1!==platform.navigator.userAgent.toLowerCase().indexOf("trident");f=!g}return f?new WebGLRenderer(a,b,c,d,e):new CanvasRenderer(a,b,c,d)};
},{"../platform":69,"../renderers/canvas/CanvasRenderer":71,"../renderers/webgl/WebGLRenderer":79}],90:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";exports.hex2rgb=function(a){return[(a>>16&255)/255,(a>>8&255)/255,(255&a)/255]};
},{}],91:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";function logGroup(a){var b=platform.console;b.groupCollapsed?b.groupCollapsed(a):b.group?b.group(a):b.log(a+" >>>>>>>>>")}function logGroupEnd(a){var b=platform.console;b.groupEnd?b.groupEnd(a):b.log(a+" _________")}var platform=require("../platform");exports.runList=function(a,b){var c=0,d=a.first;for(b="pixi.runList"+(b?"("+b+")":""),logGroup(b),platform.console.log(d);d._iNext;)if(c++,d=d._iNext,platform.console.log(d),c>100){platform.console.log("BREAK");break}logGroupEnd(b)};
},{"../platform":69}],92:[function(require,module,exports){
/**
 * pixi 0.2.1 (6aa0030)
 * http://drkibitz.github.io/node-pixi/
 * Copyright (c) 2013-2014 Dr. Kibitz, http://drkibitz.com
 * Super fast 2D rendering engine for browserify, that uses WebGL with a context 2d fallback.
 * built: Sun Jan 05 2014 01:53:58 GMT-0500 (EST)
 *
 * Pixi.js - v1.3.0
 * Copyright (c) 2012, Mat Groves
 */
"use strict";var spine=module.exports={};spine.BoneData=function(a,b){this.name=a,this.parent=b},spine.BoneData.prototype={length:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1},spine.SlotData=function(a,b){this.name=a,this.boneData=b},spine.SlotData.prototype={r:1,g:1,b:1,a:1,attachmentName:null},spine.Bone=function(a,b){this.data=a,this.parent=b,this.setToSetupPose()},spine.Bone.yDown=!1,spine.Bone.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,m00:0,m01:0,worldX:0,m10:0,m11:0,worldY:0,worldRotation:0,worldScaleX:1,worldScaleY:1,updateWorldTransform:function(a,b){var c=this.parent;null!=c?(this.worldX=this.x*c.m00+this.y*c.m01+c.worldX,this.worldY=this.x*c.m10+this.y*c.m11+c.worldY,this.worldScaleX=c.worldScaleX*this.scaleX,this.worldScaleY=c.worldScaleY*this.scaleY,this.worldRotation=c.worldRotation+this.rotation):(this.worldX=this.x,this.worldY=this.y,this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY,this.worldRotation=this.rotation);var d=this.worldRotation*Math.PI/180,e=Math.cos(d),f=Math.sin(d);this.m00=e*this.worldScaleX,this.m10=f*this.worldScaleX,this.m01=-f*this.worldScaleY,this.m11=e*this.worldScaleY,a&&(this.m00=-this.m00,this.m01=-this.m01),b&&(this.m10=-this.m10,this.m11=-this.m11),spine.Bone.yDown&&(this.m10=-this.m10,this.m11=-this.m11)},setToSetupPose:function(){var a=this.data;this.x=a.x,this.y=a.y,this.rotation=a.rotation,this.scaleX=a.scaleX,this.scaleY=a.scaleY}},spine.Slot=function(a,b,c){this.data=a,this.skeleton=b,this.bone=c,this.setToSetupPose()},spine.Slot.prototype={r:1,g:1,b:1,a:1,_attachmentTime:0,attachment:null,setAttachment:function(a){this.attachment=a,this._attachmentTime=this.skeleton.time},setAttachmentTime:function(a){this._attachmentTime=this.skeleton.time-a},getAttachmentTime:function(){return this.skeleton.time-this._attachmentTime},setToSetupPose:function(){var a=this.data;this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a;for(var b=this.skeleton.data.slots,c=0,d=b.length;d>c;c++)if(b[c]==a){this.setAttachment(a.attachmentName?this.skeleton.getAttachmentBySlotIndex(c,a.attachmentName):null);break}}},spine.Skin=function(a){this.name=a,this.attachments={}},spine.Skin.prototype={addAttachment:function(a,b,c){this.attachments[a+":"+b]=c},getAttachment:function(a,b){return this.attachments[a+":"+b]},_attachAll:function(a,b){for(var c in b.attachments){var d=c.indexOf(":"),e=parseInt(c.substring(0,d),10),f=c.substring(d+1),g=a.slots[e];if(g.attachment&&g.attachment.name==f){var h=this.getAttachment(e,f);h&&g.setAttachment(h)}}}},spine.Animation=function(a,b,c){this.name=a,this.timelines=b,this.duration=c},spine.Animation.prototype={apply:function(a,b,c){c&&this.duration&&(b%=this.duration);for(var d=this.timelines,e=0,f=d.length;f>e;e++)d[e].apply(a,b,1)},mix:function(a,b,c,d){c&&this.duration&&(b%=this.duration);for(var e=this.timelines,f=0,g=e.length;g>f;f++)e[f].apply(a,b,d)}},spine.binarySearch=function(a,b,c){var d=0,e=Math.floor(a.length/c)-2;if(!e)return c;for(var f=e>>>1;;){if(a[(f+1)*c]<=b?d=f+1:e=f,d==e)return(d+1)*c;f=d+e>>>1}},spine.linearSearch=function(a,b,c){for(var d=0,e=a.length-c;e>=d;d+=c)if(a[d]>b)return d;return-1},spine.Curves=function(a){this.curves=[],this.curves.length=6*(a-1)},spine.Curves.prototype={setLinear:function(a){this.curves[6*a]=0},setStepped:function(a){this.curves[6*a]=-1},setCurve:function(a,b,c,d,e){var f=.1,g=f*f,h=g*f,i=3*f,j=3*g,k=6*g,l=6*h,m=2*-b+d,n=2*-c+e,o=3*(b-d)+1,p=3*(c-e)+1,q=6*a,r=this.curves;r[q]=b*i+m*j+o*h,r[q+1]=c*i+n*j+p*h,r[q+2]=m*k+o*l,r[q+3]=n*k+p*l,r[q+4]=o*l,r[q+5]=p*l},getCurvePercent:function(a,b){b=0>b?0:b>1?1:b;var c=6*a,d=this.curves,e=d[c];if(!e)return b;if(-1==e)return 0;for(var f=d[c+1],g=d[c+2],h=d[c+3],i=d[c+4],j=d[c+5],k=e,l=f,m=8;;){if(k>=b){var n=k-e,o=l-f;return o+(l-o)*(b-n)/(k-n)}if(!m)break;m--,e+=g,f+=h,g+=i,h+=j,k+=e,l+=f}return l+(1-l)*(b-k)/(1-k)}},spine.RotateTimeline=function(a){this.curves=new spine.Curves(a),this.frames=[],this.frames.length=2*a},spine.RotateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c){a*=2,this.frames[a]=b,this.frames[a+1]=c},apply:function(a,b,c){var d,e=this.frames;if(!(b<e[0])){var f=a.bones[this.boneIndex];if(b>=e[e.length-2]){for(d=f.data.rotation+e[e.length-1]-f.rotation;d>180;)d-=360;for(;-180>d;)d+=360;return f.rotation+=d*c,void 0}var g=spine.binarySearch(e,b,2),h=e[g-1],i=e[g],j=1-(b-i)/(e[g-2]-i);for(j=this.curves.getCurvePercent(g/2-1,j),d=e[g+1]-h;d>180;)d-=360;for(;-180>d;)d+=360;for(d=f.data.rotation+(h+d*j)-f.rotation;d>180;)d-=360;for(;-180>d;)d+=360;f.rotation+=d*c}}},spine.TranslateTimeline=function(a){this.curves=new spine.Curves(a),this.frames=[],this.frames.length=3*a},spine.TranslateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.x+=(e.data.x+d[d.length-2]-e.x)*c,e.y+=(e.data.y+d[d.length-1]-e.y)*c,void 0;var f=spine.binarySearch(d,b,3),g=d[f-2],h=d[f-1],i=d[f],j=1-(b-i)/(d[f+-3]-i);j=this.curves.getCurvePercent(f/3-1,j),e.x+=(e.data.x+g+(d[f+1]-g)*j-e.x)*c,e.y+=(e.data.y+h+(d[f+2]-h)*j-e.y)*c}}},spine.ScaleTimeline=function(a){this.curves=new spine.Curves(a),this.frames=[],this.frames.length=3*a},spine.ScaleTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.scaleX+=(e.data.scaleX-1+d[d.length-2]-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+d[d.length-1]-e.scaleY)*c,void 0;var f=spine.binarySearch(d,b,3),g=d[f-2],h=d[f-1],i=d[f],j=1-(b-i)/(d[f+-3]-i);j=this.curves.getCurvePercent(f/3-1,j),e.scaleX+=(e.data.scaleX-1+g+(d[f+1]-g)*j-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+h+(d[f+2]-h)*j-e.scaleY)*c}}},spine.ColorTimeline=function(a){this.curves=new spine.Curves(a),this.frames=[],this.frames.length=5*a},spine.ColorTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c,d,e,f){a*=5,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d,this.frames[a+3]=e,this.frames[a+4]=f},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.slots[this.slotIndex];if(b>=d[d.length-5]){var f=d.length-1;return e.r=d[f-3],e.g=d[f-2],e.b=d[f-1],e.a=d[f],void 0}var g=spine.binarySearch(d,b,5),h=d[g-4],i=d[g-3],j=d[g-2],k=d[g-1],l=d[g],m=1-(b-l)/(d[g-5]-l);m=this.curves.getCurvePercent(g/5-1,m);var n=h+(d[g+1]-h)*m,o=i+(d[g+2]-i)*m,p=j+(d[g+3]-j)*m,q=k+(d[g+4]-k)*m;1>c?(e.r+=(n-e.r)*c,e.g+=(o-e.g)*c,e.b+=(p-e.b)*c,e.a+=(q-e.a)*c):(e.r=n,e.g=o,e.b=p,e.a=q)}}},spine.AttachmentTimeline=function(a){this.curves=new spine.Curves(a),this.frames=[],this.frames.length=a,this.attachmentNames=[],this.attachmentNames.length=a},spine.AttachmentTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b,this.attachmentNames[a]=c},apply:function(a,b){var c=this.frames;if(!(b<c[0])){var d;d=b>=c[c.length-1]?c.length-1:spine.binarySearch(c,b,1)-1;var e=this.attachmentNames[d];a.slots[this.slotIndex].setAttachment(e?a.getAttachmentBySlotIndex(this.slotIndex,e):null)}}},spine.SkeletonData=function(){this.bones=[],this.slots=[],this.skins=[],this.animations=[]},spine.SkeletonData.prototype={defaultSkin:null,findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSkin:function(a){for(var b=this.skins,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findAnimation:function(a){for(var b=this.animations,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null}},spine.Skeleton=function(a){this.data=a,this.bones=[];for(var b=0,c=a.bones.length;c>b;b++){var d=a.bones[b],e=d.parent?this.bones[a.bones.indexOf(d.parent)]:null;this.bones.push(new spine.Bone(d,e))}for(this.slots=[],this.drawOrder=[],b=0,c=a.slots.length;c>b;b++){var f=a.slots[b],g=this.bones[a.bones.indexOf(f.boneData)],h=new spine.Slot(f,this,g);this.slots.push(h),this.drawOrder.push(h)}},spine.Skeleton.prototype={x:0,y:0,skin:null,r:1,g:1,b:1,a:1,time:0,flipX:!1,flipY:!1,updateWorldTransform:function(){for(var a=this.flipX,b=this.flipY,c=this.bones,d=0,e=c.length;e>d;d++)c[d].updateWorldTransform(a,b)},setToSetupPose:function(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()},setBonesToSetupPose:function(){for(var a=this.bones,b=0,c=a.length;c>b;b++)a[b].setToSetupPose()},setSlotsToSetupPose:function(){for(var a=this.slots,b=0,c=a.length;c>b;b++)a[b].setToSetupPose(b)},getRootBone:function(){return this.bones.length?this.bones[0]:null},findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},setSkinByName:function(a){var b=this.data.findSkin(a);if(!b)throw"Skin not found: "+a;this.setSkin(b)},setSkin:function(a){this.skin&&a&&a._attachAll(this,this.skin),this.skin=a},getAttachmentBySlotName:function(a,b){return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a),b)},getAttachmentBySlotIndex:function(a,b){if(this.skin){var c=this.skin.getAttachment(a,b);if(c)return c}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(a,b):null},setAttachment:function(a,b){for(var c=this.slots,d=0,e=c.size;e>d;d++){var f=c[d];if(f.data.name==a){var g=null;if(b&&(g=this.getAttachment(d,b),null==g))throw"Attachment not found: "+b+", for slot: "+a;return f.setAttachment(g),void 0}}throw"Slot not found: "+a},update:function(a){this.time+=a}},spine.AttachmentType={region:0},spine.RegionAttachment=function(){this.offset=[],this.offset.length=8,this.uvs=[],this.uvs.length=8},spine.RegionAttachment.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,width:0,height:0,rendererObject:null,regionOffsetX:0,regionOffsetY:0,regionWidth:0,regionHeight:0,regionOriginalWidth:0,regionOriginalHeight:0,setUVs:function(a,b,c,d,e){var f=this.uvs;e?(f[2]=a,f[3]=d,f[4]=a,f[5]=b,f[6]=c,f[7]=b,f[0]=c,f[1]=d):(f[0]=a,f[1]=d,f[2]=a,f[3]=b,f[4]=c,f[5]=b,f[6]=c,f[7]=d)},updateOffset:function(){var a=this.width/this.regionOriginalWidth*this.scaleX,b=this.height/this.regionOriginalHeight*this.scaleY,c=-this.width/2*this.scaleX+this.regionOffsetX*a,d=-this.height/2*this.scaleY+this.regionOffsetY*b,e=c+this.regionWidth*a,f=d+this.regionHeight*b,g=this.rotation*Math.PI/180,h=Math.cos(g),i=Math.sin(g),j=c*h+this.x,k=c*i,l=d*h+this.y,m=d*i,n=e*h+this.x,o=e*i,p=f*h+this.y,q=f*i,r=this.offset;r[0]=j-m,r[1]=l+k,r[2]=j-q,r[3]=p+k,r[4]=n-q,r[5]=p+o,r[6]=n-m,r[7]=l+o},computeVertices:function(a,b,c,d){a+=c.worldX,b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10,h=c.m11,i=this.offset;d[0]=i[0]*e+i[1]*f+a,d[1]=i[0]*g+i[1]*h+b,d[2]=i[2]*e+i[3]*f+a,d[3]=i[2]*g+i[3]*h+b,d[4]=i[4]*e+i[5]*f+a,d[5]=i[4]*g+i[5]*h+b,d[6]=i[6]*e+i[7]*f+a,d[7]=i[6]*g+i[7]*h+b}},spine.AnimationStateData=function(a){this.skeletonData=a,this.animationToMixTime={}},spine.AnimationStateData.prototype={defaultMix:0,setMixByName:function(a,b,c){var d=this.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;var e=this.skeletonData.findAnimation(b);if(!e)throw"Animation not found: "+b;this.setMix(d,e,c)},setMix:function(a,b,c){this.animationToMixTime[a.name+":"+b.name]=c},getMix:function(a,b){var c=this.animationToMixTime[a.name+":"+b.name];return c?c:this.defaultMix}},spine.AnimationState=function(a){this.data=a,this.queue=[]},spine.AnimationState.prototype={current:null,previous:null,currentTime:0,previousTime:0,currentLoop:!1,previousLoop:!1,mixTime:0,mixDuration:0,update:function(a){if(this.currentTime+=a,this.previousTime+=a,this.mixTime+=a,this.queue.length>0){var b=this.queue[0];this.currentTime>=b.delay&&(this._setAnimation(b.animation,b.loop),this.queue.shift())}},apply:function(a){if(this.current)if(this.previous){this.previous.apply(a,this.previousTime,this.previousLoop);var b=this.mixTime/this.mixDuration;b>=1&&(b=1,this.previous=null),this.current.mix(a,this.currentTime,this.currentLoop,b)}else this.current.apply(a,this.currentTime,this.currentLoop)},clearAnimation:function(){this.previous=null,this.current=null,this.queue.length=0},_setAnimation:function(a,b){this.previous=null,a&&this.current&&(this.mixDuration=this.data.getMix(this.current,a),this.mixDuration>0&&(this.mixTime=0,this.previous=this.current,this.previousTime=this.currentTime,this.previousLoop=this.currentLoop)),this.current=a,this.currentLoop=b,this.currentTime=0},setAnimationByName:function(a,b){var c=this.data.skeletonData.findAnimation(a);if(!c)throw"Animation not found: "+a;this.setAnimation(c,b)},setAnimation:function(a,b){this.queue.length=0,this._setAnimation(a,b)},addAnimationByName:function(a,b,c){var d=this.data.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;this.addAnimation(d,b,c)},addAnimation:function(a,b,c){var d={};if(d.animation=a,d.loop=b,!c||0>=c){var e=this.queue.length?this.queue[this.queue.length-1].animation:this.current;c=null!=e?e.duration-this.data.getMix(e,a)+(c||0):0}d.delay=c,this.queue.push(d)},isComplete:function(){return!this.current||this.currentTime>=this.current.duration}},spine.SkeletonJson=function(a){this.attachmentLoader=a},spine.SkeletonJson.prototype={scale:1,readSkeletonData:function(a){for(var b,c=new spine.SkeletonData,d=a.bones,e=0,f=d.length;f>e;e++){var g=d[e],h=null;if(g.parent&&(h=c.findBone(g.parent),!h))throw"Parent bone not found: "+g.parent;b=new spine.BoneData(g.name,h),b.length=(g.length||0)*this.scale,b.x=(g.x||0)*this.scale,b.y=(g.y||0)*this.scale,b.rotation=g.rotation||0,b.scaleX=g.scaleX||1,b.scaleY=g.scaleY||1,c.bones.push(b)}var i=a.slots;for(e=0,f=i.length;f>e;e++){var j=i[e];if(b=c.findBone(j.bone),!b)throw"Slot bone not found: "+j.bone;var k=new spine.SlotData(j.name,b),l=j.color;l&&(k.r=spine.SkeletonJson.toColor(l,0),k.g=spine.SkeletonJson.toColor(l,1),k.b=spine.SkeletonJson.toColor(l,2),k.a=spine.SkeletonJson.toColor(l,3)),k.attachmentName=j.attachment,c.slots.push(k)}var m=a.skins;for(var n in m)if(m.hasOwnProperty(n)){var o=m[n],p=new spine.Skin(n);for(var q in o)if(o.hasOwnProperty(q)){var r=c.findSlotIndex(q),s=o[q];for(var t in s)if(s.hasOwnProperty(t)){var u=this.readAttachment(p,t,s[t]);null!=u&&p.addAttachment(r,t,u)}}c.skins.push(p),"default"==p.name&&(c.defaultSkin=p)}var v=a.animations;for(var w in v)v.hasOwnProperty(w)&&this.readAnimation(w,v[w],c);return c},readAttachment:function(a,b,c){b=c.name||b;var d=spine.AttachmentType[c.type||"region"];if(d==spine.AttachmentType.region){var e=new spine.RegionAttachment;return e.x=(c.x||0)*this.scale,e.y=(c.y||0)*this.scale,e.scaleX=c.scaleX||1,e.scaleY=c.scaleY||1,e.rotation=c.rotation||0,e.width=(c.width||32)*this.scale,e.height=(c.height||32)*this.scale,e.updateOffset(),e.rendererObject={},e.rendererObject.name=b,e.rendererObject.scale={},e.rendererObject.scale.x=e.scaleX,e.rendererObject.scale.y=e.scaleY,e.rendererObject.rotation=-e.rotation*Math.PI/180,e}throw"Unknown attachment type: "+d},readAnimation:function(a,b,c){var d,e,f,g,h,i,j,k=[],l=0,m=b.bones;for(var n in m)if(m.hasOwnProperty(n)){var o=c.findBoneIndex(n);if(-1==o)throw"Bone not found: "+n;var p=m[n];for(f in p)if(p.hasOwnProperty(f))if(h=p[f],"rotate"==f){for(e=new spine.RotateTimeline(h.length),e.boneIndex=o,d=0,i=0,j=h.length;j>i;i++)g=h[i],e.setFrame(d,g.time,g.angle),spine.SkeletonJson.readCurve(e,d,g),d++;k.push(e),l=Math.max(l,e.frames[2*e.getFrameCount()-2])}else{if("translate"!=f&&"scale"!=f)throw"Invalid timeline type for a bone: "+f+" ("+n+")";var q=1;for("scale"==f?e=new spine.ScaleTimeline(h.length):(e=new spine.TranslateTimeline(h.length),q=this.scale),e.boneIndex=o,d=0,i=0,j=h.length;j>i;i++){g=h[i];var r=(g.x||0)*q,s=(g.y||0)*q;e.setFrame(d,g.time,r,s),spine.SkeletonJson.readCurve(e,d,g),d++}k.push(e),l=Math.max(l,e.frames[3*e.getFrameCount()-3])}}var t=b.slots;for(var u in t)if(t.hasOwnProperty(u)){var v=t[u],w=c.findSlotIndex(u);for(f in v)if(v.hasOwnProperty(f))if(h=v[f],"color"==f){for(e=new spine.ColorTimeline(h.length),e.slotIndex=w,d=0,i=0,j=h.length;j>i;i++){g=h[i];var x=g.color,y=spine.SkeletonJson.toColor(x,0),z=spine.SkeletonJson.toColor(x,1),A=spine.SkeletonJson.toColor(x,2),B=spine.SkeletonJson.toColor(x,3);e.setFrame(d,g.time,y,z,A,B),spine.SkeletonJson.readCurve(e,d,g),d++}k.push(e),l=Math.max(l,e.frames[5*e.getFrameCount()-5])}else{if("attachment"!=f)throw"Invalid timeline type for a slot: "+f+" ("+u+")";for(e=new spine.AttachmentTimeline(h.length),e.slotIndex=w,d=0,i=0,j=h.length;j>i;i++)g=h[i],e.setFrame(d++,g.time,g.name);k.push(e),l=Math.max(l,e.frames[e.getFrameCount()-1])}}c.animations.push(new spine.Animation(a,k,l))}},spine.SkeletonJson.readCurve=function(a,b,c){var d=c.curve;d&&("stepped"==d?a.curves.setStepped(b):d instanceof Array&&a.curves.setCurve(b,d[0],d[1],d[2],d[3]))},spine.SkeletonJson.toColor=function(a,b){if(8!=a.length)throw"Color hexidecimal length must be 8, recieved: "+a;return parseInt(a.substring(2*b,2),16)/255},spine.Atlas=function(a,b){this.textureLoader=b,this.pages=[],this.regions=[];var c=new spine.AtlasReader(a),d=[];d.length=4;for(var e=null;;){var f=c.readLine();if(null==f)break;if(f=c.trim(f),f.length)if(e){var g=new spine.AtlasRegion;g.name=f,g.page=e,g.rotate="true"==c.readValue(),c.readTuple(d);var h=parseInt(d[0],10),i=parseInt(d[1],10);c.readTuple(d);var j=parseInt(d[0],10),k=parseInt(d[1],10);g.u=h/e.width,g.v=i/e.height,g.rotate?(g.u2=(h+k)/e.width,g.v2=(i+j)/e.height):(g.u2=(h+j)/e.width,g.v2=(i+k)/e.height),g.x=h,g.y=i,g.width=Math.abs(j),g.height=Math.abs(k),4==c.readTuple(d)&&(g.splits=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],4==c.readTuple(d)&&(g.pads=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],c.readTuple(d))),g.originalWidth=parseInt(d[0],10),g.originalHeight=parseInt(d[1],10),c.readTuple(d),g.offsetX=parseInt(d[0],10),g.offsetY=parseInt(d[1],10),g.index=parseInt(c.readValue(),10),this.regions.push(g)}else{e=new spine.AtlasPage,e.name=f,e.format=spine.Atlas.Format[c.readValue()],c.readTuple(d),e.minFilter=spine.Atlas.TextureFilter[d[0]],e.magFilter=spine.Atlas.TextureFilter[d[1]];var l=c.readValue();e.uWrap=spine.Atlas.TextureWrap.clampToEdge,e.vWrap=spine.Atlas.TextureWrap.clampToEdge,"x"==l?e.uWrap=spine.Atlas.TextureWrap.repeat:"y"==l?e.vWrap=spine.Atlas.TextureWrap.repeat:"xy"==l&&(e.uWrap=e.vWrap=spine.Atlas.TextureWrap.repeat),b.load(e,f),this.pages.push(e)}else e=null}},spine.Atlas.prototype={findRegion:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},dispose:function(){for(var a=this.pages,b=0,c=a.length;c>b;b++)this.textureLoader.unload(a[b].rendererObject)},updateUVs:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++){var e=b[c];e.page==a&&(e.u=e.x/a.width,e.v=e.y/a.height,e.rotate?(e.u2=(e.x+e.height)/a.width,e.v2=(e.y+e.width)/a.height):(e.u2=(e.x+e.width)/a.width,e.v2=(e.y+e.height)/a.height))}}},spine.Atlas.Format={alpha:0,intensity:1,luminanceAlpha:2,rgb565:3,rgba4444:4,rgb888:5,rgba8888:6},spine.Atlas.TextureFilter={nearest:0,linear:1,mipMap:2,mipMapNearestNearest:3,mipMapLinearNearest:4,mipMapNearestLinear:5,mipMapLinearLinear:6},spine.Atlas.TextureWrap={mirroredRepeat:0,clampToEdge:1,repeat:2},spine.AtlasPage=function(){},spine.AtlasPage.prototype={name:null,format:null,minFilter:null,magFilter:null,uWrap:null,vWrap:null,rendererObject:null,width:0,height:0},spine.AtlasRegion=function(){},spine.AtlasRegion.prototype={page:null,name:null,x:0,y:0,width:0,height:0,u:0,v:0,u2:0,v2:0,offsetX:0,offsetY:0,originalWidth:0,originalHeight:0,index:0,rotate:!1,splits:null,pads:null},spine.AtlasReader=function(a){this.lines=a.split(/\r\n|\r|\n/)},spine.AtlasReader.prototype={index:0,trim:function(a){return a.replace(/^\s+|\s+$/g,"")},readLine:function(){return this.index>=this.lines.length?null:this.lines[this.index++]},readValue:function(){var a=this.readLine(),b=a.indexOf(":");if(-1==b)throw"Invalid line: "+a;return this.trim(a.substring(b+1))},readTuple:function(a){var b=this.readLine(),c=b.indexOf(":");if(-1==c)throw"Invalid line: "+b;for(var d=0,e=c+1;3>d;d++){var f=b.indexOf(",",e);if(-1==f){if(!d)throw"Invalid line: "+b;break}a[d]=this.trim(b.substr(e,f-e)),e=f+1}return a[d]=this.trim(b.substring(e)),d+1}},spine.AtlasAttachmentLoader=function(a){this.atlas=a},spine.AtlasAttachmentLoader.prototype={newAttachment:function(a,b,c){switch(b){case spine.AttachmentType.region:var d=this.atlas.findRegion(c);if(!d)throw"Region not found in atlas: "+c+" ("+b+")";var e=new spine.RegionAttachment(c);return e.rendererObject=d,e.setUVs(d.u,d.v,d.u2,d.v2,d.rotate),e.regionOffsetX=d.offsetX,e.regionOffsetY=d.offsetY,e.regionWidth=d.width,e.regionHeight=d.height,e.regionOriginalWidth=d.originalWidth,e.regionOriginalHeight=d.originalHeight,e}throw"Unknown attachment type: "+b}},spine.Bone.yDown=!0;
},{}],93:[function(require,module,exports){
/*! Socket.IO.js build:0.9.17, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

var io = ('undefined' === typeof module ? {} : module.exports);
(function() {

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * IO namespace.
   *
   * @namespace
   */

  var io = exports;

  /**
   * Socket.IO version
   *
   * @api public
   */

  io.version = '0.9.17';

  /**
   * Protocol implemented.
   *
   * @api public
   */

  io.protocol = 1;

  /**
   * Available transports, these will be populated with the available transports
   *
   * @api public
   */

  io.transports = [];

  /**
   * Keep track of jsonp callbacks.
   *
   * @api private
   */

  io.j = [];

  /**
   * Keep track of our io.Sockets
   *
   * @api private
   */
  io.sockets = {};


  /**
   * Manages connections to hosts.
   *
   * @param {String} uri
   * @Param {Boolean} force creation of new socket (defaults to false)
   * @api public
   */

  io.connect = function (host, details) {
    var uri = io.util.parseUri(host)
      , uuri
      , socket;

    if (global && global.location) {
      uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
      uri.host = uri.host || (global.document
        ? global.document.domain : global.location.hostname);
      uri.port = uri.port || global.location.port;
    }

    uuri = io.util.uniqueUri(uri);

    var options = {
        host: uri.host
      , secure: 'https' == uri.protocol
      , port: uri.port || ('https' == uri.protocol ? 443 : 80)
      , query: uri.query || ''
    };

    io.util.merge(options, details);

    if (options['force new connection'] || !io.sockets[uuri]) {
      socket = new io.Socket(options);
    }

    if (!options['force new connection'] && socket) {
      io.sockets[uuri] = socket;
    }

    socket = socket || io.sockets[uuri];

    // if path is different from '' or /
    return socket.of(uri.path.length > 1 ? uri.path : '');
  };

})('object' === typeof module ? module.exports : (this.io = {}), this);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * Utilities namespace.
   *
   * @namespace
   */

  var util = exports.util = {};

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api public
   */

  var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
               'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
               'anchor'];

  util.parseUri = function (str) {
    var m = re.exec(str || '')
      , uri = {}
      , i = 14;

    while (i--) {
      uri[parts[i]] = m[i] || '';
    }

    return uri;
  };

  /**
   * Produces a unique url that identifies a Socket.IO connection.
   *
   * @param {Object} uri
   * @api public
   */

  util.uniqueUri = function (uri) {
    var protocol = uri.protocol
      , host = uri.host
      , port = uri.port;

    if ('document' in global) {
      host = host || document.domain;
      port = port || (protocol == 'https'
        && document.location.protocol !== 'https:' ? 443 : document.location.port);
    } else {
      host = host || 'localhost';

      if (!port && protocol == 'https') {
        port = 443;
      }
    }

    return (protocol || 'http') + '://' + host + ':' + (port || 80);
  };

  /**
   * Mergest 2 query strings in to once unique query string
   *
   * @param {String} base
   * @param {String} addition
   * @api public
   */

  util.query = function (base, addition) {
    var query = util.chunkQuery(base || '')
      , components = [];

    util.merge(query, util.chunkQuery(addition || ''));
    for (var part in query) {
      if (query.hasOwnProperty(part)) {
        components.push(part + '=' + query[part]);
      }
    }

    return components.length ? '?' + components.join('&') : '';
  };

  /**
   * Transforms a querystring in to an object
   *
   * @param {String} qs
   * @api public
   */

  util.chunkQuery = function (qs) {
    var query = {}
      , params = qs.split('&')
      , i = 0
      , l = params.length
      , kv;

    for (; i < l; ++i) {
      kv = params[i].split('=');
      if (kv[0]) {
        query[kv[0]] = kv[1];
      }
    }

    return query;
  };

  /**
   * Executes the given function when the page is loaded.
   *
   *     io.util.load(function () { console.log('page loaded'); });
   *
   * @param {Function} fn
   * @api public
   */

  var pageLoaded = false;

  util.load = function (fn) {
    if ('document' in global && document.readyState === 'complete' || pageLoaded) {
      return fn();
    }

    util.on(global, 'load', fn, false);
  };

  /**
   * Adds an event.
   *
   * @api private
   */

  util.on = function (element, event, fn, capture) {
    if (element.attachEvent) {
      element.attachEvent('on' + event, fn);
    } else if (element.addEventListener) {
      element.addEventListener(event, fn, capture);
    }
  };

  /**
   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
   *
   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
   * @api private
   */

  util.request = function (xdomain) {

    if (xdomain && 'undefined' != typeof XDomainRequest && !util.ua.hasCORS) {
      return new XDomainRequest();
    }

    if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
      return new XMLHttpRequest();
    }

    if (!xdomain) {
      try {
        return new window[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
      } catch(e) { }
    }

    return null;
  };

  /**
   * XHR based transport constructor.
   *
   * @constructor
   * @api public
   */

  /**
   * Change the internal pageLoaded value.
   */

  if ('undefined' != typeof window) {
    util.load(function () {
      pageLoaded = true;
    });
  }

  /**
   * Defers a function to ensure a spinner is not displayed by the browser
   *
   * @param {Function} fn
   * @api public
   */

  util.defer = function (fn) {
    if (!util.ua.webkit || 'undefined' != typeof importScripts) {
      return fn();
    }

    util.load(function () {
      setTimeout(fn, 100);
    });
  };

  /**
   * Merges two objects.
   *
   * @api public
   */

  util.merge = function merge (target, additional, deep, lastseen) {
    var seen = lastseen || []
      , depth = typeof deep == 'undefined' ? 2 : deep
      , prop;

    for (prop in additional) {
      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
        if (typeof target[prop] !== 'object' || !depth) {
          target[prop] = additional[prop];
          seen.push(additional[prop]);
        } else {
          util.merge(target[prop], additional[prop], depth - 1, seen);
        }
      }
    }

    return target;
  };

  /**
   * Merges prototypes from objects
   *
   * @api public
   */

  util.mixin = function (ctor, ctor2) {
    util.merge(ctor.prototype, ctor2.prototype);
  };

  /**
   * Shortcut for prototypical and static inheritance.
   *
   * @api private
   */

  util.inherit = function (ctor, ctor2) {
    function f() {};
    f.prototype = ctor2.prototype;
    ctor.prototype = new f;
  };

  /**
   * Checks if the given object is an Array.
   *
   *     io.util.isArray([]); // true
   *     io.util.isArray({}); // false
   *
   * @param Object obj
   * @api public
   */

  util.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /**
   * Intersects values of two arrays into a third
   *
   * @api public
   */

  util.intersect = function (arr, arr2) {
    var ret = []
      , longest = arr.length > arr2.length ? arr : arr2
      , shortest = arr.length > arr2.length ? arr2 : arr;

    for (var i = 0, l = shortest.length; i < l; i++) {
      if (~util.indexOf(longest, shortest[i]))
        ret.push(shortest[i]);
    }

    return ret;
  };

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  util.indexOf = function (arr, o, i) {

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0;
         i < j && arr[i] !== o; i++) {}

    return j <= i ? -1 : i;
  };

  /**
   * Converts enumerables to array.
   *
   * @api public
   */

  util.toArray = function (enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
      arr.push(enu[i]);

    return arr;
  };

  /**
   * UA / engines detection namespace.
   *
   * @namespace
   */

  util.ua = {};

  /**
   * Whether the UA supports CORS for XHR.
   *
   * @api public
   */

  util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
    try {
      var a = new XMLHttpRequest();
    } catch (e) {
      return false;
    }

    return a.withCredentials != undefined;
  })();

  /**
   * Detect webkit.
   *
   * @api public
   */

  util.ua.webkit = 'undefined' != typeof navigator
    && /webkit/i.test(navigator.userAgent);

   /**
   * Detect iPad/iPhone/iPod.
   *
   * @api public
   */

  util.ua.iDevice = 'undefined' != typeof navigator
      && /iPad|iPhone|iPod/i.test(navigator.userAgent);

})('undefined' != typeof io ? io : module.exports, this);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.EventEmitter = EventEmitter;

  /**
   * Event emitter constructor.
   *
   * @api public.
   */

  function EventEmitter () {};

  /**
   * Adds a listener
   *
   * @api public
   */

  EventEmitter.prototype.on = function (name, fn) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = fn;
    } else if (io.util.isArray(this.$events[name])) {
      this.$events[name].push(fn);
    } else {
      this.$events[name] = [this.$events[name], fn];
    }

    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  /**
   * Adds a volatile listener.
   *
   * @api public
   */

  EventEmitter.prototype.once = function (name, fn) {
    var self = this;

    function on () {
      self.removeListener(name, on);
      fn.apply(this, arguments);
    };

    on.listener = fn;
    this.on(name, on);

    return this;
  };

  /**
   * Removes a listener.
   *
   * @api public
   */

  EventEmitter.prototype.removeListener = function (name, fn) {
    if (this.$events && this.$events[name]) {
      var list = this.$events[name];

      if (io.util.isArray(list)) {
        var pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
            pos = i;
            break;
          }
        }

        if (pos < 0) {
          return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
          delete this.$events[name];
        }
      } else if (list === fn || (list.listener && list.listener === fn)) {
        delete this.$events[name];
      }
    }

    return this;
  };

  /**
   * Removes all listeners for an event.
   *
   * @api public
   */

  EventEmitter.prototype.removeAllListeners = function (name) {
    if (name === undefined) {
      this.$events = {};
      return this;
    }

    if (this.$events && this.$events[name]) {
      this.$events[name] = null;
    }

    return this;
  };

  /**
   * Gets all listeners for a certain event.
   *
   * @api publci
   */

  EventEmitter.prototype.listeners = function (name) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = [];
    }

    if (!io.util.isArray(this.$events[name])) {
      this.$events[name] = [this.$events[name]];
    }

    return this.$events[name];
  };

  /**
   * Emits an event.
   *
   * @api public
   */

  EventEmitter.prototype.emit = function (name) {
    if (!this.$events) {
      return false;
    }

    var handler = this.$events[name];

    if (!handler) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    if ('function' == typeof handler) {
      handler.apply(this, args);
    } else if (io.util.isArray(handler)) {
      var listeners = handler.slice();

      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    } else {
      return false;
    }

    return true;
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Based on JSON2 (http://www.JSON.org/js.html).
 */

(function (exports, nativeJSON) {
  "use strict";

  // use native JSON if it's available
  if (nativeJSON && nativeJSON.parse){
    return exports.JSON = {
      parse: nativeJSON.parse
    , stringify: nativeJSON.stringify
    };
  }

  var JSON = exports.JSON = {};

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  function date(d, key) {
    return isFinite(d.valueOf()) ?
        d.getUTCFullYear()     + '-' +
        f(d.getUTCMonth() + 1) + '-' +
        f(d.getUTCDate())      + 'T' +
        f(d.getUTCHours())     + ':' +
        f(d.getUTCMinutes())   + ':' +
        f(d.getUTCSeconds())   + 'Z' : null;
  };

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {    // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
      },
      rep;


  function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

// Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

      if (value instanceof Date) {
          value = date(key);
      }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

// What happens next depends on the value's type.

      switch (typeof value) {
      case 'string':
          return quote(value);

      case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

          return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

      case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

          if (!value) {
              return 'null';
          }

// Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

// Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

              length = value.length;
              for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value) || 'null';
              }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

              v = partial.length === 0 ? '[]' : gap ?
                  '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                  '[' + partial.join(',') + ']';
              gap = mind;
              return v;
          }

// If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                  if (typeof rep[i] === 'string') {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          } else {

// Otherwise, iterate through all of the keys in the object.

              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

          v = partial.length === 0 ? '{}' : gap ?
              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
              '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
  }

// If the JSON object does not yet have a stringify method, give it one.

  JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

// If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
              (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

      return str('', {'': value});
  };

// If the JSON object does not yet have a parse method, give it one.

  JSON.parse = function (text, reviver) {
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.

          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                          value[k] = v;
                      } else {
                          delete value[k];
                      }
                  }
              }
          }
          return reviver.call(holder, key, value);
      }


  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
          text = text.replace(cx, function (a) {
              return '\\u' +
                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
      }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.

  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/
              .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.

          j = eval('(' + text + ')');

  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === 'function' ?
              walk({'': j}, '') : j;
      }

  // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
  };

})(
    'undefined' != typeof io ? io : module.exports
  , typeof JSON !== 'undefined' ? JSON : undefined
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Parser namespace.
   *
   * @namespace
   */

  var parser = exports.parser = {};

  /**
   * Packet types.
   */

  var packets = parser.packets = [
      'disconnect'
    , 'connect'
    , 'heartbeat'
    , 'message'
    , 'json'
    , 'event'
    , 'ack'
    , 'error'
    , 'noop'
  ];

  /**
   * Errors reasons.
   */

  var reasons = parser.reasons = [
      'transport not supported'
    , 'client not handshaken'
    , 'unauthorized'
  ];

  /**
   * Errors advice.
   */

  var advice = parser.advice = [
      'reconnect'
  ];

  /**
   * Shortcuts.
   */

  var JSON = io.JSON
    , indexOf = io.util.indexOf;

  /**
   * Encodes a packet.
   *
   * @api private
   */

  parser.encodePacket = function (packet) {
    var type = indexOf(packets, packet.type)
      , id = packet.id || ''
      , endpoint = packet.endpoint || ''
      , ack = packet.ack
      , data = null;

    switch (packet.type) {
      case 'error':
        var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
          , adv = packet.advice ? indexOf(advice, packet.advice) : '';

        if (reason !== '' || adv !== '')
          data = reason + (adv !== '' ? ('+' + adv) : '');

        break;

      case 'message':
        if (packet.data !== '')
          data = packet.data;
        break;

      case 'event':
        var ev = { name: packet.name };

        if (packet.args && packet.args.length) {
          ev.args = packet.args;
        }

        data = JSON.stringify(ev);
        break;

      case 'json':
        data = JSON.stringify(packet.data);
        break;

      case 'connect':
        if (packet.qs)
          data = packet.qs;
        break;

      case 'ack':
        data = packet.ackId
          + (packet.args && packet.args.length
              ? '+' + JSON.stringify(packet.args) : '');
        break;
    }

    // construct packet with required fragments
    var encoded = [
        type
      , id + (ack == 'data' ? '+' : '')
      , endpoint
    ];

    // data fragment is optional
    if (data !== null && data !== undefined)
      encoded.push(data);

    return encoded.join(':');
  };

  /**
   * Encodes multiple messages (payload).
   *
   * @param {Array} messages
   * @api private
   */

  parser.encodePayload = function (packets) {
    var decoded = '';

    if (packets.length == 1)
      return packets[0];

    for (var i = 0, l = packets.length; i < l; i++) {
      var packet = packets[i];
      decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
    }

    return decoded;
  };

  /**
   * Decodes a packet
   *
   * @api private
   */

  var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

  parser.decodePacket = function (data) {
    var pieces = data.match(regexp);

    if (!pieces) return {};

    var id = pieces[2] || ''
      , data = pieces[5] || ''
      , packet = {
            type: packets[pieces[1]]
          , endpoint: pieces[4] || ''
        };

    // whether we need to acknowledge the packet
    if (id) {
      packet.id = id;
      if (pieces[3])
        packet.ack = 'data';
      else
        packet.ack = true;
    }

    // handle different packet types
    switch (packet.type) {
      case 'error':
        var pieces = data.split('+');
        packet.reason = reasons[pieces[0]] || '';
        packet.advice = advice[pieces[1]] || '';
        break;

      case 'message':
        packet.data = data || '';
        break;

      case 'event':
        try {
          var opts = JSON.parse(data);
          packet.name = opts.name;
          packet.args = opts.args;
        } catch (e) { }

        packet.args = packet.args || [];
        break;

      case 'json':
        try {
          packet.data = JSON.parse(data);
        } catch (e) { }
        break;

      case 'connect':
        packet.qs = data || '';
        break;

      case 'ack':
        var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
        if (pieces) {
          packet.ackId = pieces[1];
          packet.args = [];

          if (pieces[3]) {
            try {
              packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
            } catch (e) { }
          }
        }
        break;

      case 'disconnect':
      case 'heartbeat':
        break;
    };

    return packet;
  };

  /**
   * Decodes data payload. Detects multiple messages
   *
   * @return {Array} messages
   * @api public
   */

  parser.decodePayload = function (data) {
    // IE doesn't like data[i] for unicode chars, charAt works fine
    if (data.charAt(0) == '\ufffd') {
      var ret = [];

      for (var i = 1, length = ''; i < data.length; i++) {
        if (data.charAt(i) == '\ufffd') {
          ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
          i += Number(length) + 1;
          length = '';
        } else {
          length += data.charAt(i);
        }
      }

      return ret;
    } else {
      return [parser.decodePacket(data)];
    }
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.Transport = Transport;

  /**
   * This is the transport template for all supported transport methods.
   *
   * @constructor
   * @api public
   */

  function Transport (socket, sessid) {
    this.socket = socket;
    this.sessid = sessid;
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Transport, io.EventEmitter);


  /**
   * Indicates whether heartbeats is enabled for this transport
   *
   * @api private
   */

  Transport.prototype.heartbeats = function () {
    return true;
  };

  /**
   * Handles the response from the server. When a new response is received
   * it will automatically update the timeout, decode the message and
   * forwards the response to the onMessage function for further processing.
   *
   * @param {String} data Response from the server.
   * @api private
   */

  Transport.prototype.onData = function (data) {
    this.clearCloseTimeout();

    // If the connection in currently open (or in a reopening state) reset the close
    // timeout since we have just received data. This check is necessary so
    // that we don't reset the timeout on an explicitly disconnected connection.
    if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
      this.setCloseTimeout();
    }

    if (data !== '') {
      // todo: we should only do decodePayload for xhr transports
      var msgs = io.parser.decodePayload(data);

      if (msgs && msgs.length) {
        for (var i = 0, l = msgs.length; i < l; i++) {
          this.onPacket(msgs[i]);
        }
      }
    }

    return this;
  };

  /**
   * Handles packets.
   *
   * @api private
   */

  Transport.prototype.onPacket = function (packet) {
    this.socket.setHeartbeatTimeout();

    if (packet.type == 'heartbeat') {
      return this.onHeartbeat();
    }

    if (packet.type == 'connect' && packet.endpoint == '') {
      this.onConnect();
    }

    if (packet.type == 'error' && packet.advice == 'reconnect') {
      this.isOpen = false;
    }

    this.socket.onPacket(packet);

    return this;
  };

  /**
   * Sets close timeout
   *
   * @api private
   */

  Transport.prototype.setCloseTimeout = function () {
    if (!this.closeTimeout) {
      var self = this;

      this.closeTimeout = setTimeout(function () {
        self.onDisconnect();
      }, this.socket.closeTimeout);
    }
  };

  /**
   * Called when transport disconnects.
   *
   * @api private
   */

  Transport.prototype.onDisconnect = function () {
    if (this.isOpen) this.close();
    this.clearTimeouts();
    this.socket.onDisconnect();
    return this;
  };

  /**
   * Called when transport connects
   *
   * @api private
   */

  Transport.prototype.onConnect = function () {
    this.socket.onConnect();
    return this;
  };

  /**
   * Clears close timeout
   *
   * @api private
   */

  Transport.prototype.clearCloseTimeout = function () {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  /**
   * Clear timeouts
   *
   * @api private
   */

  Transport.prototype.clearTimeouts = function () {
    this.clearCloseTimeout();

    if (this.reopenTimeout) {
      clearTimeout(this.reopenTimeout);
    }
  };

  /**
   * Sends a packet
   *
   * @param {Object} packet object.
   * @api private
   */

  Transport.prototype.packet = function (packet) {
    this.send(io.parser.encodePacket(packet));
  };

  /**
   * Send the received heartbeat message back to server. So the server
   * knows we are still connected.
   *
   * @param {String} heartbeat Heartbeat response from the server.
   * @api private
   */

  Transport.prototype.onHeartbeat = function (heartbeat) {
    this.packet({ type: 'heartbeat' });
  };

  /**
   * Called when the transport opens.
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.isOpen = true;
    this.clearCloseTimeout();
    this.socket.onOpen();
  };

  /**
   * Notifies the base when the connection with the Socket.IO server
   * has been disconnected.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    var self = this;

    /* FIXME: reopen delay causing a infinit loop
    this.reopenTimeout = setTimeout(function () {
      self.open();
    }, this.socket.options['reopen delay']);*/

    this.isOpen = false;
    this.socket.onClose();
    this.onDisconnect();
  };

  /**
   * Generates a connection url based on the Socket.IO URL Protocol.
   * See <https://github.com/learnboost/socket.io-node/> for more details.
   *
   * @returns {String} Connection url
   * @api private
   */

  Transport.prototype.prepareUrl = function () {
    var options = this.socket.options;

    return this.scheme() + '://'
      + options.host + ':' + options.port + '/'
      + options.resource + '/' + io.protocol
      + '/' + this.name + '/' + this.sessid;
  };

  /**
   * Checks if the transport is ready to start a connection.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Transport.prototype.ready = function (socket, fn) {
    fn.call(this);
  };
})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.Socket = Socket;

  /**
   * Create a new `Socket.IO client` which can establish a persistent
   * connection with a Socket.IO enabled server.
   *
   * @api public
   */

  function Socket (options) {
    this.options = {
        port: 80
      , secure: false
      , document: 'document' in global ? document : false
      , resource: 'socket.io'
      , transports: io.transports
      , 'connect timeout': 10000
      , 'try multiple transports': true
      , 'reconnect': true
      , 'reconnection delay': 500
      , 'reconnection limit': Infinity
      , 'reopen delay': 3000
      , 'max reconnection attempts': 10
      , 'sync disconnect on unload': false
      , 'auto connect': true
      , 'flash policy port': 10843
      , 'manualFlush': false
    };

    io.util.merge(this.options, options);

    this.connected = false;
    this.open = false;
    this.connecting = false;
    this.reconnecting = false;
    this.namespaces = {};
    this.buffer = [];
    this.doBuffer = false;

    if (this.options['sync disconnect on unload'] &&
        (!this.isXDomain() || io.util.ua.hasCORS)) {
      var self = this;
      io.util.on(global, 'beforeunload', function () {
        self.disconnectSync();
      }, false);
    }

    if (this.options['auto connect']) {
      this.connect();
    }
};

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Socket, io.EventEmitter);

  /**
   * Returns a namespace listener/emitter for this socket
   *
   * @api public
   */

  Socket.prototype.of = function (name) {
    if (!this.namespaces[name]) {
      this.namespaces[name] = new io.SocketNamespace(this, name);

      if (name !== '') {
        this.namespaces[name].packet({ type: 'connect' });
      }
    }

    return this.namespaces[name];
  };

  /**
   * Emits the given event to the Socket and all namespaces
   *
   * @api private
   */

  Socket.prototype.publish = function () {
    this.emit.apply(this, arguments);

    var nsp;

    for (var i in this.namespaces) {
      if (this.namespaces.hasOwnProperty(i)) {
        nsp = this.of(i);
        nsp.$emit.apply(nsp, arguments);
      }
    }
  };

  /**
   * Performs the handshake
   *
   * @api private
   */

  function empty () { };

  Socket.prototype.handshake = function (fn) {
    var self = this
      , options = this.options;

    function complete (data) {
      if (data instanceof Error) {
        self.connecting = false;
        self.onError(data.message);
      } else {
        fn.apply(null, data.split(':'));
      }
    };

    var url = [
          'http' + (options.secure ? 's' : '') + ':/'
        , options.host + ':' + options.port
        , options.resource
        , io.protocol
        , io.util.query(this.options.query, 't=' + +new Date)
      ].join('/');

    if (this.isXDomain() && !io.util.ua.hasCORS) {
      var insertAt = document.getElementsByTagName('script')[0]
        , script = document.createElement('script');

      script.src = url + '&jsonp=' + io.j.length;
      insertAt.parentNode.insertBefore(script, insertAt);

      io.j.push(function (data) {
        complete(data);
        script.parentNode.removeChild(script);
      });
    } else {
      var xhr = io.util.request();

      xhr.open('GET', url, true);
      if (this.isXDomain()) {
        xhr.withCredentials = true;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;

          if (xhr.status == 200) {
            complete(xhr.responseText);
          } else if (xhr.status == 403) {
            self.onError(xhr.responseText);
          } else {
            self.connecting = false;            
            !self.reconnecting && self.onError(xhr.responseText);
          }
        }
      };
      xhr.send(null);
    }
  };

  /**
   * Find an available transport based on the options supplied in the constructor.
   *
   * @api private
   */

  Socket.prototype.getTransport = function (override) {
    var transports = override || this.transports, match;

    for (var i = 0, transport; transport = transports[i]; i++) {
      if (io.Transport[transport]
        && io.Transport[transport].check(this)
        && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
        return new io.Transport[transport](this, this.sessionid);
      }
    }

    return null;
  };

  /**
   * Connects to the server.
   *
   * @param {Function} [fn] Callback.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.connect = function (fn) {
    if (this.connecting) {
      return this;
    }

    var self = this;
    self.connecting = true;
    
    this.handshake(function (sid, heartbeat, close, transports) {
      self.sessionid = sid;
      self.closeTimeout = close * 1000;
      self.heartbeatTimeout = heartbeat * 1000;
      if(!self.transports)
          self.transports = self.origTransports = (transports ? io.util.intersect(
              transports.split(',')
            , self.options.transports
          ) : self.options.transports);

      self.setHeartbeatTimeout();

      function connect (transports){
        if (self.transport) self.transport.clearTimeouts();

        self.transport = self.getTransport(transports);
        if (!self.transport) return self.publish('connect_failed');

        // once the transport is ready
        self.transport.ready(self, function () {
          self.connecting = true;
          self.publish('connecting', self.transport.name);
          self.transport.open();

          if (self.options['connect timeout']) {
            self.connectTimeoutTimer = setTimeout(function () {
              if (!self.connected) {
                self.connecting = false;

                if (self.options['try multiple transports']) {
                  var remaining = self.transports;

                  while (remaining.length > 0 && remaining.splice(0,1)[0] !=
                         self.transport.name) {}

                    if (remaining.length){
                      connect(remaining);
                    } else {
                      self.publish('connect_failed');
                    }
                }
              }
            }, self.options['connect timeout']);
          }
        });
      }

      connect(self.transports);

      self.once('connect', function (){
        clearTimeout(self.connectTimeoutTimer);

        fn && typeof fn == 'function' && fn();
      });
    });

    return this;
  };

  /**
   * Clears and sets a new heartbeat timeout using the value given by the
   * server during the handshake.
   *
   * @api private
   */

  Socket.prototype.setHeartbeatTimeout = function () {
    clearTimeout(this.heartbeatTimeoutTimer);
    if(this.transport && !this.transport.heartbeats()) return;

    var self = this;
    this.heartbeatTimeoutTimer = setTimeout(function () {
      self.transport.onClose();
    }, this.heartbeatTimeout);
  };

  /**
   * Sends a message.
   *
   * @param {Object} data packet.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.packet = function (data) {
    if (this.connected && !this.doBuffer) {
      this.transport.packet(data);
    } else {
      this.buffer.push(data);
    }

    return this;
  };

  /**
   * Sets buffer state
   *
   * @api private
   */

  Socket.prototype.setBuffer = function (v) {
    this.doBuffer = v;

    if (!v && this.connected && this.buffer.length) {
      if (!this.options['manualFlush']) {
        this.flushBuffer();
      }
    }
  };

  /**
   * Flushes the buffer data over the wire.
   * To be invoked manually when 'manualFlush' is set to true.
   *
   * @api public
   */

  Socket.prototype.flushBuffer = function() {
    this.transport.payload(this.buffer);
    this.buffer = [];
  };
  

  /**
   * Disconnect the established connect.
   *
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.disconnect = function () {
    if (this.connected || this.connecting) {
      if (this.open) {
        this.of('').packet({ type: 'disconnect' });
      }

      // handle disconnection immediately
      this.onDisconnect('booted');
    }

    return this;
  };

  /**
   * Disconnects the socket with a sync XHR.
   *
   * @api private
   */

  Socket.prototype.disconnectSync = function () {
    // ensure disconnection
    var xhr = io.util.request();
    var uri = [
        'http' + (this.options.secure ? 's' : '') + ':/'
      , this.options.host + ':' + this.options.port
      , this.options.resource
      , io.protocol
      , ''
      , this.sessionid
    ].join('/') + '/?disconnect=1';

    xhr.open('GET', uri, false);
    xhr.send(null);

    // handle disconnection immediately
    this.onDisconnect('booted');
  };

  /**
   * Check if we need to use cross domain enabled transports. Cross domain would
   * be a different port or different domain name.
   *
   * @returns {Boolean}
   * @api private
   */

  Socket.prototype.isXDomain = function () {

    var port = global.location.port ||
      ('https:' == global.location.protocol ? 443 : 80);

    return this.options.host !== global.location.hostname 
      || this.options.port != port;
  };

  /**
   * Called upon handshake.
   *
   * @api private
   */

  Socket.prototype.onConnect = function () {
    if (!this.connected) {
      this.connected = true;
      this.connecting = false;
      if (!this.doBuffer) {
        // make sure to flush the buffer
        this.setBuffer(false);
      }
      this.emit('connect');
    }
  };

  /**
   * Called when the transport opens
   *
   * @api private
   */

  Socket.prototype.onOpen = function () {
    this.open = true;
  };

  /**
   * Called when the transport closes.
   *
   * @api private
   */

  Socket.prototype.onClose = function () {
    this.open = false;
    clearTimeout(this.heartbeatTimeoutTimer);
  };

  /**
   * Called when the transport first opens a connection
   *
   * @param text
   */

  Socket.prototype.onPacket = function (packet) {
    this.of(packet.endpoint).onPacket(packet);
  };

  /**
   * Handles an error.
   *
   * @api private
   */

  Socket.prototype.onError = function (err) {
    if (err && err.advice) {
      if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
        this.disconnect();
        if (this.options.reconnect) {
          this.reconnect();
        }
      }
    }

    this.publish('error', err && err.reason ? err.reason : err);
  };

  /**
   * Called when the transport disconnects.
   *
   * @api private
   */

  Socket.prototype.onDisconnect = function (reason) {
    var wasConnected = this.connected
      , wasConnecting = this.connecting;

    this.connected = false;
    this.connecting = false;
    this.open = false;

    if (wasConnected || wasConnecting) {
      this.transport.close();
      this.transport.clearTimeouts();
      if (wasConnected) {
        this.publish('disconnect', reason);

        if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
          this.reconnect();
        }
      }
    }
  };

  /**
   * Called upon reconnection.
   *
   * @api private
   */

  Socket.prototype.reconnect = function () {
    this.reconnecting = true;
    this.reconnectionAttempts = 0;
    this.reconnectionDelay = this.options['reconnection delay'];

    var self = this
      , maxAttempts = this.options['max reconnection attempts']
      , tryMultiple = this.options['try multiple transports']
      , limit = this.options['reconnection limit'];

    function reset () {
      if (self.connected) {
        for (var i in self.namespaces) {
          if (self.namespaces.hasOwnProperty(i) && '' !== i) {
              self.namespaces[i].packet({ type: 'connect' });
          }
        }
        self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
      }

      clearTimeout(self.reconnectionTimer);

      self.removeListener('connect_failed', maybeReconnect);
      self.removeListener('connect', maybeReconnect);

      self.reconnecting = false;

      delete self.reconnectionAttempts;
      delete self.reconnectionDelay;
      delete self.reconnectionTimer;
      delete self.redoTransports;

      self.options['try multiple transports'] = tryMultiple;
    };

    function maybeReconnect () {
      if (!self.reconnecting) {
        return;
      }

      if (self.connected) {
        return reset();
      };

      if (self.connecting && self.reconnecting) {
        return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
      }

      if (self.reconnectionAttempts++ >= maxAttempts) {
        if (!self.redoTransports) {
          self.on('connect_failed', maybeReconnect);
          self.options['try multiple transports'] = true;
          self.transports = self.origTransports;
          self.transport = self.getTransport();
          self.redoTransports = true;
          self.connect();
        } else {
          self.publish('reconnect_failed');
          reset();
        }
      } else {
        if (self.reconnectionDelay < limit) {
          self.reconnectionDelay *= 2; // exponential back off
        }

        self.connect();
        self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
        self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
      }
    };

    this.options['try multiple transports'] = false;
    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

    this.on('connect', maybeReconnect);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.SocketNamespace = SocketNamespace;

  /**
   * Socket namespace constructor.
   *
   * @constructor
   * @api public
   */

  function SocketNamespace (socket, name) {
    this.socket = socket;
    this.name = name || '';
    this.flags = {};
    this.json = new Flag(this, 'json');
    this.ackPackets = 0;
    this.acks = {};
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(SocketNamespace, io.EventEmitter);

  /**
   * Copies emit since we override it
   *
   * @api private
   */

  SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

  /**
   * Creates a new namespace, by proxying the request to the socket. This
   * allows us to use the synax as we do on the server.
   *
   * @api public
   */

  SocketNamespace.prototype.of = function () {
    return this.socket.of.apply(this.socket, arguments);
  };

  /**
   * Sends a packet.
   *
   * @api private
   */

  SocketNamespace.prototype.packet = function (packet) {
    packet.endpoint = this.name;
    this.socket.packet(packet);
    this.flags = {};
    return this;
  };

  /**
   * Sends a message
   *
   * @api public
   */

  SocketNamespace.prototype.send = function (data, fn) {
    var packet = {
        type: this.flags.json ? 'json' : 'message'
      , data: data
    };

    if ('function' == typeof fn) {
      packet.id = ++this.ackPackets;
      packet.ack = true;
      this.acks[packet.id] = fn;
    }

    return this.packet(packet);
  };

  /**
   * Emits an event
   *
   * @api public
   */
  
  SocketNamespace.prototype.emit = function (name) {
    var args = Array.prototype.slice.call(arguments, 1)
      , lastArg = args[args.length - 1]
      , packet = {
            type: 'event'
          , name: name
        };

    if ('function' == typeof lastArg) {
      packet.id = ++this.ackPackets;
      packet.ack = 'data';
      this.acks[packet.id] = lastArg;
      args = args.slice(0, args.length - 1);
    }

    packet.args = args;

    return this.packet(packet);
  };

  /**
   * Disconnects the namespace
   *
   * @api private
   */

  SocketNamespace.prototype.disconnect = function () {
    if (this.name === '') {
      this.socket.disconnect();
    } else {
      this.packet({ type: 'disconnect' });
      this.$emit('disconnect');
    }

    return this;
  };

  /**
   * Handles a packet
   *
   * @api private
   */

  SocketNamespace.prototype.onPacket = function (packet) {
    var self = this;

    function ack () {
      self.packet({
          type: 'ack'
        , args: io.util.toArray(arguments)
        , ackId: packet.id
      });
    };

    switch (packet.type) {
      case 'connect':
        this.$emit('connect');
        break;

      case 'disconnect':
        if (this.name === '') {
          this.socket.onDisconnect(packet.reason || 'booted');
        } else {
          this.$emit('disconnect', packet.reason);
        }
        break;

      case 'message':
      case 'json':
        var params = ['message', packet.data];

        if (packet.ack == 'data') {
          params.push(ack);
        } else if (packet.ack) {
          this.packet({ type: 'ack', ackId: packet.id });
        }

        this.$emit.apply(this, params);
        break;

      case 'event':
        var params = [packet.name].concat(packet.args);

        if (packet.ack == 'data')
          params.push(ack);

        this.$emit.apply(this, params);
        break;

      case 'ack':
        if (this.acks[packet.ackId]) {
          this.acks[packet.ackId].apply(this, packet.args);
          delete this.acks[packet.ackId];
        }
        break;

      case 'error':
        if (packet.advice){
          this.socket.onError(packet);
        } else {
          if (packet.reason == 'unauthorized') {
            this.$emit('connect_failed', packet.reason);
          } else {
            this.$emit('error', packet.reason);
          }
        }
        break;
    }
  };

  /**
   * Flag interface.
   *
   * @api private
   */

  function Flag (nsp, name) {
    this.namespace = nsp;
    this.name = name;
  };

  /**
   * Send a message
   *
   * @api public
   */

  Flag.prototype.send = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.send.apply(this.namespace, arguments);
  };

  /**
   * Emit an event
   *
   * @api public
   */

  Flag.prototype.emit = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.emit.apply(this.namespace, arguments);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.websocket = WS;

  /**
   * The WebSocket transport uses the HTML5 WebSocket API to establish an
   * persistent connection with the Socket.IO server. This transport will also
   * be inherited by the FlashSocket fallback as it provides a API compatible
   * polyfill for the WebSockets.
   *
   * @constructor
   * @extends {io.Transport}
   * @api public
   */

  function WS (socket) {
    io.Transport.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(WS, io.Transport);

  /**
   * Transport name
   *
   * @api public
   */

  WS.prototype.name = 'websocket';

  /**
   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
   * all the appropriate listeners to handle the responses from the server.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.open = function () {
    var query = io.util.query(this.socket.options.query)
      , self = this
      , Socket


    if (!Socket) {
      Socket = global.MozWebSocket || global.WebSocket;
    }

    this.websocket = new Socket(this.prepareUrl() + query);

    this.websocket.onopen = function () {
      self.onOpen();
      self.socket.setBuffer(false);
    };
    this.websocket.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.websocket.onclose = function () {
      self.onClose();
      self.socket.setBuffer(true);
    };
    this.websocket.onerror = function (e) {
      self.onError(e);
    };

    return this;
  };

  /**
   * Send a message to the Socket.IO server. The message will automatically be
   * encoded in the correct message format.
   *
   * @returns {Transport}
   * @api public
   */

  // Do to a bug in the current IDevices browser, we need to wrap the send in a 
  // setTimeout, when they resume from sleeping the browser will crash if 
  // we don't allow the browser time to detect the socket has been closed
  if (io.util.ua.iDevice) {
    WS.prototype.send = function (data) {
      var self = this;
      setTimeout(function() {
         self.websocket.send(data);
      },0);
      return this;
    };
  } else {
    WS.prototype.send = function (data) {
      this.websocket.send(data);
      return this;
    };
  }

  /**
   * Payload
   *
   * @api private
   */

  WS.prototype.payload = function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      this.packet(arr[i]);
    }
    return this;
  };

  /**
   * Disconnect the established `WebSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.close = function () {
    this.websocket.close();
    return this;
  };

  /**
   * Handle the errors that `WebSocket` might be giving when we
   * are attempting to connect or send messages.
   *
   * @param {Error} e The error.
   * @api private
   */

  WS.prototype.onError = function (e) {
    this.socket.onError(e);
  };

  /**
   * Returns the appropriate scheme for the URI generation.
   *
   * @api private
   */
  WS.prototype.scheme = function () {
    return this.socket.options.secure ? 'wss' : 'ws';
  };

  /**
   * Checks if the browser has support for native `WebSockets` and that
   * it's not the polyfill created for the FlashSocket transport.
   *
   * @return {Boolean}
   * @api public
   */

  WS.check = function () {
    return ('WebSocket' in global && !('__addTask' in WebSocket))
          || 'MozWebSocket' in global;
  };

  /**
   * Check if the `WebSocket` transport support cross domain communications.
   *
   * @returns {Boolean}
   * @api public
   */

  WS.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('websocket');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.flashsocket = Flashsocket;

  /**
   * The FlashSocket transport. This is a API wrapper for the HTML5 WebSocket
   * specification. It uses a .swf file to communicate with the server. If you want
   * to serve the .swf file from a other server than where the Socket.IO script is
   * coming from you need to use the insecure version of the .swf. More information
   * about this can be found on the github page.
   *
   * @constructor
   * @extends {io.Transport.websocket}
   * @api public
   */

  function Flashsocket () {
    io.Transport.websocket.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(Flashsocket, io.Transport.websocket);

  /**
   * Transport name
   *
   * @api public
   */

  Flashsocket.prototype.name = 'flashsocket';

  /**
   * Disconnect the established `FlashSocket` connection. This is done by adding a 
   * new task to the FlashSocket. The rest will be handled off by the `WebSocket` 
   * transport.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.open = function () {
    var self = this
      , args = arguments;

    WebSocket.__addTask(function () {
      io.Transport.websocket.prototype.open.apply(self, args);
    });
    return this;
  };
  
  /**
   * Sends a message to the Socket.IO server. This is done by adding a new
   * task to the FlashSocket. The rest will be handled off by the `WebSocket` 
   * transport.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.send = function () {
    var self = this, args = arguments;
    WebSocket.__addTask(function () {
      io.Transport.websocket.prototype.send.apply(self, args);
    });
    return this;
  };

  /**
   * Disconnects the established `FlashSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.close = function () {
    WebSocket.__tasks.length = 0;
    io.Transport.websocket.prototype.close.call(this);
    return this;
  };

  /**
   * The WebSocket fall back needs to append the flash container to the body
   * element, so we need to make sure we have access to it. Or defer the call
   * until we are sure there is a body element.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Flashsocket.prototype.ready = function (socket, fn) {
    function init () {
      var options = socket.options
        , port = options['flash policy port']
        , path = [
              'http' + (options.secure ? 's' : '') + ':/'
            , options.host + ':' + options.port
            , options.resource
            , 'static/flashsocket'
            , 'WebSocketMain' + (socket.isXDomain() ? 'Insecure' : '') + '.swf'
          ];

      // Only start downloading the swf file when the checked that this browser
      // actually supports it
      if (!Flashsocket.loaded) {
        if (typeof WEB_SOCKET_SWF_LOCATION === 'undefined') {
          // Set the correct file based on the XDomain settings
          WEB_SOCKET_SWF_LOCATION = path.join('/');
        }

        if (port !== 843) {
          WebSocket.loadFlashPolicyFile('xmlsocket://' + options.host + ':' + port);
        }

        WebSocket.__initialize();
        Flashsocket.loaded = true;
      }

      fn.call(self);
    }

    var self = this;
    if (document.body) return init();

    io.util.load(init);
  };

  /**
   * Check if the FlashSocket transport is supported as it requires that the Adobe
   * Flash Player plug-in version `10.0.0` or greater is installed. And also check if
   * the polyfill is correctly loaded.
   *
   * @returns {Boolean}
   * @api public
   */

  Flashsocket.check = function () {
    if (
        typeof WebSocket == 'undefined'
      || !('__initialize' in WebSocket) || !swfobject
    ) return false;

    return swfobject.getFlashPlayerVersion().major >= 10;
  };

  /**
   * Check if the FlashSocket transport can be used as cross domain / cross origin 
   * transport. Because we can't see which type (secure or insecure) of .swf is used
   * we will just return true.
   *
   * @returns {Boolean}
   * @api public
   */

  Flashsocket.xdomainCheck = function () {
    return true;
  };

  /**
   * Disable AUTO_INITIALIZATION
   */

  if (typeof window != 'undefined') {
    WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
  }

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('flashsocket');
})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
if ('undefined' != typeof window) {
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O[(['Active'].concat('Object').join('X'))]!=D){try{var ad=new window[(['Active'].concat('Object').join('X'))](W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?(['Active'].concat('').join('X')):"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
}
// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

(function() {
  
  if ('undefined' == typeof window || window.WebSocket) return;

  var console = window.console;
  if (!console || !console.log || !console.error) {
    console = {log: function(){ }, error: function(){ }};
  }
  
  if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
    console.error("Flash Player >= 10.0.0 is required.");
    return;
  }
  if (location.protocol == "file:") {
    console.error(
      "WARNING: web-socket-js doesn't work in file:///... URL " +
      "unless you set Flash Security Settings properly. " +
      "Open the page via Web server i.e. http://...");
  }

  /**
   * This class represents a faux web socket.
   * @param {string} url
   * @param {array or string} protocols
   * @param {string} proxyHost
   * @param {int} proxyPort
   * @param {string} headers
   */
  WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
    var self = this;
    self.__id = WebSocket.__nextId++;
    WebSocket.__instances[self.__id] = self;
    self.readyState = WebSocket.CONNECTING;
    self.bufferedAmount = 0;
    self.__events = {};
    if (!protocols) {
      protocols = [];
    } else if (typeof protocols == "string") {
      protocols = [protocols];
    }
    // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
    // Otherwise, when onopen fires immediately, onopen is called before it is set.
    setTimeout(function() {
      WebSocket.__addTask(function() {
        WebSocket.__flash.create(
            self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
      });
    }, 0);
  };

  /**
   * Send data to the web socket.
   * @param {string} data  The data to send to the socket.
   * @return {boolean}  True for success, false for failure.
   */
  WebSocket.prototype.send = function(data) {
    if (this.readyState == WebSocket.CONNECTING) {
      throw "INVALID_STATE_ERR: Web Socket connection has not been established";
    }
    // We use encodeURIComponent() here, because FABridge doesn't work if
    // the argument includes some characters. We don't use escape() here
    // because of this:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
    // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
    // preserve all Unicode characters either e.g. "\uffff" in Firefox.
    // Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
    // additional testing.
    var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
    if (result < 0) { // success
      return true;
    } else {
      this.bufferedAmount += result;
      return false;
    }
  };

  /**
   * Close this web socket gracefully.
   */
  WebSocket.prototype.close = function() {
    if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
      return;
    }
    this.readyState = WebSocket.CLOSING;
    WebSocket.__flash.close(this.__id);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) {
      this.__events[type] = [];
    }
    this.__events[type].push(listener);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) return;
    var events = this.__events[type];
    for (var i = events.length - 1; i >= 0; --i) {
      if (events[i] === listener) {
        events.splice(i, 1);
        break;
      }
    }
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {Event} event
   * @return void
   */
  WebSocket.prototype.dispatchEvent = function(event) {
    var events = this.__events[event.type] || [];
    for (var i = 0; i < events.length; ++i) {
      events[i](event);
    }
    var handler = this["on" + event.type];
    if (handler) handler(event);
  };

  /**
   * Handles an event from Flash.
   * @param {Object} flashEvent
   */
  WebSocket.prototype.__handleEvent = function(flashEvent) {
    if ("readyState" in flashEvent) {
      this.readyState = flashEvent.readyState;
    }
    if ("protocol" in flashEvent) {
      this.protocol = flashEvent.protocol;
    }
    
    var jsEvent;
    if (flashEvent.type == "open" || flashEvent.type == "error") {
      jsEvent = this.__createSimpleEvent(flashEvent.type);
    } else if (flashEvent.type == "close") {
      // TODO implement jsEvent.wasClean
      jsEvent = this.__createSimpleEvent("close");
    } else if (flashEvent.type == "message") {
      var data = decodeURIComponent(flashEvent.message);
      jsEvent = this.__createMessageEvent("message", data);
    } else {
      throw "unknown event type: " + flashEvent.type;
    }
    
    this.dispatchEvent(jsEvent);
  };
  
  WebSocket.prototype.__createSimpleEvent = function(type) {
    if (document.createEvent && window.Event) {
      var event = document.createEvent("Event");
      event.initEvent(type, false, false);
      return event;
    } else {
      return {type: type, bubbles: false, cancelable: false};
    }
  };
  
  WebSocket.prototype.__createMessageEvent = function(type, data) {
    if (document.createEvent && window.MessageEvent && !window.opera) {
      var event = document.createEvent("MessageEvent");
      event.initMessageEvent("message", false, false, data, null, null, window, null);
      return event;
    } else {
      // IE and Opera, the latter one truncates the data parameter after any 0x00 bytes.
      return {type: type, data: data, bubbles: false, cancelable: false};
    }
  };
  
  /**
   * Define the WebSocket readyState enumeration.
   */
  WebSocket.CONNECTING = 0;
  WebSocket.OPEN = 1;
  WebSocket.CLOSING = 2;
  WebSocket.CLOSED = 3;

  WebSocket.__flash = null;
  WebSocket.__instances = {};
  WebSocket.__tasks = [];
  WebSocket.__nextId = 0;
  
  /**
   * Load a new flash security policy file.
   * @param {string} url
   */
  WebSocket.loadFlashPolicyFile = function(url){
    WebSocket.__addTask(function() {
      WebSocket.__flash.loadManualPolicyFile(url);
    });
  };

  /**
   * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
   */
  WebSocket.__initialize = function() {
    if (WebSocket.__flash) return;
    
    if (WebSocket.__swfLocation) {
      // For backword compatibility.
      window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
    }
    if (!window.WEB_SOCKET_SWF_LOCATION) {
      console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
      return;
    }
    var container = document.createElement("div");
    container.id = "webSocketContainer";
    // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
    // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
    // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
    // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
    // the best we can do as far as we know now.
    container.style.position = "absolute";
    if (WebSocket.__isFlashLite()) {
      container.style.left = "0px";
      container.style.top = "0px";
    } else {
      container.style.left = "-100px";
      container.style.top = "-100px";
    }
    var holder = document.createElement("div");
    holder.id = "webSocketFlash";
    container.appendChild(holder);
    document.body.appendChild(container);
    // See this article for hasPriority:
    // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
    swfobject.embedSWF(
      WEB_SOCKET_SWF_LOCATION,
      "webSocketFlash",
      "1" /* width */,
      "1" /* height */,
      "10.0.0" /* SWF version */,
      null,
      null,
      {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
      null,
      function(e) {
        if (!e.success) {
          console.error("[WebSocket] swfobject.embedSWF failed");
        }
      });
  };
  
  /**
   * Called by Flash to notify JS that it's fully loaded and ready
   * for communication.
   */
  WebSocket.__onFlashInitialized = function() {
    // We need to set a timeout here to avoid round-trip calls
    // to flash during the initialization process.
    setTimeout(function() {
      WebSocket.__flash = document.getElementById("webSocketFlash");
      WebSocket.__flash.setCallerUrl(location.href);
      WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
      for (var i = 0; i < WebSocket.__tasks.length; ++i) {
        WebSocket.__tasks[i]();
      }
      WebSocket.__tasks = [];
    }, 0);
  };
  
  /**
   * Called by Flash to notify WebSockets events are fired.
   */
  WebSocket.__onFlashEvent = function() {
    setTimeout(function() {
      try {
        // Gets events using receiveEvents() instead of getting it from event object
        // of Flash event. This is to make sure to keep message order.
        // It seems sometimes Flash events don't arrive in the same order as they are sent.
        var events = WebSocket.__flash.receiveEvents();
        for (var i = 0; i < events.length; ++i) {
          WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
        }
      } catch (e) {
        console.error(e);
      }
    }, 0);
    return true;
  };
  
  // Called by Flash.
  WebSocket.__log = function(message) {
    console.log(decodeURIComponent(message));
  };
  
  // Called by Flash.
  WebSocket.__error = function(message) {
    console.error(decodeURIComponent(message));
  };
  
  WebSocket.__addTask = function(task) {
    if (WebSocket.__flash) {
      task();
    } else {
      WebSocket.__tasks.push(task);
    }
  };
  
  /**
   * Test if the browser is running flash lite.
   * @return {boolean} True if flash lite is running, false otherwise.
   */
  WebSocket.__isFlashLite = function() {
    if (!window.navigator || !window.navigator.mimeTypes) {
      return false;
    }
    var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
    if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
      return false;
    }
    return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
  };
  
  if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
    if (window.addEventListener) {
      window.addEventListener("load", function(){
        WebSocket.__initialize();
      }, false);
    } else {
      window.attachEvent("onload", function(){
        WebSocket.__initialize();
      });
    }
  }
  
})();

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   *
   * @api public
   */

  exports.XHR = XHR;

  /**
   * XHR constructor
   *
   * @costructor
   * @api public
   */

  function XHR (socket) {
    if (!socket) return;

    io.Transport.apply(this, arguments);
    this.sendBuffer = [];
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(XHR, io.Transport);

  /**
   * Establish a connection
   *
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.open = function () {
    this.socket.setBuffer(false);
    this.onOpen();
    this.get();

    // we need to make sure the request succeeds since we have no indication
    // whether the request opened or not until it succeeded.
    this.setCloseTimeout();

    return this;
  };

  /**
   * Check if we need to send data to the Socket.IO server, if we have data in our
   * buffer we encode it and forward it to the `post` method.
   *
   * @api private
   */

  XHR.prototype.payload = function (payload) {
    var msgs = [];

    for (var i = 0, l = payload.length; i < l; i++) {
      msgs.push(io.parser.encodePacket(payload[i]));
    }

    this.send(io.parser.encodePayload(msgs));
  };

  /**
   * Send data to the Socket.IO server.
   *
   * @param data The message
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.send = function (data) {
    this.post(data);
    return this;
  };

  /**
   * Posts a encoded message to the Socket.IO server.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  function empty () { };

  XHR.prototype.post = function (data) {
    var self = this;
    this.socket.setBuffer(true);

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;
        self.posting = false;

        if (this.status == 200){
          self.socket.setBuffer(false);
        } else {
          self.onClose();
        }
      }
    }

    function onload () {
      this.onload = empty;
      self.socket.setBuffer(false);
    };

    this.sendXHR = this.request('POST');

    if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
      this.sendXHR.onload = this.sendXHR.onerror = onload;
    } else {
      this.sendXHR.onreadystatechange = stateChange;
    }

    this.sendXHR.send(data);
  };

  /**
   * Disconnects the established `XHR` connection.
   *
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.close = function () {
    this.onClose();
    return this;
  };

  /**
   * Generates a configured XHR request
   *
   * @param {String} url The url that needs to be requested.
   * @param {String} method The method the request should use.
   * @returns {XMLHttpRequest}
   * @api private
   */

  XHR.prototype.request = function (method) {
    var req = io.util.request(this.socket.isXDomain())
      , query = io.util.query(this.socket.options.query, 't=' + +new Date);

    req.open(method || 'GET', this.prepareUrl() + query, true);

    if (method == 'POST') {
      try {
        if (req.setRequestHeader) {
          req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        } else {
          // XDomainRequest
          req.contentType = 'text/plain';
        }
      } catch (e) {}
    }

    return req;
  };

  /**
   * Returns the scheme to use for the transport URLs.
   *
   * @api private
   */

  XHR.prototype.scheme = function () {
    return this.socket.options.secure ? 'https' : 'http';
  };

  /**
   * Check if the XHR transports are supported
   *
   * @param {Boolean} xdomain Check if we support cross domain requests.
   * @returns {Boolean}
   * @api public
   */

  XHR.check = function (socket, xdomain) {
    try {
      var request = io.util.request(xdomain),
          usesXDomReq = (global.XDomainRequest && request instanceof XDomainRequest),
          socketProtocol = (socket && socket.options && socket.options.secure ? 'https:' : 'http:'),
          isXProtocol = (global.location && socketProtocol != global.location.protocol);
      if (request && !(usesXDomReq && isXProtocol)) {
        return true;
      }
    } catch(e) {}

    return false;
  };

  /**
   * Check if the XHR transport supports cross domain requests.
   *
   * @returns {Boolean}
   * @api public
   */

  XHR.xdomainCheck = function (socket) {
    return XHR.check(socket, true);
  };

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.htmlfile = HTMLFile;

  /**
   * The HTMLFile transport creates a `forever iframe` based transport
   * for Internet Explorer. Regular forever iframe implementations will 
   * continuously trigger the browsers buzy indicators. If the forever iframe
   * is created inside a `htmlfile` these indicators will not be trigged.
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */

  function HTMLFile (socket) {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(HTMLFile, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  HTMLFile.prototype.name = 'htmlfile';

  /**
   * Creates a new Ac...eX `htmlfile` with a forever loading iframe
   * that can be used to listen to messages. Inside the generated
   * `htmlfile` a reference will be made to the HTMLFile transport.
   *
   * @api private
   */

  HTMLFile.prototype.get = function () {
    this.doc = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
    this.doc.open();
    this.doc.write('<html></html>');
    this.doc.close();
    this.doc.parentWindow.s = this;

    var iframeC = this.doc.createElement('div');
    iframeC.className = 'socketio';

    this.doc.body.appendChild(iframeC);
    this.iframe = this.doc.createElement('iframe');

    iframeC.appendChild(this.iframe);

    var self = this
      , query = io.util.query(this.socket.options.query, 't='+ +new Date);

    this.iframe.src = this.prepareUrl() + query;

    io.util.on(window, 'unload', function () {
      self.destroy();
    });
  };

  /**
   * The Socket.IO server will write script tags inside the forever
   * iframe, this function will be used as callback for the incoming
   * information.
   *
   * @param {String} data The message
   * @param {document} doc Reference to the context
   * @api private
   */

  HTMLFile.prototype._ = function (data, doc) {
    // unescape all forward slashes. see GH-1251
    data = data.replace(/\\\//g, '/');
    this.onData(data);
    try {
      var script = doc.getElementsByTagName('script')[0];
      script.parentNode.removeChild(script);
    } catch (e) { }
  };

  /**
   * Destroy the established connection, iframe and `htmlfile`.
   * And calls the `CollectGarbage` function of Internet Explorer
   * to release the memory.
   *
   * @api private
   */

  HTMLFile.prototype.destroy = function () {
    if (this.iframe){
      try {
        this.iframe.src = 'about:blank';
      } catch(e){}

      this.doc = null;
      this.iframe.parentNode.removeChild(this.iframe);
      this.iframe = null;

      CollectGarbage();
    }
  };

  /**
   * Disconnects the established connection.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  HTMLFile.prototype.close = function () {
    this.destroy();
    return io.Transport.XHR.prototype.close.call(this);
  };

  /**
   * Checks if the browser supports this transport. The browser
   * must have an `Ac...eXObject` implementation.
   *
   * @return {Boolean}
   * @api public
   */

  HTMLFile.check = function (socket) {
    if (typeof window != "undefined" && (['Active'].concat('Object').join('X')) in window){
      try {
        var a = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
        return a && io.Transport.XHR.check(socket);
      } catch(e){}
    }
    return false;
  };

  /**
   * Check if cross domain requests are supported.
   *
   * @returns {Boolean}
   * @api public
   */

  HTMLFile.xdomainCheck = function () {
    // we can probably do handling for sub-domains, we should
    // test that it's cross domain but a subdomain here
    return false;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('htmlfile');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports['xhr-polling'] = XHRPolling;

  /**
   * The XHR-polling transport uses long polling XHR requests to create a
   * "persistent" connection with the server.
   *
   * @constructor
   * @api public
   */

  function XHRPolling () {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(XHRPolling, io.Transport.XHR);

  /**
   * Merge the properties from XHR transport
   */

  io.util.merge(XHRPolling, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  XHRPolling.prototype.name = 'xhr-polling';

  /**
   * Indicates whether heartbeats is enabled for this transport
   *
   * @api private
   */

  XHRPolling.prototype.heartbeats = function () {
    return false;
  };

  /** 
   * Establish a connection, for iPhone and Android this will be done once the page
   * is loaded.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  XHRPolling.prototype.open = function () {
    var self = this;

    io.Transport.XHR.prototype.open.call(self);
    return false;
  };

  /**
   * Starts a XHR request to wait for incoming messages.
   *
   * @api private
   */

  function empty () {};

  XHRPolling.prototype.get = function () {
    if (!this.isOpen) return;

    var self = this;

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;

        if (this.status == 200) {
          self.onData(this.responseText);
          self.get();
        } else {
          self.onClose();
        }
      }
    };

    function onload () {
      this.onload = empty;
      this.onerror = empty;
      self.retryCounter = 1;
      self.onData(this.responseText);
      self.get();
    };

    function onerror () {
      self.retryCounter ++;
      if(!self.retryCounter || self.retryCounter > 3) {
        self.onClose();  
      } else {
        self.get();
      }
    };

    this.xhr = this.request();

    if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
      this.xhr.onload = onload;
      this.xhr.onerror = onerror;
    } else {
      this.xhr.onreadystatechange = stateChange;
    }

    this.xhr.send(null);
  };

  /**
   * Handle the unclean close behavior.
   *
   * @api private
   */

  XHRPolling.prototype.onClose = function () {
    io.Transport.XHR.prototype.onClose.call(this);

    if (this.xhr) {
      this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
      try {
        this.xhr.abort();
      } catch(e){}
      this.xhr = null;
    }
  };

  /**
   * Webkit based browsers show a infinit spinner when you start a XHR request
   * before the browsers onload event is called so we need to defer opening of
   * the transport until the onload event is called. Wrapping the cb in our
   * defer method solve this.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  XHRPolling.prototype.ready = function (socket, fn) {
    var self = this;

    io.util.defer(function () {
      fn.call(self);
    });
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('xhr-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {
  /**
   * There is a way to hide the loading indicator in Firefox. If you create and
   * remove a iframe it will stop showing the current loading indicator.
   * Unfortunately we can't feature detect that and UA sniffing is evil.
   *
   * @api private
   */

  var indicator = global.document && "MozAppearance" in
    global.document.documentElement.style;

  /**
   * Expose constructor.
   */

  exports['jsonp-polling'] = JSONPPolling;

  /**
   * The JSONP transport creates an persistent connection by dynamically
   * inserting a script tag in the page. This script tag will receive the
   * information of the Socket.IO server. When new information is received
   * it creates a new script tag for the new data stream.
   *
   * @constructor
   * @extends {io.Transport.xhr-polling}
   * @api public
   */

  function JSONPPolling (socket) {
    io.Transport['xhr-polling'].apply(this, arguments);

    this.index = io.j.length;

    var self = this;

    io.j.push(function (msg) {
      self._(msg);
    });
  };

  /**
   * Inherits from XHR polling transport.
   */

  io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

  /**
   * Transport name
   *
   * @api public
   */

  JSONPPolling.prototype.name = 'jsonp-polling';

  /**
   * Posts a encoded message to the Socket.IO server using an iframe.
   * The iframe is used because script tags can create POST based requests.
   * The iframe is positioned outside of the view so the user does not
   * notice it's existence.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  JSONPPolling.prototype.post = function (data) {
    var self = this
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (!this.form) {
      var form = document.createElement('form')
        , area = document.createElement('textarea')
        , id = this.iframeId = 'socketio_iframe_' + this.index
        , iframe;

      form.className = 'socketio';
      form.style.position = 'absolute';
      form.style.top = '0px';
      form.style.left = '0px';
      form.style.display = 'none';
      form.target = id;
      form.method = 'POST';
      form.setAttribute('accept-charset', 'utf-8');
      area.name = 'd';
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.prepareUrl() + query;

    function complete () {
      initIframe();
      self.socket.setBuffer(false);
    };

    function initIframe () {
      if (self.iframe) {
        self.form.removeChild(self.iframe);
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
      } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
      }

      iframe.id = self.iframeId;

      self.form.appendChild(iframe);
      self.iframe = iframe;
    };

    initIframe();

    // we temporarily stringify until we figure out how to prevent
    // browsers from turning `\n` into `\r\n` in form inputs
    this.area.value = io.JSON.stringify(data);

    try {
      this.form.submit();
    } catch(e) {}

    if (this.iframe.attachEvent) {
      iframe.onreadystatechange = function () {
        if (self.iframe.readyState == 'complete') {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }

    this.socket.setBuffer(true);
  };

  /**
   * Creates a new JSONP poll that can be used to listen
   * for messages from the Socket.IO server.
   *
   * @api private
   */

  JSONPPolling.prototype.get = function () {
    var self = this
      , script = document.createElement('script')
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.prepareUrl() + query;
    script.onerror = function () {
      self.onClose();
    };

    var insertAt = document.getElementsByTagName('script')[0];
    insertAt.parentNode.insertBefore(script, insertAt);
    this.script = script;

    if (indicator) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  };

  /**
   * Callback function for the incoming message stream from the Socket.IO server.
   *
   * @param {String} data The message
   * @api private
   */

  JSONPPolling.prototype._ = function (msg) {
    this.onData(msg);
    if (this.isOpen) {
      this.get();
    }
    return this;
  };

  /**
   * The indicator hack only works after onload
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  JSONPPolling.prototype.ready = function (socket, fn) {
    var self = this;
    if (!indicator) return fn.call(this);

    io.util.load(function () {
      fn.call(self);
    });
  };

  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */

  JSONPPolling.check = function () {
    return 'document' in global;
  };

  /**
   * Check if cross domain requests are supported
   *
   * @returns {Boolean}
   * @api public
   */

  JSONPPolling.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('jsonp-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

if (typeof define === "function" && define.amd) {
  define([], function () { return io; });
}
})();
},{}]},{},[9]);