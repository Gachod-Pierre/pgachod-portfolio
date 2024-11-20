/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wtpskuit",
    "name": "typeProjet",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t")

  // remove
  collection.schema.removeField("wtpskuit")

  return dao.saveCollection(collection)
})
