![vimtronner][game_play_img]

#vimtronner

A multiplayer, realtime, command-line game that teaches you the core
vim keys. Be the last player alive by either controlling your bike
safely around obstacles or enter INSERT mode to build walls for your
opponents to crash into. Just remember, you can't do both
at the same time!

Inspired by [Patrick Moody's](http://patmoody.com)
[vimsnake](http://vimsnake.com) and, of course,
[TRON](http://www.imdb.com/title/tt0084827/).

## Quickstart Guide

Greetings, programs! Before we can enter the grid, we need to have
`node` ([http://nodejs.org](http://nodejs.org)) installed.  There are
many paths to do so; we like to install it through `brew`
([http://brew.sh/](http://brew.sh/)).

```sh
$ brew install node
```

Install the `vimtronner` module via `npm`:

```sh
$ npm install -g vimtronner
```

Start a practice game:

```sh
$ vimtronner
```

Press `i` to start the game. After a countdown, the game
starts. Your bike moves continuously. You can control its
direction:

* go left by pressing `h`
* go down by pressing `j`
* go up by pressing `k`
* go right by pressing `l`

To start creating insert walls, enter INSERT mode by pressing
`i`. **BUT** remember; you can't change your direction while in
INSERT mode. To return to normal press `ESC` or `CTRL-[`. Press
`q` to quit anytime.

When you're ready to face other players, connect
as a client to the public `vimtronner` server,
stating the number of players you want.

```sh
$ vimtronner -C -N 4
```

Look in the lower left-hand corner for your game name.

![Game name found in lower left-hand corner][game_name_location_img]

Then have the other players join that game as a client:

```sh
$ vimtronner -G simplistic-trail
```

The game will start once all players have declared they are ready by
pressing `i`.

Good luck. It's in your hands to see if you're a User ... or a loser!

## Controls

Your bike will continually move on its own;
you only have control over which direction it is heading in or
whether you can build walls. Just remember, you can't do both
at the same time!

```
left...................h
down...................j
up.....................k
right..................l
insert mode............i
normal mode...esc/ctrl-[
```

## Launching

### Practice

Launching `vimtronner` with no options kicks it off in a single-player
practice mode:

```sh
$ vimtronner
```

Use this mode to become familar with the vim keys and how to rapidly
switch between `INSERT` mode to build walls and normal mode to control
your direction.

### Public Multiplayer

To play a multiplayer game, you connect as a client (with the `-C` or
`--client` flag) to our public multiplayer server, passing in the
number of players who want to play with the `-N` or `--number` option.

```sh
$ vimtronner -C -N 6
```

A game is created with a random name you can find in the lower left-hand
corner.

![Game name found in lower left-hand corner][game_name_location_img]

You can also explicitly give a name to a game when you create it through
the `-G` or `--game` option.

```sh
$ vimtronner -C -N 6 -G mygame
```

Other players can then join your game by starting `vimtronner` in
client-only mode (`-C` or `--client`) and passing in the name of the
game (`-G` or `--game`).

```sh
$ vimtronner -C -G simplistic-trail
```

The game will only start one all players have connected and declared
they are ready by entering INSERT mode (pressing `i`). You can quit at
anytime (press `q`) with the last bike remaining being considered the
winner.

At the end of the match, you can all play again by everyone
declaring they are ready by pressing `i`.

**NOTE:** Games on the public server have a time to live of 3 minutes.
This is to ensure system resources are not overwhelmed with dead games.
Blame the MCP.

### Local Multiplayer

You can start yor own multiplayer on your local network for others to
join. Simply launch `vimtronner` with the number of players
you want before starting a game with the `-N` or `--number` option and
_WITHOUT_ the client flag (`-C` or `--client`)

```sh
$ vimtronner -N 3
```

This starts your own `vimtronner` on your machine, which you are
immediately connected to. Like on the public server a random name is
given to your game (displayed in the lower left-hand corner)

![Game name found in lower left-hand corner][game_name_location_img]

You can explicitly give a name to a game when you create it through
the `-G` or `--game` option.

```sh
$ vimtronner -N 3 -G mygame
```

Other players can then join your game by starting `vimtronner` in
client-only mode (`-C` or `--client`) and passing in the name of the
game (`-G` or `--game`) and the address of your machine (`-A` or
`--address`).

```sh
$ vimtronner -C -G simplistic-trail -A 10.0.1.144
```

By default, `vimtronner` launches and connects to port `8766`. You can
override this through the `-P` or `--port` flag. So when launching a
local multiplayer game:

```sh
$ vimtronner -N 3 -P 8000
```

And when others want to join:

```sh
$ vimtronner -C -G simplistic-trail -A 10.0.1.144 -P 8000
```

**Note:** that if the game host quits, the game ends immediately and everyone
is disconnected.

### "Headless" Server Mode

You can launch a `vimtronner` server to host multiple games without also
starting a game. Simply pass in the `-S` or `--server` flag.

```sh
$ vimtronner -S
```

Now anyone can create a game on the server by connecting as a client
(`-C` or `--client` flag) to the server's address (`-A` or `--address`)
to create games:

```sh
$ vimtronner -C -A 10.0.1.144 -N 5
```

And join them:

```sh
$ vimtronner -C -A 10.0.1.144 -N 5 -G simplistic-trail
```

As always they can give games a specific name (`-G` or `--game`
option) when creating them. You can also set a port number for your
server to listen to with the `-P` or `--port` option (it defaults to
8766). Players use the same option when connecting.

### Listing Games

To see a list of all games running on a server, simply connect as a
client and pass the `-L` or `--list` flag.

```sh
$ vimtronner -C -L
```

This works in tandem with the `-A`/`--address` and `-P`/`--port` options
to specify the server we are connecting to.

### All Options

```sh

  Usage: vimtronner [options]

  Options:

    -h, --help                        output usage information
    -V, --version                     output the version number
    -S, --server                      launches in server only mode
    -C, --client                      launches in client only mode
    -A, --address <address>           the address to connect the client
    -P, --port <port>                 the port to launch the server or connect the client
    -G, --game <game>                 the name of the game the client wants to join
    -N, --number <number of players>  the number of players required to play (applies to new game only)
    -W, --width <size>                the grid width
    -H, --height <size>               the grid height
    -L, --list                        list active games on the server

```

## Development

Want to contribute to `vimtronner`? There are many ways to do. File bugs
and features through
[Github](https://github.com/carbonfive/vimtronner/issues?state=open).
Or [fork][vimtronner] the repo to add your own
changes and create a pull-request so we can bring them in! Any help is
welcome!

## Contributors

* [Chris
  Svenningsen](/crsven) -
  [@hmmwhatsthis](http://twitter.com/hmmwhatsthis)
* [Bobby Matson](/bomatson) - [@bomatson](http://twitter.com/bomatson)
* [Rudy Jahchan](/rudyjahchan) - [@rudy](http://twitter.com/rudy)

[vimtronner]: http://github.com/carbonfive/vimtronner
[game_name_location_img]:http://carbonfive.github.io/vimtronner/img/vimtronner-name.png
[game_play_img]: http://carbonfive.github.io/vimtronner/img/vimtronner1.gif
