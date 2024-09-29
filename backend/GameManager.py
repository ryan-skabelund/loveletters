import random
import json
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from Resources import WordManager, PromptManager

@dataclass
class Word:
	value: str

@dataclass
class PlacedWord:
	color: str
	x: float
	y: float
	fontSize: str
	rotation: float
	word: str

	def as_dict(self):
		return {
			"color": self.color,
			"x": self.x,
			"y": self.y,
			"fontSize": self.fontSize,
			"rotation": self.rotation,
			"word": self.word
		}

@dataclass
class Player:
	socket_id: any
	words: list[Word] = field(default_factory=list)
	response: list[PlacedWord] = field(default_factory=list)
	score: int = 0

	def as_dict(self):
		return {
			"words": [w.value for w in self.words],
			"response": [w.as_dict() for w in self.response],
			"score": self.score
		}

class GamePhase(Enum):
	PRE_GAME = 0
	IN_GAME = 1
	RESULTS = 2

class RoundPhase(Enum):
	PLAY = 0
	WATCH = 1
	VOTE = 2
	RESULTS = 3

WORDS_PER_PLAYER = 20
ROUND_TIME = timedelta(minutes=2)

class GameManager:
	def __init__(self, max_players=6, num_rounds=5):
		self.players: dict[str, Player] = {}
		self.prompt_prefix = ""
		self.prompt = ""
		self.previous_prompts = []
		self.max_players = max_players
		self.rounds = num_rounds
		self.current_round = 0
		self.submitted = []
		self.voted = []
		self.votes = {}
		self.viewing_index = 0
		self.word_pile = [Word(w) for w in WordManager.get_random((max_players + 1) * WORDS_PER_PLAYER)]
		self.game_phase = GamePhase.PRE_GAME
		self.round_phase = RoundPhase.PLAY
		self.play_end_time = datetime.now()

	def add_player(self, display_name, socket_id):
		if self.game_phase != GamePhase.PRE_GAME:
			return False

		if len(self.players) < self.max_players and display_name not in self.players:
			self.players[display_name] = Player(socket_id=socket_id)
			self.votes[display_name] = 0
			return True
		return False
	
	def remove_player(self, socket_id):
		for username in self.players:
			if self.players[username].socket_id == socket_id:
				del self.players[username]
				return True
		return False

	def get_players(self):
		return self.players

	def username_from_socket(self, socket_id):
		for username in self.players:
			if self.players[username].socket_id == socket_id:
				return username
		return None
	
	def deal_words(self):
		'''
		Shuffles the word pile and deals words so that each player has WORDS_PER_PLAYER words
		'''
		random.shuffle(self.word_pile)
		for username in self.players:
			player = self.players[username]
			for _ in range(len(player.words), WORDS_PER_PLAYER):
				player.words.append(self.word_pile.pop())

	def start_round(self):
		self.round_phase = RoundPhase.PLAY

		self.voted = []
		self.submitted = []
		
		
		for username in self.players:
			# return any words in responses to the word pile
			player = self.players[username]
			for word in player.response:
				self.word_pile.append(word)
			player.response = []
			
			# clear any votes from previous rounds
			self.votes[username] = 0

		# Set prompt prefix
		self.prompt_prefix = PromptManager.get_random_prefix()

		# set prompt
		self.prompt = None
		while self.prompt == None:
			_prompt = PromptManager.get_random()
			if _prompt not in self.previous_prompts:
				self.prompt = _prompt
		
		self.deal_words()
		self.play_end_time = datetime.now() + ROUND_TIME

	def start_game(self):
		# if len(self.players) < 3:
		# 	return False
		
		if self.game_phase == GamePhase.PRE_GAME:
			self.game_phase = GamePhase.IN_GAME
			self.current_round = 1
			self.start_round()
			return True
		
		return False

	def vote_for_player(self, vote_for, from_socket_id):
		if self.game_phase != GamePhase.IN_GAME or self.round_phase != RoundPhase.VOTE:
			return False
		
		vote_from = self.username_from_socket(from_socket_id)

		if vote_from is None:
			return False

		if vote_for not in self.players or vote_from not in self.players:
			return False
		
		if vote_for == vote_from:
			return False
		
		if vote_from in self.voted:
			return False
		
		self.voted.append(vote_from)
		self.votes[vote_for] += 1
		self.players[vote_for].score += 1

		return True

	def submit_response(self, socket_id, words):
		if self.game_phase != GamePhase.IN_GAME or self.round_phase != RoundPhase.PLAY:
			return False

		if len(words) == 0:
			return False

		username = self.username_from_socket(socket_id)

		if username in self.submitted:
			return False

		if username is None:
			return False

		player = self.players[username]

		self.submitted.append(username)
		
		for word_data in words:
			color = word_data["color"]
			x = word_data["x"]
			y = word_data["y"]
			fontSize = word_data["fontSize"]
			rotation = word_data["rotation"]
			word = word_data["word"]

			placed_word = PlacedWord(color, x, y, fontSize, rotation, word)

		
			if word not in [w.value for w in player.words]:
				return False
			
			# remove word from player's words
			player.words = [w for w in player.words if w.value != word]
			player.response.append(placed_word)

		# if all players have submitted
		print('submit', len(self.submitted), len(self.players))
		if len(self.submitted) == len(self.players):
			self.round_phase = RoundPhase.WATCH
			self.viewing_index = 0
		
		return True

	def serialize_game_state(self):
		return json.dumps({
			"players": {k: v.as_dict() for k, v in self.players.items()},
			"max_players": self.max_players,
			"prompt_prefix": self.prompt_prefix,
			"prompt": self.prompt,
			"game_phase": self.game_phase.value,
			"round_phase": self.round_phase.value,
			"current_round": self.current_round,
			"round_end_time": self.play_end_time.isoformat(),
			"viewing_username": list(self.players.keys())[self.viewing_index] if len(self.players) > 0 else ""
		})