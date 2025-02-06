
function serialize(object) {
  serialized_object = null;

  // Null is a weird case, apparently
  if (object === null) {
    serialized_object = { type: "Null", value: `${object}` };
    return JSON.stringify(serialized_object);
  }

  switch (typeof(object)) {
    case 'number':
      serialized_object = { type: "Number", value: `${object}` };
      break;
    case 'string':
      serialized_object = { type: "String", value: `${object}` };
      break;
    case 'boolean':
      serialized_object = { type: "Boolean", value: `${object}` };
      break;
    case 'undefined':
      serialized_object = { type: "Undefined", value: `${object}` };
      break;
    case 'function':
      serialized_object = { type: "Function", value: object.toString() };
      break;
    case 'object':
      if (Array.isArray(object)) {
        let myArray = [];
        for (let i = 0; i < object.length; i++) {
          // object[i] = serialize(object[i]);
          myArray.push(serialize(object[i]));
        }
        console.log("myArray: " + myArray);
        serialized_object = { type: "Array", value: myArray };
        console.log("Serialized Object: " + serialized_object);
      }
      else if (object instanceof Date) {
        serialized_object = { type: "Date", value: object.toISOString() };
      }
      else if (object instanceof Error) {
        serialized_object = { type: "Error", value: object.toString().replace("Error: ", "").trim() };
      }
      else {
        let myObject = {};
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            myObject[key] = serialize(object[key]);
          }
        }
        serialized_object = { type: "Object", value: myObject };
      }
      break;
  }

  return JSON.stringify(serialized_object);
}


function deserialize(string) {

  let object = null;
  // Turn the string into an object
  try {
    object = JSON.parse(string);

    console.log("Parsed");

    // Check the type of the object
  switch (object["type"]) {
    case 'Number':
      return Number(object.value);
    case 'String':
      return object.value;
    case 'Boolean':
      return object.value === 'true';
    case 'Null':
      return null;
    case 'Undefined':
      return undefined;
    case 'Function':
      return new Function('return ' + object.value)();
    case 'Date':
      return new Date(object.value);
    case 'Error':
      return Error(object.value);
    case 'Array':
      let myArray = object.value;
      let deserializedArray = [];
      console.log("Type of myArray: " + typeof(myArray));
      console.log("Array is array: " + Array.isArray(myArray));
      console.log("myArray: " + myArray);
      for (let i = 0; i < myArray.length; i++) {
        deserializedArray.push(deserialize(myArray[i]));
      }
      return deserializedArray;
    case 'Object':
      let myObject = object.value;
      let deserializeObject = {};
      for (const key in myObject) {
        if (myObject.hasOwnProperty(key)) {
          deserializeObject[key] = deserialize(myObject[key]);
        }

      }
      return deserializeObject;
  }
  }
  catch (e) {

    console.log("Fuck");
    console.log("Error:", e);
    console.log(string);

    // switch (string['type']) {
    //   case 'Array':
    //     myArray = JSON.parse(string.value);
    //     for (let i = 0; i < myArray.length; i++) {
    //       myArray[i] = deserialize(myArray[i]);
    //     }
    //     return myArray;
    //   case 'Object':
    //     myObject = JSON.parse(string.value);
    //     for (const key in myObject) {
    //       myObject[key] = deserialize(myObject[key]);
    //     }
    //     return myObject;
    //   case 'Date':
    //     return new Date(string.value);
    //   case 'Error':
    //     return Error(string.value);
    // }
    
  }

}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
