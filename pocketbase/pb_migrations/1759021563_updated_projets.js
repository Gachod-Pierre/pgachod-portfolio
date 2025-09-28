/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vn6lqueh",
    "name": "lienProjet",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t")

  // remove
  collection.schema.removeField("vn6lqueh")

  return dao.saveCollection(collection)
})
