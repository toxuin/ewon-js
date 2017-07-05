var requestify = require("requestify");

var Talk2M = function(cred) {
    if (!cred || !cred.t2mdeveloperid || !cred.t2maccount || !cred.t2musername || !cred.t2mpassword) {
        console.log("WARNING: NO CREDENTIALS SPECIFIED!!!");
    } else {
        credentials = cred;
    }
    
    if (!(this instanceof Talk2M)) {
        return new Talk2M(cred);
    }
};

var serverURL = "https://m2web.talk2m.com/t2mapi";
var credentials;

Talk2M.prototype.getAccountInfo = function(callback) {
    requestify.post(buildUrl("getaccountinfo"))
        .then(function(response) {
            callback(null, JSON.parse(response.body));
        })
        .fail(function(response) {
            callback(JSON.parse(response.body));
        });
};

Talk2M.prototype.getEwons = function(callback) {
    requestify.post(buildUrl("getewons"))
        .then(function(response) {
            callback(null, JSON.parse(response.body));
        })
        .fail(function(response) {
            callback(JSON.parse(response.body));
        });
};

Talk2M.prototype.getEwon = function(name, callback) {
    if (!name) return callback(new Error("eWon Name ID not specified!"));
    requestify.post(buildUrl("getewon", "name=" + name))
        .then(function(response) {
            callback(null, JSON.parse(response.body));
        })
        .fail(function(response) {
            callback(JSON.parse(response.body));
        });
};

Talk2M.prototype.readTags = function(ewon, callback) {
    if (!ewon || !ewon.name || !ewon.m2webServer) return callback(new Error("eWon not specified!"));
    if (!ewon.login || !ewon.password) return callback(new Error("eWon device credentials not specified!"));
    requestify.post(buildEwonUrl(ewon, "/rcgi.bin/ParamForm", "AST_Param=$dtIV$ftT"))
        .then(function(response) {
            callback(null, response.body);
        })
        .fail(function(response) {
            callback(response.body);
        });
};

Talk2M.prototype.writeTag = function(ewon, tagName, tagValue, callback) {
    if (!ewon || !ewon.name || !ewon.m2webServer) return callback(new Error("eWon not specified!"));
    if (!ewon.login || !ewon.password) return callback(new Error("eWon device credentials not specified!"));
    requestify.post(buildEwonUrl(ewon, "/rcgi.bin/UpdateTagForm", "TagName1=" + tagName + "&TagValue1=" + tagValue))
        .then(function(response) {
            callback(null, response.body);
        })
        .fail(function(response) {
            callback(response.body);
        });
};

function buildUrl(action, params) {
	var result = serverURL + "/" + action + "?t2mdeveloperid=" + credentials.t2mdeveloperid 
                    + "&t2maccount=" + credentials.t2maccount 
                    + "&t2musername=" + credentials.t2musername 
                    + "&t2mpassword=" + credentials.t2mpassword;
    if (params) result += "&" + params;
    return result;
}

function buildEwonUrl(ewon, path, query) {
    var result = "https://" + ewon.m2webServer + "/t2mapi/get/" + ewon.name + "/" + path + "?";
    if (query) result += query + "&";
    result += "t2mdeviceusername=" + ewon.login + "&t2mdevicepassword=" + ewon.password
        + "&t2mdeveloperid=" + credentials.t2mdeveloperid 
        + "&t2maccount=" + credentials.t2maccount 
        + "&t2musername=" + credentials.t2musername 
        + "&t2mpassword=" + credentials.t2mpassword;
    //console.log(result);
    return result;
}

module.exports = Talk2M;
