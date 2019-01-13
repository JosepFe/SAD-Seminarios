var mgdb = require("mongodb");
var assert = require("assert");

var mongoclient = mgdb.MongoClient;

var url = "mongodb://localhost:27017/almacen";

mongoclient.connect(
  url,
  function(err, db) {
    assert.equal(err, null);
    console.log("conectado");

    añadirACarrito(db, "muelles", 1);
    añadirACarrito(db, "hierros", 5);
    setTimeout(function() {
      quitarDelCarrito("hierros", 1);
    }, 1000);
  }
);

var carrito = [];

añadirACarrito = function(db, descripcion, cantidad) {
  var collection = db.collection("products");
  var exists = false;
  findProduct(descripcion, collection).then(function(x) {
    carrito.forEach(function(element) {
      if (element.desc == descripcion) {
        exists = true;
        var nuevaCantidad = element.cantidad + cantidad;
        if (nuevaCantidad < element.stock) {
          element.cantidad = nuevaCantidad;
          console.log("carrito:" + JSON.stringify(carrito));
        } else {
          console.log("no hay suficiente stock para " + element.desc);
        }
      }
    });
    if (!exists) {
      if (x.stock >= cantidad) {
        x.cantidad = cantidad;
        carrito.push(x);
        console.log("carrito:" + JSON.stringify(carrito));
      } else {
        console.log("no hay suficiente stock para " + x.desc);
      }
    }
  });
};

quitarDelCarrito = function(descipcion, cantidad) {
  var exists = false;
  carrito.forEach(function(element) {
    if (element.desc == descipcion) {
      exists = true;
      element.cantidad = element.cantidad - cantidad;
      if (element.cantidad <= 0) {
        var productIndex = findIndexWithAttr(carrito, "desc", descipcion);
        if (productIndex > -1) {
          carrito.splice(productIndex, 1);
        }
      }
    }
  });
  console.log("carrito:" + JSON.stringify(carrito));
  if (!exists) {
    console.log(
      "no se ha encontrado ningun producto con la descripción: " + descipcion
    );
  }
};

findProduct = function(descripcion, collection) {
  return new Promise((resolve, reject) => {
    collection.findOne({ desc: descripcion }, (err, result) => {
      //error handler
      if (err) {
        // Reject the Promise with an error
        return reject(err);
      }
      // Resolve (or fulfill) the promise with data
      return resolve(result);
    });
  });
};

function findIndexWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
