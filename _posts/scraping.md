---
index: 2
title: "Scraping Data"
excerpt: "A walk through of basic web scraping in Node.js to retrieve job requisitions from Monster site. It's interesting to see how easy it could be scrape useful information from human-readable HTML pages with little effort"
coverImage: "/assets/blog/scraping/cover.jpeg"
date: "2021-01-14T05:35:07.322Z"
ogImage:
  url: "/assets/blog/scraping/cover.jpg"
---

Web Scraping is the technique of extracting data from websites. The term is used typically for automated data extraction. Cheerio is a library similar to jsdom, an HTML parser designed to use the same API as jQuery. We will scrape job requisitions from Monster using this tool

### Scraping requisitions from Monster.com

The first step in scraping the data is to load in the HTML. With cheerio, the preferred method is to pass in the document to load function. Since the `monster.com` returns only 25 results per page, we will need to loop the request and pass the pageNo as index to the url

```js
const jobType = "sales";
const html = await getHTML(
  `https://www.monsterindia.com/search/${jobType}-jobs-${index}?searchId=${SEARCH_ID}`
);
const $ = cheerio.load(html);
```

The secret sauce is the SEARCH_ID here. Monster accepts a universally unique identifier and you can pass [UUID v4](https://www.npmjs.com/package/uuid) (Universally unique identifier).

```js
const pageResults = $("#srp-jobList")
  .find(".card-panel")
  .map(convertEachEntryToDTO)
  .toArray();
```

The `Search ID` doesn't work beyond few pages, so you will need to add a simple retry mechanism. It will reinvoke the API with new Uuid after each HTTP error. It would help you retrieve thousands of results which you can write to a json file. Since elasticsearch bulk API works well with newline delimited JSON ([NDJSON](http://ndjson.org/)) format, we will need to make few modifications to the output before writing the content to a JSON. A sample `head -4 output.json` will return content like this

```json
{"index":{"_id":1}}
{"name":"Sales Marketing","company":"Yashodhara Management And Company","exp":"0-4 years","package":"Not Specified","posted":"Posted: 16 hours ago"}
{"index":{"_id":2}}
{"name":"hiring From Automobile Company","company":"Pawan Kumar (Proprietor of Pawan & Co)","exp":"1-6 years","package":"Not Specified","posted":"Posted: 6 hours ago"}
```

## Bulk Import of Documents

Bulk API performs multiple indexing or delete operations in a single API call. This reduces overhead and can greatly increase indexing speed. `POST /_bulk` provides a way to perform multiple create in a single request. The actions are specified in the request body using a newline delimited JSON (NDJSON) structure

```bash
curl 'Content-Type: application/x-ndjson' -X POST 'http://localhost:9200/jobs/_bulk?pretty' --data-binary @jobs.json > jobs_bulk.json
```
