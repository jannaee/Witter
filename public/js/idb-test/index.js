import idb from 'idb';

var dbPromise = idb.open('test-db', 4, function(upgradeDb) {//upgradeDb is the upgrade callback resolves to a promise DB
  switch(upgradeDb.oldVersion) {//no breaks so that we have fallthrough
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval'); //creation of a store named keyval
      keyValStore.put("world", "hello");//placing value of world with key into that store
    case 1:
      upgradeDb.createObjectStore('people', { keyPath: 'name' });//creating another store of people with a point of reference named 'name' that we will pivot around for querying
    case 2:
      var peopleStore = upgradeDb.transaction.objectStore('people');//accessing the people store by first creating a transaction
      peopleStore.createIndex('animal', 'favoriteAnimal');//basically saying i want a column of animals based off of the favoriteAnimals datapoint
    case 3:
      peopleStore = upgradeDb.transaction.objectStore('people');//accessing the people store again with a transaction and creating a column of age based off of age that is pivoting around 'name'
      peopleStore.createIndex('age', 'age'); //https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex
  }
  // TODO: create an index on 'people' named 'age', ordered by 'age'
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:cat to keyval');
});

// add people to "people"
dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    favoriteAnimal: 'cat'
  });

  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    favoriteAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

// list all cat people
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('Cat people:', people);
});

// TODO: console.log all people ordered by age
dbPromise.then((db) =>{
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var ageIndex = peopleStore.index('age');
  return ageIndex.getAll();
}).then((people) => {
  console.log('People'+ people);
});