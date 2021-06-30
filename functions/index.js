const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = admin.initializeApp();
const db = app.firestore()

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

/*
1. Accept post request met JSON body.
2. Pak name uit JSON body.
3. Stuur JSON response terug.
4. In deze JSON response wordt de name field verwerkt.

5. Document moet worden overschreven bij elk request. 
6. We willen checken wat de timestamp van de vorige request is.
*/

exports.helloWorld = functions.https.onRequest(async (request, response) => {
  if (request.method !== "POST") {
    return response.json({
      'Error': 'Request type not supported',
    });
  }

  const { name } = request.body;

  if (!name) {
    return response.json({
      'Error': 'Name property is required',
    });
  }

  const collection = db.collection('functions').doc('Requests');

  // Read a document, if it exists.
  const doc = await collection.get();
  const { timestamp } = doc.data() || {};

  // Create / overwrite a document 
  await collection.set({
    timestamp: Date.now(),
  });

  return response.json({
    'name': `Hello ${name}`,
    ...( timestamp && { timestamp: `Timestamp: ${timestamp}` } )
  });
});

