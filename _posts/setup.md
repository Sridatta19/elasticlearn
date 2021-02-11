---
index: 1
title: "Downloading & Installing"
excerpt: "A brief write-up about preparing your environment. Includes setting up elasticsearch in your local/remote linux based environment. Also need kibana as it has UI for interacting with elasticsearch"
coverImage: "/assets/blog/search/cover.jpeg"
date: "2021-01-04T05:35:07.322Z"
ogImage:
  url: "/assets/blog/search/cover.jpg"
---

## System Configuration

#### /etc/security/limits.conf

On Linux systems, persistent limits can be set for a particular user by editing the /etc/security/limits.conf file. To set the maximum number of open files for the elasticsearch user, add the following line to the `limits.conf` file

```bash
elastic - nofile 65536
```

#### Virtual Memory

Elasticsearch uses a mmapfs directory by default to store its indices. The default operating system limits on mmap counts is likely to be too low, which may result in out of memory exceptions.

On Linux, you can increase the limits by adding the following line to `/etc/sysctl.conf`:

```bash
vm.max_map_count=262144
```

## Installation

Elasticsearch is available as a .tar.gz archive for Linux and MacOS

```bash
curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.10.2-linux-x86_64.tar.gz
tar -xzvf elasticsearch-7.10.2-linux-x86_64.tar.gz
```

#### Running Elasticsearch from the command line

To run Elasticsearch as a daemon, specify -d on the command line, and record the process ID in a file using the -p option

```bash
./bin/elasticsearch -d -p pid
```

This will allow us to shut down Elasticsearch easily. kill the process ID recorded in the pid file

```bash
pkill -F pid
```

#### Check that elasticsearch is running

You can test that your Elasticsearch node is running by sending an HTTP request to port 9200 on localhost

```bash
curl -X GET "localhost:9200/?pretty"
```

## Setting Up Kibana

The tar.gz packages are provided for installation on Linux and Darwin and are the easiest choice for getting started with Kibana.

```bash
curl -O https://artifacts.elastic.co/downloads/kibana/kibana-7.2.1-linux-x86_64.tar.gz
tar -xzvf kibana-7.2.1-linux-x86_64.tar.gz
```

Kibana can be started from the command line as follows:

```bash
./bin/kibana > /dev/null 2>&1 &
```
