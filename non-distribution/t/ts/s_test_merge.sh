#!/bin/bash
# This is a student test

T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/../..$R_FOLDER" || exit 1

cat /dev/null > d/s_global-index.txt

DIFF=${DIFF:-diff}
DIFF_PERCENT=${DIFF_PERCENT:-0}

files=("$T_FOLDER"/d/s_m{1..4}.txt)

for file in "${files[@]}"
do
    cat "$file" | c/merge.js d/s_global-index.txt > d/s_temp-global-index.txt
    mv d/s_temp-global-index.txt d/s_global-index.txt
done

if DIFF_PERCENT=$DIFF_PERCENT t/gi-diff.js <(sort d/s_global-index.txt) <(sort "$T_FOLDER"/d/s_m5.txt) >&2;
then
    echo "$0 success: global indexes are identical"
    exit 0
else
    echo "$0 failure: global indexes are not identical"
    exit 1
fi