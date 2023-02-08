# Available starting from python 3.11# type: ignore from typing import Self
from .game_session import GameSession, GameOptions
from resources.library import Library

class GameNotFoundException(Exception):
    error_key = 'GameNotFoundError'

class GameSessionsManager:
    __library_instance: Library
    __current_game_sessions: dict[str, GameSession] = {}

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(GameSessionsManager, cls).__new__(cls)
        return cls.instance

    def set_library(self, library: Library) -> None:
        self.__library_instance = library

    def createSession(self, options: GameOptions) -> GameSession:
        main_word = self.__library_instance.get_random_word()
        
        new_session = GameSession(main_word=main_word, game_options=options)

        # To provide uniqness and exclude id collisions
        while new_session.id in self.__current_game_sessions:
            new_session = GameSession(main_word=main_word, game_options=options)

        self.__current_game_sessions[new_session.id] = new_session
        return new_session
    
    def getSessionById(self, game_session_id: str) -> GameSession:
        if game_session_id not in self.__current_game_sessions:
            raise GameNotFoundException()
        
        return self.__current_game_sessions[game_session_id]
