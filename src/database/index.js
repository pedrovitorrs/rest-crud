const mongoose =  require('mongoose');

mongoose.connect('mongodb://root:MongoDB2019!@localhost:27017/noderest?authSource=admin', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true,  useFindAndModify: false});

module.exports = mongoose;