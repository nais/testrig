# testrig

Process that continously verifies that our GCP clusters works as intended.

Also provides `/adhoc` endpoint for testing ondemand from e.g. github workflow.

Results are displayed in [Grafana dashboard](https://grafana.adeo.no/d/2hW2z1hMk/connectivity-tests?orgId=1)

External communication is now tested using check_clusters.sh, running from crontab on aura jenkins server. The script propagates metrics to prometheus via the pushgateway. 
The metrics are used for alerts if external communication in the gcp clusters is down. Results are displayed in [Grafana external communication dashboard](https://grafana.adeo.no/d/0s080ywMk/external-communication-nais-gcp?orgId=1) and alerts sent to slack.
