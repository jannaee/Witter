import idb from 'idb';

var dbPromise = idb.open('test-db', 1, function(upgradeDb) {
  //dbPromise will return a database object
  var keyValStore = upgradeDb.createObjectStore('keyval');
  keyValStore.put("world", "hello");
});


//if you want to read from the database you have to set up a transaction
// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello'); //.get passes in the key that you are interested in, or in this case hello
}).then(function(val) {
  console.log('value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {//adding another value to the object store
  var tx = db.transaction('keyval', 'readwrite');//tx is short for transaction additionally to make changes to an existing object store, the transaction must be in readwrite mode. 
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');//put returns a promise, allowing to not be stuck in the middle of a transaction
  return tx.complete;
}).then(function() {//this allows you to log a success message if everything goes as planned
  console.log('Added foo:bar to keyval');//
});

dbPromise.then(function(db) {
  // TODO: in the keyval store, set
  // "favoriteAnimal" to your favourite animal
  // eg "cat" or "dog"
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('dog', 'favoriteAnimal');
  return tx.complete;//this is a promise that fullfills if the entire transaction completes and rejects if fails
}).then(function(val){
  console.log('Favorite Animal is:', val);
});