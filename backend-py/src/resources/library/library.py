# Available starting from python 3.11
# from typing import Self

from random import randint
from json import load
from dataclasses import dataclass

@dataclass(frozen=True)
class MainWordRaw:
    word: str
    included_words: set[str]


def decode_to_main_word(obj: dict[str, str]) -> MainWordRaw:
    return MainWordRaw(word=obj["word"], included_words=set(obj["included_words"]))


class Library:

    __words_index: tuple[MainWordRaw]

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Library, cls).__new__(cls)
        return cls.instance        
    
    def load_dictionary_index(self, dictionary_index_json_path: str) -> None:
        print(f"Loading words index from {dictionary_index_json_path}")

        with open(dictionary_index_json_path, "r", encoding="utf8") as fp:
            self.__words_index = tuple(load(fp, object_hook=decode_to_main_word))
        print(f"Index loaded")

    def get_random_word(self) -> MainWordRaw:
        if not self.__words_index:
            raise Exception("Library is not loaded")

        random_index = randint(0, len(self.__words_index))
        return self.__words_index[random_index]
