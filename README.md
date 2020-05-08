# word-salad

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