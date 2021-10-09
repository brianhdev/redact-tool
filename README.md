# redact-tool

Redact keywords and phrases from a given text file.

## How to use
1. Add keywords/phrases to redact to `./input.txt`.
2. Add text of which to redact previously defined keywords/phrases to `./text.txt`.
3. In the root dir, run `npm install` if not already to install/update dependencies.
4. Run `npm start`, the redacted text should be outputted to `./redacted.txt`.

## Part 1

Please look at [index.ts](./index.ts) for the majority of commentary and implementation details.

Unfortunately due to the ambiguity of some of the requirements, I had to formulate certain assumptions for this given assignment:
- the requirements failed to mention whether or not the parameters had to be strictly command-line arguments, path references to input files, etc.
  - for this implementation, I have two default files `input.txt` and `text.txt` which are to contain the arguments needed for this redaction tool
- there is some ambiguity regarding standard single and double quotes (e.g. '' and "") versus **curly** quotes (e.g. ‘’, “”, what was used on the rubric)
  - the differences are very difficult to notice on first glance (e.g. curly quotes uses a different character for open and close)
  - all instances I mentioned of said curly quotes, I had converted into single quotations (including regular, double quotes) for the sake of consistency by the script
  - as a result, the phrases that were redacted from the raw input text file had only its contents **between** its start and ending quotes removed
    - so regardless whether or not the phrase was contained in single/double quotes, curly quotes, or none at all in the raw text file, the phrase contents would be redacted nonetheless with its surrounding characters preserved
- casing was not specified (whether or not to enforce strict case matches), so strict casing is enforced for redacting phrases and keywords

## Part 2

- Need BOTH a bulk storage solution (to contain redacted documents) and a database (to contain references to documents and its redacted items)
  - bulk storage (e.g. S3, HDFS, or some equivalent) requires less security, as documents had already been redacted
  - database, which has references to BOTH redacted documents and phrases/keywords, would require the most security due to association
  - a good tool to serve as a database and to facilitate full-text search would be elasticsearch
    - as elasticsearch operates as a cluster of nodes, the primary cluster must reside on secure government machines
    - a lot of the important nodes (master, ingest, data, and some client nodes) must reside there as well
    - internally, this would allow for other systems or APIs to interface with client nodes, allowing for said full-text-search functionality on internal apps/systems
  - with regards to external consumers, some measures would have to be in place
    - while the bulk storage solution is "unclassified" due to containing already redacted documents, the elasticsearch cluster and engine must be on "classified" systems
    - in order for consumer systems or APIs to be able to interface with said collection of redacted documents, some options could be:
      - create a "low-side" elasticsearch cluster with its own master and data nodes, however each data "object" would lack the associated redacted keywords/phrases by default
      - thus users would be forced to search using other stored metadata (e.g. date of creation, document title, etc.) to query redacted documents
        - this option would prevent any access to the "classified" cluster, as the lowside cluster and bulk data store would only need to interface with each other
      - another option could be that some "secure" bridge could exist between the classified cluster, and some lowside system (perhaps another ES cluster, an API or system)
        - query terms can be sent via the lowside system via a bridge to the classified ES cluster, where the search would be done in that classified environment
        - once search results (referenced to redacted documents) were found, said references would then be passed back that same bridge to whatever system lowside processed said request initially
        - unfortunately, due to my limited knowledge regarding secure implementation practices between classified and unclassified environments, I am unable to provide more sophisticated implementation details for said hypothetical "bridge"
  - Moreover, I am unsure what the utility of this system is
    - if users are able to query for redacted documents using various redacted phrases or keywords, would it not be also possible for external consumers to be able to create associations between said keywords/phrases and the returned documents?
    - moreover, would this not pose a potential national security threat? why should redacted documents be queried externally by its redacted terms?
      - I think at most, redacted documents should be queried externally by neutral, objective terms only (e.g. date of creation, title)

### Credit

Brian Hong
