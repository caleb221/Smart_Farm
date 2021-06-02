var r = require('rethinkdb');

//=======
//connect


r.connect({db:'test'},function(err,conn)
	{
		if (err) throw err;
		//stuff..
	});
//can also be var promise = r.connect(...);

//=====
//close
//conn.close(function(err){if (err) throw err;})

//reconnect
//conn.reconnect([{noreplyWait: true}, ]callback)

//select database
//conn.use('dbName')

/* CREATE A TABLE
r.db('testdb').tableCreate('tableName').run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})
 */


//===========
//insert data




r.table('authors').insert([//JSON DATA OBJECT
/*  
{ name: "William Adama", tv_show: "Battlestar Galactica",
      posts: [
        {title: "Decommissioning speech", content: "The Cylon War is long over..."},
        {title: "We are at war", content: "Moments ago, this ship received word..."},
        {title: "The new Earth", content: "The discoveries of the past few days..."}
      ]
    },
    { name: "Laura Roslin", tv_show: "Battlestar Galactica",
      posts: [
        {title: "The oath of office", content: "I, Laura Roslin, ..."},
        {title: "They look like us", content: "The Cylons have the ability..."}
      ]
    },
    { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
      posts: [
        {title: "Civil rights", content: "There are some words I've known since..."}
      ]
    }
*/
//gives me automatic ID named id
]).run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})



//retrieve data
r.table('tableName').run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});







//==========================
//filter data (SELECT WHERE ___ EQ ___ )
r.table('tableName').filter(r.row('dataName').eq("desiredInput")).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });

//filter on amount of data
//switch 2 to desired amount of data
r.table('tableName').filter(r.row('DataRow').count().gt(2/*change this*/)).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });







