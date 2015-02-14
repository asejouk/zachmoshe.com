---
layout: post
image: /assets/article_images/2015-02-12-use-ruby-gems-with-hadoop-streaming/header.jpg
tags: aws hadoop ruby
---

For some data processing we do at work, I wanted to use [Hadoop Streaming](http://hadoop.apache.org/docs/r1.2.1/streaming.html) to run through a file with my ruby mapper code. I've used ruby and Hadoop Streaming in the past, but normally just for simple scripts that didn't require anything else but the standard packages that come with every installation of ruby.

This time, I had to use some gems, and my code was a bit larger, so I got into some corners of different ruby versions (`Array#to_h` only exists from ruby 2.1). While I could work out around the ruby versions and write my code so it's compatible with ruby 1.8.7 (which is normally installed by default), I had to use the external packages and wanted to 'do it right'. No hacks, no manual installations on the cluster and nothing that can't be easily reproduced on other clusters (we use [EMR](http://aws.amazon.com/elasticmapreduce) so I spin clusters almost every day).


## Things to take care of

### Enforce a specific ruby version

Replacing Amazon's image seemed like an overkill to me, but I want to make sure I know what ruby version I'm running with (and since I'm living in the 21st century, i'd like it to be at least 2.1.0...)

### Cluster should be agnostic to the jobs

First, the 'cluster creation' part involves `CloudFormation` and `Data Pipeline` - both are parts of my system that I don't really want to change frequently, especially not when an applicative code changes a bit and requires a new package.  
Second, the same cluster serves few jobs (all doing parts of the data processing) and obvisouly I didn't want a centric place that 'knows' about all dependencies and installs them on the machines.

## My solution - Bootstraping + Bundler

### Bootstraping the EMR machines

This part will install a known version of ruby on the machines. Yes, it is kind-of-bundling the cluster to the jobs (two different jobs might want to run with different ruby versions), but that seemed to me as a reasonable compromise and if you really insist, you can overcome this limitation (explained later).

I've used [`rbenv`](https://github.com/sstephenson/rbenv) and the [`rbenv build`](https://github.com/sstephenson/ruby-build) plugin to install ruby. The following script was used as a [bootstrap action](http://docs.aws.amazon.com/ElasticMapReduce/latest/DeveloperGuide/emr-plan-bootstrap.html):

{% highlight bash %}
sudo apt-get install git
git clone rbenv ~/.rbenv
git clone rbenv-build ~/.rbenv/plugins/rbenv-build
rbenv install 2.1.4
rbenv global 2.1.4

echo "DONE!"

{% endhighlight %}

At the end of this stage, user `hadoop` on all machine will have installed the specific ruby version you asked for and all your jobs will use this one.


## Using bundler to pack together all dependencies


Code can be found [here](http://www.github.com/zachmoshe). Install some things. Run a cluster with the following definitions:

1. field1 = value1
1. field2 = value2
1. field3 = value3

Then submit the following job: `job job1 job2`

