var common = require("./common")
  , odbc = require("../")
  , db = new odbc.Database()
  , iterations = 10000
  ;

db.open(common.connectionString, function(err){ 
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  issueQuery3(function () {
    finish();
  });
});

function issueQuery3(done) {
  var count = 0
    , time = new Date().getTime();
  
  var stmt = db.prepareSync('select 1 + ? as test');
    
  for (var x = 0; x < iterations; x++) {
    stmt.bind([2], function (err) {
      if (err) {
        console.log(err);
        return finish();
      }
      
      stmt.execute(cb);
    });
  }
  
  function cb (err, result) {
    if (err) {
      console.error(err);
      return finish();
    }
    
    result.closeSync();
    
    if (++count == iterations) {
      var elapsed = new Date().getTime() - time;
      
      console.log("%d queries issued in %d seconds, %d/sec : Prepare - Bind - Execute - CloseSync", count, elapsed/1000, Math.floor(count/(elapsed/1000)));
      return done();
    }
  }
}

function finish() {
  db.close(function () {
    console.log("connection closed");
  });
}
