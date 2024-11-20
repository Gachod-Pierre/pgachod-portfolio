/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2rn8khg6",
    "name": "imageProjet",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ijt4wob0",
    "name": "descriptionProjet",
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
  collection.schema.removeField("2rn8khg6")

  // remove
  collection.schema.removeField("ijt4wob0")

  return dao.saveCollection(collection)
})
