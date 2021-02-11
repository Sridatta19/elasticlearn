---
index: 5
title: "Queries"
excerpt: "the goal behind learning concepts is to execute the query and get results from the index. The Search API allows you to perform a search query and return the search hits that match the query"
coverImage: "/assets/blog/query/cover.jpeg"
date: "2021-01-20T05:35:07.322Z"
ogImage:
  url: "/assets/blog/query/cover.jpg"
---

## Searching Data

A search query, or query, is a request for information about data in Elasticsearch data streams or indices. A search consists of one or more queries that are combined and sent to Elasticsearch. Documents that match a search’s queries are returned in the hits, or search results, of the response.

#### Match Query

Returns documents that match a provided text, number, date or boolean value. The provided text is analyzed before matching.

```bash
GET reqs/_search
{
  "query": {
    "match": {
      "title": "Accounting Manager"
    }
  }
}
```

#### Match Phrase Query

The match_phrase query analyzes the text and creates a phrase query out of the analyzed text

```bash
GET reqs/_search
{
  "query": {
    "match_phrase": {
      "title": "Accounting Manager"
    }
  }
}
```

#### Multi-Match Query

The multi_match query builds on the match query to allow multi-field queries

```bash
GET reqs/_search
{
  "query": {
    "multi_match": {
      "query": "Pune",
      "fields": ["title", "locations"]
    }
  }
}
```

#### Match Phrase Query

Returns documents based on a provided query string, using a parser. This query uses a simple syntax to parse and split the provided query string into terms based on special operators. The query then analyzes each term independently before returning matching documents.

```bash
GET _search
{
  "query": {
    "query_string": {
      "default_field": "title",
      "query": "(pune AND Accounting) OR (Sales AND manager)"
    }
  },
  "_source": ["title", "locations", "jobId"]
}
```

#### Term Query

Returns documents that contain an exact term in a provided field. You can use the term query to find documents based on a precise value such as a price, a product ID, or a username.

```bash
GET reqs/_search
{
  "query": {
    "terms": {
      "locations.keyword": [
        "Pune",
        "Delhi"
      ]
    }
  },
  "_source": [
    "title",
    "locations"
  ]
}
```

#### Wildcard Query

Returns documents that contain terms matching a wildcard pattern. A wildcard operator is a placeholder that matches one or more characters. For example, the \* wildcard operator matches zero or more characters. You can combine wildcard operators with other characters to create a wildcard pattern.

```bash
GET reqs/_search
{
  "query": {
    "wildcard": {
      "title.keyword": {
        "value": "*Account"
      }
    }
  },
  "_source": "title"
}
```

### Compound Queries

This class of queries can be used to combine one or more queries to come up with a more complex query. Some compound queries convert scoring queries into non-scoring queries and combine multiple scoring and non-scoring queries.

#### Boolean Query

A query that matches documents matching boolean combinations of other queries. The bool query maps to Lucene BooleanQuery. It is built using one or more boolean clauses, each clause with a typed occurrence. If you are come from an SQL background, you already know how to filter based on multiple AND and OR conditions in the WHERE clause. The bool query allows you to combine multiple scoring and non-scoring queries.

```bash
GET reqs/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "locations.keyword": {
              "_name": "location_query",
              "value": "Pune"
            }
          }
        }
      ],
      "must_not": [
        {
          "term": {
            "title.keyword": {
              "_name": "title_query",
              "value": "Accountant "
            }
          }
        }
      ],
      "should": [
        {
          "term": {
            "functions.keyword": {
              "_name": "functions_query_1",
              "value": "Banking"
            }
          }
        },
        {
          "term": {
            "functions.keyword": {
              "_name": "functions_query_2",
              "value": "IT"
            }
          }
        }
      ],
      "minimum_should_match": 1,
      "filter": {
        "term": {
          "industries.keyword": "Insurance"
        }
      }
    }
  },
  "_source": ["locations", "title", "functions", "industries"]
}
```

### Highlighting

Highlighters enable you to get highlighted snippets from one or more fields in your search results so you can show users where the query matches are. When you request highlights, the response contains an additional highlight element for each search hit that includes the highlighted fields and the highlighted fragments

```bash
GET reqs/_search
{
  "highlight": {
    "pre_tags": ["<b>"],
    "post_tags": ["</b>"],
    "fields": {
      "title": {}
    }
  },
  "query": {
    "match": {
      "title": "Accounting"
    }
  },
  "_source": "title"
}
```

### Sort Search Results

Allows you to add one or more sorts on specific fields. Each sort can be reversed as well. The sort is defined on a per field level, with special field name for \_score to sort by score, and \_doc to sort by index order.

```bash
GET reqs/_search
{
  "sort": [
    {
      "createdAt": {
        "order": "desc"
      }
    },
    {
      "jobId": {
        "order": "desc"
      }
    }
  ],
  "query": {
    "match": {
      "title": "Accounting"
    }
  }
}
```

### Paginate Search Results

By default, searches return the top 10 matching hits. To page through a larger set of results, you can use the search API's from and size parameters. The from parameter defines the number of hits to skip, defaulting to 0. The size parameter is the maximum number of hits to return. Together, these two parameters define a page of results.

```bash
GET reqs/_search
{
  "from": 15,
  "size": 10,
  "query": {
    "match": {
      "title": "Accounting"
    }
  }
}
```

### Fuzzy Queries

With the fuzziness parameter, we can turn the match query into a fuzzy query. This fuzziness is based on the Levenshtein edit distance, to turn one term into another by making a number of edits to the original text. Edits can be insertions, deletions, substitutions, or the transposition of characters in the original term. The fuzziness parameter can take one of the following values: 0, 1, 2, or AUTO. Fuzziness is Maximum edit distance allowed for matching.

```bash
GET sales/_search
{
  "sort": [
    {
      "_score": {
        "order": "asc"
      }
    }
  ],
  "query": {
    "fuzzy": {
      "desc": {
        "value": "rgent",
        "fuzziness": 1
      }
    }
  }
}
```

If we wanted to still allow more room for errors to be correctable, the fuzziness should be increased to 2. For example, a fuzziness of 2 will even match Benkinh. Banking is two edits away from Benkinh:

```bash
GET reqs/_search
{
  "query": {
    "fuzzy": {
      "functions.keyword": {
        "value": "Benkinh",
        "fuzziness": 2
      }
    }
  },
  "_source": "functions"
}
```
