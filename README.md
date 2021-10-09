# redact-tool

Redact keywords and phrases from a given text file.

## How to use
1. Add keywords/phrases to redact to `./input.txt` (make sure they are all on the first line only).
2. Add text of which to redact previously defined keywords/phrases to `./text.txt`.
3. In the root dir, run `npm install` if not already to install/update dependencies.
4. Run `npm start`, the redacted text should be outputted to `./redacted.txt`.


## Please Note

Unfortunately due to the ambiguity of some of the requirements, I had to formulate certain assumptions for this given assignment:
- the requirements failed to mention whether or not the parameters had to be strictly command-line arguments, path references to input files, etc.
  - in this instance, I have two default files `input.txt` and `text.txt` which are to contain the arguments needed for this redaction tool
- there is some ambiguity regarding standard single and double quotes (e.g. '' and "") versus **curly** quotes (e.g. ‘’, “”)
  - the differences are very difficult to notice on first glance (e.g. curly quotes uses a different character for open and close)
  - all instances I mentioned of said curly quotes, I had converted into single quotations (including regular, double quotes) for the sake of consistency by the script
  - as a result, the phrases that were redacted from the raw input text file, had only its contents **between** its start and ending quotes removed
    - so regardless whether or not the phrase was contained in single/double quotes, curly quotes, or none at all in the raw text file, the phrase contents would be redacted nonetheless with its surrounding characters preserved
- casing was not specified (whether or not to enforce strict case matches), so strict casing is enforced for redacting phrases and keywords

## Part 1

Please look at [index.ts](./index.ts) for the majority of commentary and implementation details.

## Part 2

### Storing Redacted Documents, While Still Making Them Searchable

With regards to overall architecture, there will have to be both a form of bulk storage (e.g. S3, HDFS, or equivalent) to store the various redacted documents (some could be very large), as well as a database to contain references to said stored documents. I think as we want this to be searchable, a search-optimized database solution such as Elasticsearch would work the best. For example, a given document in es could contain a primary key or hash, a reference to the stored redacted document, various metadata (e.g. title, date of creation), and a reference to another document in a different index which while sharing the same primary key, instead contains all of the keywords that had been redacted.

As elasticsearch typically operates as a cluster of nodes, the majority (at least the master, ingestion, and some data nodes) should be hosted on secure, government machines. Furthermore, at least two indices should exist that keep references to the redacted documents themselves, and references to a given documents' redacted keywords separate. However, as only the redacted documents are being stored in some sort of bulk storage solution, security around those instances can be relatively loose. Moreover, client nodes can be created for both internal, secure government systems to interface with other systems of APIs to interface with.


### Credit

Brian Hong
