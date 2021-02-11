---
index: 3
title: "Indexing & Mappings"
excerpt: "We will start learning about the Elasticsearch by looking at the core of the Elasticsearch – Indexing. We'll also delve into concepts like templates, aliases and mappings"
coverImage: "/assets/blog/indices/cover.jpeg"
date: "2021-01-17T05:35:07.322Z"
ogImage:
  url: "/assets/blog/indices/cover.jpg"
---

Elasticsearch is the distributed search and analytics engine at the heart of the Elastic Stack. Documents in Elasticsearch are represented in JSON format. JSON objects are written in key/value pairs. The data in Elasticsearch is organized into indices. Each index is a logical namespace for organizing data. The document is a basic unit of data in Elasticsearch

> A full-text index is much more complex than a key-value index but is based on a similar idea: given a word in a search query, find all the documents (web pages, product descriptions, etc.) that mention the word. This is implemented with a key-value structure where the key is a word (a term) and the value is the list of IDs of all the documents that contain the word (the postings list). In Lucene, this mapping from term to postings list is kept in SSTable-like sorted files, which are merged in the background as needed - Martin Kleppmann

![Architecture](https://res.cloudinary.com/sridatta7/image/upload/v1612189334/Architecture.png)

### Mappings

In Elasticsearch, mapping is a data model that describes the structure of a document. It allows you to specify fields, field types, relationships between documents, data conversion rules, and so on. Schema-less only means that documents can be indexed without specifying the schema in advance, because the schema is dynamically derived from the first document

```bash
PUT sample-1
{
  "mappings": {
    "properties": {
      "title": {
        "type": "keyword"
      },
      "description": {
        "type": "text"
      },
      "postedYearsAgo": {
        "type": "short"
      },
      "interest_rate": {
        "type": "scaled_float",
        "scaling_factor": 100
      },
      "geoip": {
        "type": "geo_point"
      },
      "ip": {
        "type": "ip"
      },
      "is_active_job": {
        "type": "boolean"
      },
      "last_modified": {
        "type": "date"
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```

### Index Templates

Index settings can be defined in index templates and applied when the index is created so that the settings can be reused. However, changing the template has no effect on any existing indices

```bash
PUT _template/logs
{
  "aliases": {
    "logs_sample": {}
  },
  "mappings": {
    "properties": {
      "field_1": {
        "type": "keyword"
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "index_patterns": ["logs-*"]
}
```

### Dynamic Templates

When you create an index, Elasticsearch lets you create templates for your mapping rules to augment the newly added fields with the supported mapping types. A mapping rule contains two parts: the matcher and the corresponding mapping datatype. The matcher can be performed on one of the following:

- The data type of the field: Using match_mapping_type for the datatype
- The name of the field: Using match pattern and/or unmatch pattern for the field name
- The full dotted path of the field: Using path_match and path_unmatch for the dotted path

```bash
PUT _template/sample
{
  "index_patterns": ["sample-*"],
  "mappings": {
    "dynamic_templates": [
      {
        "string_to_keywords": {
          "match_mapping_type": "string",
          "unmatch": "*_text",
          "mapping": {
            "type": "keyword"
          }
        }
      },
      "full_name": {
        "path_match":   "name.*",
        "path_unmatch": "*.middle",
        "mapping": {
          "type":       "text",
          "copy_to":    "full_name"
        }
      },
      {
        "longs_to_integers": {
          "match_mapping_type": "long",
          "mapping": {
            "type": "integer"
          }
        }
      },
      {
        "strings_to_text": {
          "match_mapping_type": "string",
          "match": "*_text",
          "mapping": {
            "type": "text"
          }
        }
      }
    ]
  }
}
```

### Aliases

The index aliases API allows you to create another name for an index or multiple indices and then use it as an alternative name in an index operation. The alias APIs give us flexibility in the following aspects

- Re-indexing with zero downtime
- Grouping multiple indices
- Views on a subset of documents

```bash
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "reqs",
        "alias": "BangaloreJobs",
        "filter": {
          "term": {
            "locations": "Bangalore"
          }
        }
      }
    }
  ]
}
```
