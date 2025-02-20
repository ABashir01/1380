#!/bin/bash
# This is a student test

T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/../../$R_FOLDER" || exit 1

DIFF=${DIFF:-diff}

content=$(curl -s -k https://cs.brown.edu/courses/csci1380/sandbox/4/)

if $DIFF <(echo "$content" | c/getText.js | sort) <(sort "$T_FOLDER"/d/s_test_getText.txt) >&2;
then
    echo "$0 success: texts are identical"
    exit 0
else
    echo "$0 failure: texts are not identical"
    exit 1
fi