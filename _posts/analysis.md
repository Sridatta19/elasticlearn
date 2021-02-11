---
index: 4
title: "Text Analysis"
excerpt: "We'll delve into analyzers. With a custom analyzer, you can define how the document fields behave before storing or during search time later. You have great control over how document fields are used in your queries to make your search more accurate and efficient. We'll first learn the tokenizers, and then the filters"
coverImage: "/assets/blog/analysis/cover.jpeg"
date: "2021-01-19T05:35:07.322Z"
ogImage:
  url: "/assets/blog/analysis/cover.jpg"
---

During an index operation, the contents of a document are processed by an analyzer and the generated tokens are used to build the inverted index. During a search operation, the query content is processed by a search analyzer to generate tokens for matching

### Components of an Analyzer

![Analyzer](https://res.cloudinary.com/sridatta7/image/upload/v1612138118/Analyzer.png)

The anatomy of an analyzer is broken up into three main parts

- Character Filter

  - The main function of a character filter is to convert the original input text into a stream of characters and then preprocess it before passing it as an input to the tokenizer

- Tokenizer

  - The tokenizer in the analyzer receives the output character stream from the character filters and splits this into a token stream, which is the input to the token filter.

- Token Filter

  - The main function of a token filter is to add, modify, or delete the characters of the output tokens from the tokenizer.

### Custom Analyzer

Elasticsearch gives you a way to customize your analyzer. The first step is to define the analyzer and then use it in the mappings. You must define the analyzer in the index settings. You can then define your analyzer either in an index or in an index template for multiple indices that match the index pattern. An analyzer must only have one tokenizer and, optionally, many character filters and token filters

```bash
PUT analysis-1
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "analyzer": "my_custom_analyzer"
      }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": [
            "lowercase"
          ]
        }
      }
    }
  }
}
```

Setting type to custom tells Elasticsearch that we are defining a custom analyzer. This example used tokenizer, token filters, and character filters with their default configurations, but it is possible to create configured versions of each and to use them in a custom analyzer.

Here is a more complicated example that combines the following:

- Character Filter - Mapping Character Filter, configured to replace :D with _happy_ and :P with _sarcasm_
- Tokenizer - Pattern Tokenizer, configured to split on punctuation characters
- Token Filters - Stop Token Filter, configured to use the pre-defined list of English stop words

```bash
PUT analysis-2
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "analyzer": "my_custom_analyzer_2"
      }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer_2": {
          "type": "custom",
          "tokenizer": "punctuation",
          "filter": [
            "lowercase",
            "english_stop"
          ],
          "char_filter": [
            "emoji"
          ]
        }
      },
      "filter": {
        "english_stop": {
          "type": "stop",
          "stopwords": "_english_"
        }
      },
      "tokenizer": {
        "punctuation": {
          "type": "pattern",
          "pattern": "[ .,!?]"
        }
      },
      "char_filter": {
        "emoji": {
          "type": "mapping",
          "mappings": [
            ":D => _happy_",
            ":P => _sarcasm_"
          ]
        }
      }
    }
  }
}

POST analysis-2/_analyze
{
  "analyzer": "my_custom_analyzer_2",
  "text": "The 3 :D Brown-Foxes jumped over the :P neighbour's fence"
}
```
