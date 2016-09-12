"use strict";

var conf = require(`./conf.json`);
var fs = require('fs-extra-promise');
var guy = require('./src/GuyInTheFileRoom');
var MongoClient = require('mongodb').MongoClient;

function main(arg){

    let url = `mongodb://${conf.server}:${conf.port}/${conf.database}`;

    if(/--purge/.test(arg)){

        connectToMongoDB(url, conf.user, conf.pass)
            .then(function(db){
                console.log(`begin purge of all data created by instance ${conf.instanceIdentifier}`);
                return purgeInstanceData(db.collection(conf.collection), conf.instanceIdentifier)
                    .then(function(result){
                        console.log(result);
                        closeConnection(db);
                })
            })

    }else {

        discoverAllFiles(conf.folderPath)
            .then(function (fileList) {

                console.log(`discovered ${fileList.length} files to mark`);
                console.log(fileList);

                return connectToMongoDB(url, conf.user, conf.pass)
                    .then(function (db) {

                        console.log(`connection made to ${conf.server}:${conf.port}`);

                        let col = db.collection(conf.collection);

                        return col.count({instanceIdentifier: conf.instanceIdentifier})
                            .then(function (count) {
                                console.log(`there are ${count} records belonging to instance ${conf.instanceIdentifier}`);

                                return col.insertMany(fileList.map(function (fileName) {

                                    return guy.getCustomMetaData(fileName)
                                        .with("instanceIdentifier", conf.instanceIdentifier);

                                })).then(function (result) {
                                    console.log(`added ${result.insertedCount} documents`);
                                    return closeConnection(db);
                                });
                            })
                    })

            })
            .catch(console.error);
    }
}

function isJpeg(fileName){
    return /\.jpg/.test(fileName);
}

function discoverAllFiles(folder){

    return new Promise(function (resolve, reject){

        let fileNames = [];

        fs.walk(folder)
            .on('data', function (file) {
                fileNames.push(file.path.replace(/\\/g, '/'));})
            .on('end', function(){
                resolve(fileNames.filter(isJpeg));
            }).on('error', function(err){
            reject(err);
        });
    });
}


function connectToMongoDB (url, user, pass){
    return MongoClient.connect(url)
        .then(function(db){
            return db.authenticate(user, pass).then(function(){
                return Promise.resolve(db);
            });
        });
}


function closeConnection(db){
    return db.close();
}

//erases all data created by this the given instance(computer) key
function purgeInstanceData(collection, instanceIdentifier){
    return collection.deleteMany({
        instanceIdentifier: instanceIdentifier
    });
}

main(process.argv.splice(2));