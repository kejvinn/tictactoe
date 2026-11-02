# Tic Tac Toe Tournament

Two players play a best of 1, 3 or 5 tournament of Tic Tac Toe on the same device. The scoreboard shows wins and draws, and a leaderboard keeps every player's results.

Built with Angular, NgRx signals, RxJS and json-server.

## Running

```bash
npm install
cp db.example.json db.json
npm run serve
```

This starts json-server on port 3000 and the app on http://localhost:4200. You can also run `npm run api` and `npm start` separately.

## Rules

- Each player needs a different name (case and extra spaces don't count) and picks X or O.
- Odd games start with X and even games with O.
- A draw counts as a game.
- The tournament ends when a player has won most of the games, or when all games are played. Equal wins is a tie.
- Play again starts a new tournament with the same players and settings.
- The leaderboard counts tournaments, not single games. The winner gets a win, the loser a loss and a tie counts as a draw for both. The same name is always the same player.

## Code

- `src/app/core/store` has the tournament state and actions.
- `src/app/core/rules` has the game logic.
- `src/app/core/services` and `src/app/core/api` talk to json-server.
- `src/app/features` has the setup, game and leaderboard pages.
