from secrets import token_urlsafe
from dataclasses import dataclass
from resources.library import MainWordRaw

from .main_word import MainWord


@dataclass
class GameOptions:
    minimal_word_length: int


@dataclass
class GameData:
    id: str
    main_word: MainWord
    found_words: set[str]
    options: GameOptions


class WordLengthIsLessThanRequiredException(Exception):
    error_key = "WordLengthIsLessThanRequiredError"

    def __init__(self, required_length: int) -> None:
        self.error_params = {"required_length": required_length}


class WordIsNotIncludedException(Exception):
    error_key = "WordIsNotIncludedError"


class WordIsAlreadyFoundException(Exception):
    error_key = "WordIsAlreadyFoundError"


class GameSession:
    __game_id: str
    __main_word: MainWord
    __found_words: set[str]
    __game_options: GameOptions

    def __init__(self, main_word: MainWordRaw, game_options: GameOptions) -> None:
        filtered_included_words = filter(
            lambda word: len(word) >= game_options.minimal_word_length,
            main_word.included_words,
        )

        self.__main_word = MainWord(
            word=main_word.word, included_words=set(filtered_included_words)
        )

        self.__game_id = token_urlsafe(8)
        self.__game_options = game_options
        self.__found_words = set()

    def check_and_apply_word(self, word: str) -> GameData:
        if len(word) < self.__game_options.minimal_word_length:
            raise WordLengthIsLessThanRequiredException(
                required_length=self.__game_options.minimal_word_length
            )

        if not self.__main_word.check_word_is_included(word):
            raise WordIsNotIncludedException()

        if word in self.__found_words:
            raise WordIsAlreadyFoundException()

        self.__found_words.add(word)

        return self.get_full_game_data()

    @property
    def id(self):
        return self.__game_id

    def get_full_game_data(self) -> GameData:
        return GameData(
            id=self.__game_id,
            main_word=self.__main_word,
            found_words=self.__found_words,
            options=self.__game_options,
        )
