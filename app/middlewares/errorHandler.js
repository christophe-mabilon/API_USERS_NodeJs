export async function responseUsersErrors(req, res) {
  switch (req.status) {
    case 400:
      return res.status(400).send({
        message: "La syntaxe de la requête est erronée. !",
      });
    case 401:
      return res.status(401).send({
        message:
          "Une authentification est nécessaire pour accéder à la ressource,et vous n'avez pas les droits pour accéder à cette page !",
      });
    case 402:
      return res.status(402).send({
        message: "Paiement requis pour accéder à la ressource !",
      });
    case 403:
      return res.status(403).send({
        message:
          "Le serveur a compris la requête, mais refuse de l'exécuter. !",
      });
    case 404:
      return res.status(404).send({
        message: "Aucun utilisateur trouvé !",
      });
    case 500:
      return res.status(500).send({
        message: "Erreur server",
      });
  }
}

export async function responseRoleErrors(req, res) {
  console.log(res);
  switch (req.status) {
    case 400:
      return res.status(400).send({
        message: "La syntaxe de la requête est erronée. !",
      });
    case 401:
      return res.status(401).send({
        message:
          "Non autorisé ! : Une authentification est nécessaire pour accéder à la ressource,et vous n'avez pas les droits pour accéder à cette page !",
      });
    case 402:
      return res.status(402).send({
        message: "Paiement requis pour accéder à la ressource !",
      });
    case 403:
      return res.status(403).send({
        message: "Le serveur a compris la requête, mais refuse de l'exécuter !",
      });
    case 404:
      return res.status(404).send({
        message: "Aucun role trouvé !",
      });
    case 500:
      return res.status(500).send({
        message: "Erreur server",
      });
  }
}

export async function responseTvErrors(req, res) {
  switch (req.status) {
    case 400:
      return res.status(400).send({
        message: "La syntaxe de la requête est erronée. !",
      });
    case 401:
      return res.status(401).send({
        message:
          "Une authentification est nécessaire pour accéder à la ressource,et vous n'avez pas les droits pour accéder à cette page !",
      });
    case 402:
      return res.status(402).send({
        message: "Paiement requis pour accéder à la ressource !",
      });
    case 403:
      return res.status(403).send({
        message:
          "Le serveur a compris la requête, mais refuse de l'exécuter. !",
      });
    case 404:
      return res.status(404).send({
        message: "Aucun serie TV trouvé !",
      });
    case 500:
      return res.status(500).send({
        message: "Erreur server",
      });
  }
}

export async function responseJwtErrors(req, res) {
  switch (req.name) {
    case "TokenExpiredError":
      return res.status(401).send({
        message: "Le jeton d'authentification a expiré!",
      });
    case 400:
      return res.status(400).send({
        message: "La syntaxe de la requête est erronée!",
      });
    case 401:
      return res.status(401).send({
        message:
          "Une authentification est nécessaire pour accéder à la ressource, et vous n'avez pas les droits pour accéder à cette page!",
      });
    case 402:
      return res.status(402).send({
        message: "Paiement requis pour accéder à la ressource!",
      });
    case 403:
      return res.status(403).send({
        message: "Le serveur a compris la requête, mais refuse de l'exécuter!",
      });
    case 404:
      return res.status(404).send({
        message: "Aucune série TV trouvée!",
      });
    case 500:
      return res.status(500).send({
        message: "Erreur serveur",
      });
    default:
      return res.status(500).send({
        message: "Une erreur inattendue s'est produite!",
      });
  }
}

const responseErrors = {
  responseUsersErrors,
  responseRoleErrors,
  responseTvErrors,
  responseJwtErrors,
};

export default responseErrors;
