strings = [
    "кино | сущ неод ед ср | 122475",
    " *кина | сущ неод ед ср род | 4152854",
    "тор | сущ ед муж им | 34029",
    "аболиция | сущ неод ед жен им | 1190208",
]

filtered_words: set[str] = set()

for raw_line in strings:
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

    print(word_type, amount, cse)

    bad_chars = any([ch.lower() == ch.upper() for ch in word])
    if bad_chars:
        continue

    filtered_words.add(word)

print(filtered_words)
