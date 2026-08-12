const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.enviarNotificacionPush = functions.https.onCall(async (data, context) => {
  const { titulo, mensaje, url } = data;

  try {
    // 1. Obtener todos los tokens guardados en Firestore
    const tokensSnapshot = await admin.firestore()
      .collection('tokens_notificaciones')
      .where('tenantId', '==', 'la-poderosa-4b6ab')
      .get();

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      return { success: false, error: 'No hay dispositivos registrados para recibir notificaciones' };
    }

    // 2. Crear el payload de la notificación
    const message = {
      notification: {
        title: titulo,
        body: mensaje,
        icon: '/logo.png'
      },
      data: {
        url: url || '/'
      },
      tokens: tokens
    };

    // 3. Enviar la notificación a todos los dispositivos
    const response = await admin.messaging().sendMulticast(message);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    };

  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return { success: false, error: error.message };
  }
});