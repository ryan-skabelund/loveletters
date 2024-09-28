class GameManager:
    def __init__(self):
        self.players = []

    def add_player(self, player_id):
        self.players.append(player_id)
        print(f'Current players: {self.players}')