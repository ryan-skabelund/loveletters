import random

WORDS = [
    "cat",
    "mountain",
    "ocean",
    "city",
    "dream",
    "adventure",
    "friendship",
    "mystery",
    "journey",
    "garden",
    "tree",
    "river",
    "castle",
    "hero",
    "villain",
    "story",
    "magic",
    "forest",
    "desert",
    "island",
    "run",
    "jump",
    "whisper",
    "explore",
    "discover",
    "create",
    "imagine",
    "dance",
    "build",
    "transform",
    "sing",
    "laugh",
    "write",
    "draw",
    "cook",
    "travel",
    "learn",
    "teach",
    "grow",
    "play",
    "mysterious",
    "bright",
    "ancient",
    "joyful",
    "silent",
    "colorful",
    "brave",
    "quick",
    "gentle",
    "enormous",
    "delightful",
    "clever",
    "curious",
    "fierce",
    "calm",
    "loud",
    "warm",
    "cold",
    "smooth",
    "rough",
    "quickly",
    "silently",
    "happily",
    "mysteriously",
    "boldly",
    "gracefully",
    "eagerly",
    "carefully",
    "suddenly",
    "quietly",
    "bravely",
    "gently",
    "rapidly",
    "slowly",
    "calmly",
    "loudly",
    "softly",
    "cheerfully",
    "easily",
    "rarely",
    "above",
    "between",
    "underneath",
    "beyond",
    "within",
    "across",
    "against",
    "amongst",
    "beside",
    "through",
    "over",
    "under",
    "near",
    "far",
    "along",
    "amidst",
    "inside",
    "outside",
    "around",
    "before",
    "because",
    "although",
    "while",
    "since",
    "unless",
    "if",
    "when",
    "where",
    "until",
    "after",
    "before",
    "though",
    "even",
    "whether",
    "nor",
    "he",
    "she",
    "they",
    "it",
    "we",
    "you",
    "i",
    "them",
    "us",
    "him",
    "her",
    "this",
    "that",
    "these",
    "those",
    "which",
    "who",
    "whom",
    "whose",
    "someone",
    "-ing",
    "-es",
    "-ed",
    "-er",
] + ["-ly"] * 5 + \
    ["-s"] * 5 + \
    ["-est"] * 5 + \
    ["and"] * 10 + \
    ["but"] * 3 + \
    ["or"] * 3 + \
    ["yet"] * 3 + \
    ["so"] * 5

# List of love letter prompt prefixes
PREFIXES = [
    "Write a love letter to",
    "Express your love to",
    "Tell them how you feel about",
    "Pour your heart out to",
    "Write a letter to",
    "Confess your love to",
    "Declare your love for",
    "Sing the praises of",
]

# List of prompts for the LoveLetters game
# Write a love letter to...
# can be people, places, things, etc. anything that could be funny
# the funnier responses the better
PROMPTS = [
    "Your Grandmother",
    "Another Player",
    "The Oldest Player in Your Group",
    "Bananas",
    "Sardines",
    "A Toilet",
    "A Tree",
    "Your Best Friend",
    "A Rock",
    "A Pencil",
    "A Shoe",
    "A Sandwich",
]

class WordManager:
    @staticmethod
    def get_random(count: int):
        return random.sample(WORDS, count)

class PromptManager:
    @staticmethod
    def get_random():
        return random.choice(PROMPTS)
    
    @staticmethod
    def get_random_prefix():
        return random.choice(PREFIXES)