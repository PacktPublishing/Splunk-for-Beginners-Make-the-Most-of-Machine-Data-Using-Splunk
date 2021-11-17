# Splunk Web-App
### Build the image
```sh
cd splunk-webapp
docker image build -t splunk-webapp .
```
### Run the container
```sh
docker run -e SPLUNK_JWT='your jwt here' -e SPLUNK_HOST="127.0.0.1" -e SPLUNK_PORT="8089" -p 5000:5000  splunk-webapp
```