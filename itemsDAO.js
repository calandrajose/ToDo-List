const mongoose = require("mongoose");

const itemSchemma = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", itemSchemma);

exports.newItem = function (itemName) {
  return new Item({ name: itemName });
};

exports.getItem = function(){
  return Item;
}

exports.getItemsSchema = function(){
  return itemSchemma;
}


exports.saveItem = function (item) {
  item.save((err) => {
    if (err) {
      console.log(err);
    }else{
      console.log('Success');
    }
  });
};

exports.saveManyItems = function (items) {
  Item.insertMany(items, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Success");
    }
  });
};

exports.deleteItem = function(id){
  Item.findByIdAndDelete((id), err => console.log(err));
};

/* exports.getItems = function(){
  return Item.find({}, (error, results)=>{
    if(error){
      console.log(error);
    }else{
      return results;    
    }
  });
}; */