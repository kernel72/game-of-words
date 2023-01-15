# python 3.9 required
import sys
import json
from dataclasses import dataclass, asdict

DICTIONARY_PATH = "../../dicts/hagen-morf.txt"


@dataclass
class MainWord:
    word: str
    included_words: list[str]


def load_and_filter_words_from_dictionary(dictionary_path: str) -> set[str]:
    filtered_words: set[str] = set()

    print("Loading and filtering dictionary")

    with open(dictionary_path, "r") as fp:
        for raw_line in fp.readlines():
            line = raw_line.strip()

            if not line:
                continue

            raw_word, raw_opts, *_ = line.split("|")

            word = raw_word.strip()

            opts = raw_opts.strip().split(" ")

            cse = None
            if len(opts) == 4:
                word_type, is_live, amount, gender = opts

                if is_live not in ["неод", "од"]:
                    amount = is_live  # случай когда число идет вторым параметром
                    cse = gender

            elif len(opts) == 5:
                word_type, _, amount, _, cse = opts
            else:
                continue

            if (
                word_type.strip() != "сущ"
                or amount.strip() != "ед"
                or (cse is not None and cse.strip() != "им")
            ):
                continue

            bad_chars = any([ch.lower() == ch.upper() for ch in word])
            if bad_chars:
                continue

            filtered_words.add(word)
    return filtered_words


def check_literally_included(word: str, main_word: str) -> bool:
    main_word_map: dict[str, int] = {}
    for ch in main_word:
        if ch not in main_word_map:
            main_word_map[ch] = 0
        main_word_map[ch] += 1

    for ch in word:
        if ch not in main_word_map:
            return False

        main_word_map[ch] -= 1

        if main_word_map[ch] == 0:
            del main_word_map[ch]

    return True


def index_words(words_list: set[str]) -> list[MainWord]:

    sorted_words_list = sorted(words_list)

    print("Getting main words")

    main_words_index = list(
        map(
            lambda w: MainWord(word=w, included_words=[]),
            filter(lambda w: len(w) > 13, sorted_words_list),
        )
    )

    print("Indexing other words")

    for indx, word in enumerate(sorted_words_list):
        sys.stdout.write(f"\rProcessing word {indx + 1} / {len(words_list)}")

        for main_word in main_words_index:
            if len(word) >= len(main_word.word):
                continue

            if check_literally_included(word, main_word.word):
                main_word.included_words.append(word)

    sys.stdout.write("\n")
    return main_words_index


def main():
    dictionary = load_and_filter_words_from_dictionary(DICTIONARY_PATH)
    indexed_dictionary = index_words(dictionary)

    print("Saving indexed dictionary")
    with open("words-rus-index_py.json", "w", encoding="utf8") as fp:
        fp.write(
            json.dumps(
                list(map(lambda w: asdict(w), indexed_dictionary)), ensure_ascii=False
            )
        )


if __name__ == "__main__":
    main()
