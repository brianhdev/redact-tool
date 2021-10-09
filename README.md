# redact-tool

Redact keywords and phrases from a given text file.

## Foreward

Unfortunately due to the ambiguity of the requirements, I had to formulate certain assumptions for this given assignment:
- the requirements failed to mention whether or not the parameters had to be strictly command-line arguments, path references to input files, etc.
  - in this instance, I had created two files `input.txt` and `text.txt` which are to contain the arguments needed for this redaction tool
- there is some ambiguity regarding standard single and double quotes (e.g. '' and "") versus **curly** quotes (e.g. ‘’, “”)
  - the differences are very difficult to notice on first glance, but they're there (e.g. curly quotes uses a different character for open and close)
  - all instances I mentioned of said curly quotes, I had converted into single quotations (including regular, double quotes) for the sake of consistency
  - as a result, the phrases that were redacted from the raw input text file only removed the contents **between** its start and ending quotes, so regardless if the phrase was contained in single/double quotes, curly quotes, or none at all in the raw text file, it would be redacted nonetheless with its surrounding characters preserved

## Part 1


## Part 2


#### Credits

Brian Hong
