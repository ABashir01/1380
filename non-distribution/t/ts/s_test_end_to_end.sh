#!/bin/bash
# This is a student test

T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/../..$R_FOLDER" || exit 1

url="https://cs.brown.edu/courses/csci1380/sandbox/3/"

echo "Hello"

# I need to get the throughput of the crawl subsytem
start_time=$(date +%s)
for i in $(seq 1 10);
do
    ./crawl.sh $url >d/content.txt
done
end_time=$(date +%s)
crawl_time=$((end_time-start_time))
crawl_throughput=$((10/crawl_time))

# I need to get the throughput of the index subsytem
start_time=$(date +%s)
for i in $(seq 1 10);
do
    ./index.sh d/content.txt $url
done
end_time=$(date +%s)
index_time=$((end_time-start_time))
index_throughput=$((10/index_time))

# I need to get the throughput of the query subsytem
start_time=$(date +%s)
for i in $(seq 1 10);
do
    ./query.js "the"
done
end_time=$(date +%s)
query_time=$((end_time-start_time))
query_throughput=$((10/query_time))

echo "Crawl time: $crawl_time"
echo "Index time: $index_time"
echo "Query time: $query_time"
echo "Crawl throughput: $crawl_throughput"
echo "Index throughput: $index_throughput"
echo "Query throughput: $query_throughput"





