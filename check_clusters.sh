#!/usr/bin/env bash
# Script for checking external communication from gcp clusters

export no_proxy=".nais.io,prometheus-pushgateway.nais.adeo.no"
declare -a clusters=("dev-gcp" "prod-gcp")

for cluster in "${clusters[@]}"; do
  result=$(curl -s https://testrig.${cluster}.nais.io/adhoc > ${cluster}.json)

  while read -r httpstest; do
    testname=$(echo ${httpstest} | cut -d"(" -f1 |sed 's/ -> https:\/\//_/g' | tr '.' '_'| tr '-' '_')
    prefix=$(echo ${cluster}|cut -d- -f1)

    if [ "$(echo ${httpstest} |grep ':red_circle:')" != "" ]; then
      echo "${prefix}_${testname} 1" | curl -k --data-binary @- https://prometheus-pushgateway.nais.adeo.no/metrics/job/testrig/cluster/prod-fss
    else
      echo "${prefix}_${testname} 0" | curl -k --data-binary @- https://prometheus-pushgateway.nais.adeo.no/metrics/job/testrig/cluster/prod-fss
    fi

  done < <(cat ${cluster}.json | jq -r .markdown | grep https)
done
