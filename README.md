# meta_mongo
_we need to retrieve a binary file at a later time using any custom metadata point_

### this is a simple script that:
- walks a directory of files
- sets custom metadata
- records the file location
- saves the data in a mongo database

#usage
- ```node ./index.js``` (uses the conf.json to complete aforementioned tasks)
- ```node ./index.js --purge``` (handy for cleaning up test data generated from workstations)

#example conf.json file
```
{
    "instanceIdentifier": "myComputerName",
    "user": "mongo_user",
    "pass": "secret",
    "server": "ec2-99-100-101-102.compute-1.amazonaws.com",
    "port": 27017,
    "database": "myDatabaseName",
    "collection": "myCollectionName",
    "folderPath": "/work/bigdata"
}
```

### notes
- used in conjunction with an orangefs cluster to augment orangefs searching capabilities
- ```GuyInFileRoom.js``` represents all the custom metadata needs for the prototype. (fakeData generation)
- This module is **not** highly configurable. For instance; ```index.js:60 isJpeg``` filters out files in the walked directory. Modification of source is required to encompass different use cases