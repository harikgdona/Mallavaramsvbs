const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mallavaramsvbs.firebaseio.com'
});

const db = admin.firestore();

async function clearOversizedFields() {
  try {
    const docRef = db.collection('config').doc('siteContent');
    
    // Delete only the large image fields
    await docRef.update({
      aboutImages: admin.firestore.FieldValue.delete(),
      activitiesPhotos: admin.firestore.FieldValue.delete(),
      annadanamPhotos: admin.firestore.FieldValue.delete(),
      templeHistoryImages: admin.firestore.FieldValue.delete()
    });
    
    console.log('✓ Successfully cleared oversized image fields from Firestore');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error clearing fields:', error.message);
    process.exit(1);
  }
}

clearOversizedFields();
