# nevexo/shorturl
> Current Version: 1.0.0 (DOCKER HUB)

## Running inside of Docker
First of all, installer Docker. See [docker's website](https://docker.com) for information on this.

Now you need to pull it, 
```
docker pull nevexo/shorturl
```
To get the latest version, if this fails use: 
```
docker pull nevexo/shorturl:(Current Version shown at the top of this file)
```
Then you need to run
```
docker run -P --name shorturl-server nevexo/shorturl
```
The first time it runs, you'll see the admin token. You may stop the container and restart it with:
```
docker run -d -P --name shorturl-server nevexo/shorturl
```
### I forgot my token!
Don't panic, just stop the container
```
docker stop shorturl-server
```
and restart it with: 
```
docker start -i shorturl-server
```
OR
Relaunch the instance with port 3004 exposed, and navigate to it.

## Setting up on without Docker
Download all of the files, I'll add it to npm one day...

Install the latest version of node and npm
```
npm install
```
edit the config and disable the dockerPasswordRecovery server.
```
npm start
```


And that's all. Point your domain to the server and you're good to go, visit 

http://yourserver/admin/ui
