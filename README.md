# word-salad

very similar to NY Times Spelling Bee 🐝
https://www.nytimes.com/puzzles/spelling-bee
but all hand-made...

## todo
- [new puzzle] button
- pick levels / names / indicator (pie chart?)
- leader boards!

## setup
```bash

wget -qO- 'http://app.aspell.net/create?max_size=60&spelling=US&max_variant=0&diacritic=strip&download=wordlist&encoding=utf-8&format=inline' >| words-scowl.txt


# NO lame 's variants - and NO 's', period
# remove preamble
# lowercase
# 4+ letter words only
# nope
fgrep -vi s words-scowl.txt \
  |fgrep -A1000000 -- --- \
  |fgrep -v -- --- \
  |tr A-Z a-z \
  |egrep '^....' \
  |egrep -v nigge. \
  |sort -u -o words.txt

# find every pangram word containing 7 unique letters
cat words.txt \
  |nor 'const chars = [...new Set(line.split(""))]; if (chars.length === 7) log(line);' \
  |sort -u -o pangrams.txt
```

## helfpul links
- https://nytbee.com/

## sample analysis
```text
Number of Pangrams: 1
Maximum Puzzle Score: 74
Number of Answers: 25
Points Needed for Genius: 52
Genius requires between 8 and 23 words. You need at least a 6-letter word to reach genius. If you don't get the pangram, you need 90% of the total points to reach genius. If you get the pangram, you only need 62% of the remaining points to reach genius.
```
maybe dont allow ING or ED?
