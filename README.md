# checkbox.io
A simple web application for hosting surveys

Forked Repository from https://github.com/chrisparnin/checkbox.io.git

Running Project
1. Git clone repository
2. Go into directory and install dependencies 
````
npm install
````

3. Export env variables
````
export MONGO_PORT=27017
export MONGO_IP=127.0.0.1
export MONGO_USER=mongo_user
export MONGO_PASSWORD=mongo_password
export MAIL_USER=mail
export MAIL_PASSWORD=mail
export MAIL_SMTP=mail
export APP_PORT=3002
````

4. Run node server
````
node server.js
````
---------

To run and configure nginx, go into directory local-conf
- Add location /api object from file default and paste into default file inside the object server {} located at:
````
/etc/nginx/sites-available/default
````
- Add following object into nginx.conf file inside the object http {} located at:
````
/etc/nginx/nginx.conf
````
Object:
````
upstream app_nodejs {
   server 127.0.0.1:3002;
}
````
Refer: /local-conf/nginx.conf

