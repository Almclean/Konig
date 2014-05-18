Konig
=====

Al and Ivan's awesome business, which will make them uber rich

How to Run
==========

Download the code by cloning the git repo, or if you've already checked it out then just do git pull master

Make sure you've got the latest version of Node.JS and NPM installed on your machine.  Not sure about Windows capability here, but if it's a mac or a linux box then just do something like :

> Linux : sudo apt-get install npm node
> Mac : brew install npm node

Once that's down, you should run the following in the root directory of the repository :

> npm install

That'll drag down all the deps and should get you everything you need.  If this screws up for whatever reason then you'll need to delete the directory and start again, as Npm doesn't recover well from partial installations.

Once that's sorted then run :

> node bin/www

And you should be able to browse to **http://localhost:3001** to see the project in all it's shining glory !

 