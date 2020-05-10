# word-salad

very similar to NY Times Spelling Bee
https://www.nytimes.com/puzzles/spelling-bee
but all hand-made...

## todo
- 'delete char' button
- pick levels / names / indicator (pie chart?)

## setup
```bash

wget -qO- 'http://app.aspell.net/create?max_size=60&spelling=US&max_variant=0&diacritic=strip&download=wordlist&encoding=utf-8&format=inline' >| words-scowl.txt


# NO lame 's variants
# remove preamble
# lowercase
# 4+ letter words only
egrep -v "'s$" words-scowl.txt \
  |tr A-Z a-z \
  |fgrep -A100000 -- --- \
  |fgrep -v -- --- \
  |tr A-Z a-z \
  |egrep '^....' \
  |sort -u -o words.txt

```
