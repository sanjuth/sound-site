var moong = require('mongoose');
 
var audioSchema = new moong.Schema({
    name: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
module.exports = new moong.model('Audio', audioSchema);