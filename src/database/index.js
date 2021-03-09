const mongoose =  require('mongoose');

mongoose.connect('mongodb://root:MongoDB2019!@172.18.0.2:27017/noderest?authSource=admin', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

module.exports = mongoose;