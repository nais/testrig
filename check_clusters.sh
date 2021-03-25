#!/usr/bin/env bash

clusters=("ci-gcp" "dev-gcp")
for cluster in $clusters; do
  #result=$(curl -s https://testrig.${cluster}.nais.io/adhoc > ${cluster}.json)
  success=$(cat ${cluster}.json |jq -r .success)

  if [[ "${success}" == "false" ]]; then
    cat ${cluster}.json | jq -r .markdown | grep ":red_circle:"
  fi


done
