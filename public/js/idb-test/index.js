import idb from 'idb';

var dbPromise = idb.open("test-db", 1, function(upgradeDb){
    var keyValStore = upgradeDb.createObjectStore('keyval');
    keyValStore.put('who dat','I said');
});

//to read from a database- create a transaction
dbPromise.then(function(db))