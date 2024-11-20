/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "rmmfsm8n0gslp1t",
    "created": "2024-10-14 08:55:50.595Z",
    "updated": "2024-10-14 08:55:50.595Z",
    "name": "projets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "avqo6yxc",
        "name": "nomProjet",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "elgkvjeo",
        "name": "dateProjet",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rmmfsm8n0gslp1t");

  return dao.deleteCollection(collection);
})
