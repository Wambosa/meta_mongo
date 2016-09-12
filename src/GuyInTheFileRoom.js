"use strict";

module.exports = {
    getCustomMetaData: function(fileName){

        let person = fileName.split('/').splice(-1)[0].split('_');
        let fullName = person[0] + person[1];
        let docClass = person[2].split('.')[0];

        let appId = "";

        for(let i=0; i < fullName.length; i++) {
            let concatNumber = fullName.charAt(i).charCodeAt(0);
            appId += concatNumber;
        }

        return {
            applicationId: appId,
            documentClass: docClass,
            path: fileName,
            with: function(someNewProperty, someNewValue){
                this[someNewProperty] = someNewValue;
                return this;
            }
        }
    }
};