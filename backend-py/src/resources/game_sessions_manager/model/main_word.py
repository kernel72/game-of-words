from resources.library import MainWordRaw

class MainWord(MainWordRaw):

    def check_word_is_included(self, word: str) -> bool:
        return len(word) < len(self.word) and word in self.included_words