---
layout: post
image: /assets/article_images/2015-02-12-use-ruby-gems-with-hadoop-streaming/header.jpg
tags: aws hadoop ruby
---

# The problem

I wanted to run a ruby script that requires some gems on an EMR cluster.

# The solution

## Bootstraping

Code can be found [here](http://www.github.com/zachmoshe). Install some things. Run a cluster with the following definitions:

1. field1 = value1
1. field2 = value2
1. field3 = value3

Then submit the following job: `job job1 job2`

