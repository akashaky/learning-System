const express = require('express');
const app = express();
const port = 8000;
const db = require('./connection/mongoose');



app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('assests'));




app.use('/', require('./routes/index'));
app.listen(port, function(err){
    if(err){
        console.log('Error in running the server');
        return;
    }
    console.log(`Server is running on port ${port}`);
});