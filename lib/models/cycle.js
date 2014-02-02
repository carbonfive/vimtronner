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
