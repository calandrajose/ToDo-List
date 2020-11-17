const mongoose = require("mongoose");
const itemDao = require(__dirname + "/itemsDAO.js");

const listSchemma = new mongoose.Schema({ name: String, items: [itemDao.getItemsSchema()] });
const List = mongoose.model("List", listSchemma);

exports.newList = function (listName, defaultItems) {
    return new List({ name: listName, items: defaultItems });
};

exports.findList = function (newListname) {
    return List.findOne({ name: newListname }).exec();
};

exports.addItem = function(listName, newItem){
    List.findOne({ name: listName }, (err, foundList)=>{
        if(err){
            console.log(err);
        }else{
            foundList.items.push(newItem);
            foundList.save();
        }
    });
};

exports.deleteItem = function(listName, itemId){
    List.findOneAndUpdate({ name: listName }, {$pull:{items:{_id: itemId}}} ,(err, foundList)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Succesfully updated');
        }
    });
};
