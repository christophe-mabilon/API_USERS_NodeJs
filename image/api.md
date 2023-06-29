### Introduction :

Les architectures orientées services sont devenues essentielles dans le développement d'applications Web modernes. Parmi les différentes approches, **REST** (Representational State Transfer) est devenu un standard largement adopté pour concevoir des **API** Web évolutives et interopérables. Ce travail de recherche se concentre sur les principes fondamentaux de **REST**, tels qu'expliqués dans le site officiel, et explore comment ils peuvent être mis en œuvre avec Node.js et Express pour créer des **API** **REST**ful.

### Effectuez une Présentation de **REST** :

**Définition de **REST****

Definissez les concepts clés : ressources, représentation, **URI** (Uniform Resource Identifier), méthodes HTTP, CRUD, etc.
Citez les Avantages de l'approche **REST** dans la conception d'**API** Web.
Listez et illustrez par des exemples de code les principes **REST** ```

Définition de **REST** :

**REST**, acronyme de Representational State Transfer, est un style architectural qui définit un ensemble de principes pour concevoir des systèmes distribués. Il repose sur l'idée de représenter les ressources du système sous forme d'**URI** (Uniform Resource Identifier) et d'interagir avec ces ressources en utilisant les méthodes HTTP standard.

## Concepts clés :

### 1. Ressources :

Dans le contexte d'une API REST, une ressource est une entité spécifique du système, telle qu'un utilisateur, un article, une photo, etc. Chaque ressource est identifiée de manière unique par une **URI**.
Avec Express.js, vous pouvez facilement définir des "routes" qui correspondent à différentes ressources dans votre système. Par exemple, vous pourriez avoir une route pour les livres (/livres) et une autre pour les auteurs (/auteurs).

Ce module (`Express`) permet de définir des routes pour les différentes opérations CRUD (voir après).

Exemple de code :

```javascript
  const express = require('express'); // Ancien import de module
  import express from 'express';
  const app = express();
```

On utilise `import` et non plus `require` pour importer le module express car on utilise la `syntaxe ES6` qui permet d'`importer des modules spécifiquement sans avoir à importer tout le module`,  c'est donc moins lourd à installer. `require` est une instruction node js qui utilise `CommonJs` pour importer des modules. `import` est une instruction ES6 qui utilise ES6 pour importer des modules.
(sources : https://www.delftstack.com/fr/howto/javascript/javascript-import-vs-require/)

Pour définir une route, on utilise la méthode **get** de **express**. Cette méthode prend en paramètre le chemin de la route et une fonction de rappel qui sera exécutée lorsque la route sera appelée. `Express()` est une fonction qui prend en paramètre le chemin de la route et une fonction de rappel qui sera exécutée lorsque la route sera appelée.

* Utilisation des méthodes HTTP pour les opérations CRUD :

  * `GET` : récupérer des données
  * `POST` : créer une ressource
  * `PUT` : mettre à jour une ressource
  * `DELETE` : supprimer une ressource

Pour utiliser ses méthodes HTTP, on utilise des méthodes `express`.

*sources* :

- https://expressjs.com/fr/api.html#app

### 2. Représentation :

Une représentation est une forme structurée de données qui décrit l'état ou le contenu d'une ressource. Il peut s'agir de données au format JSON, XML, HTML, etc. Dans le cas d'une API Node, on peut utiliser Express.js pour renvoyer des données dans le format souhaité par le client. Par exemple, vous pouvez renvoyer des données en JSON, en XML, etc.

Exemple de code :

```javascript
app.get('/livres', (req, res) => {
  res.json({livres: []});
});
```

### 3. **URI** (Uniform Resource Identifier) :

Une **URI** est une chaîne de caractères qui identifie de manière unique une ressource. Elle est utilisée pour accéder et manipuler les ressources via les **API****REST**. Contrairement à une **URL**, une **URI** ne fait pas référence à l'emplacement de la ressource, mais à son identité. Par exemple, l'**URI** ``/users/1`` identifie l'utilisateur ayant l'identifiant 1, mais ne fait pas référence à son emplacement.

Chaque route que vous définissez avec Express.js est une URI qui peut être utilisée pour accéder à une ressource spécifique. Par exemple, la route ``/livres`` peut être utilisée pour accéder à la liste des livres, tandis que la route ``/livres/1`` peut être utilisée pour accéder à un livre spécifique.

Exemple de code :

```javascript
app.get('/livres', (req, res) => { // Route pour accéder à la liste des livres
  res.json({livres: []});
});
app.get('/livres/1', (req, res) => { // Route pour accéder à un livre spécifique
  res.json({livre: {}});
});
```

*sources* :

- https://expressjs.com/fr/guide/routing.html

### 4 & 5. Méthodes HTTP & CRUD :

Les méthodes HTTP, telles que `GET, POST, PUT, DELETE`, permettent d'effectuer des opérations sur les ressources. Chaque méthode a une signification spécifique : `GET` pour récupérer des données, `POST` pour créer une ressource, `PUT` pour mettre à jour une ressource, `DELETE` pour supprimer une ressource, etc.

Avec Express.js, vous pouvez facilement définir des handlers pour différentes méthodes HTTP sur chaque route. De plus, Mongoose facilite l'exécution d'opérations CRUD sur vos ressources en MongoDB. Par exemple, vous pouvez utiliser la méthode .find() de Mongoose pour lire des données, la méthode .create() pour créer de nouvelles données, etc.

Exemple de code :

```javascript
app.get('/livres', (req, res) => { // Route pour accéder à la liste des livres
  res.json({livres: []});
});
app.post('/livres', (req, res) => { // Route pour créer un livre
  res.json({livre: {}});
});
app.put('/livres/1', (req, res) => { // Route pour mettre à jour un livre
  res.json({livre: {}});
});
app.delete('/livres/1', (req, res) => { // Route pour supprimer un livre
  res.json({livre: {}});
});
```

A noter que l'on peut définir les headers qui seront utilisés pour les requêtes. On autorise toutes les origines avec `Access-Control-Allow-Origin: '*'`. On autorise les méthodes `OPTIONS, GET, POST, PUT, PATCH, DELETE` avec `Access-Control-Allow-Methods`. On autorise les headers `Content-Type, Authorization` avec `Access-Control-Allow-Headers`.

```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```
*sources* :

- https://dev.to/ericlecodeur/nodejs-express-partie-4-creer-un-crud-api-4mn5

Citez les Avantages de l'approche REST dans la conception d'API Web :

- REST est facile à comprendre et à mettre en œuvre car il utilise les méthodes HTTP bien connues.
- REST est facilement extensible pour supporter de nouveaux verbes HTTP et de nouveaux formats de données.
- REST est plus performant car il n'implique pas d'état de session, c'est à dire qu'il n'y a pas de sessions client à maintenir. Cela le rend plus adapté aux applications Web évolutives.
- REST est plus flexible et plus adapté aux applications mobiles et aux sites Web car il utilise le format JSON.

# Construction d'une API REST avec Node.js et Express

## Liaison à la base de données

Pour se connecter à la base de données, nous allons utiliser le module **mongoose**. Ce module permet de définir des schémas pour les documents de la base de données et de les manipuler facilement.

Exemple de code :

```javascript
  import mongoose from 'mongoose';
```

Il faut ensuite se connecter à la base de données en utilisant la méthode **connect** de **mongoose**. Cette méthode prend en paramètre l'**URI** de la base de données et renvoie une promesse qui sera résolue lorsque la connexion sera établie.

Exemple de code :

Dans un dossier à part `db` créer un fichier `connectDB.js` et y mettre le code suivant :

```javascript
  import mongoose from 'mongoose';

  const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/TV', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
    }
  };

  module.exports = connectDB;
```

  Dans le fichier `server.js` importer le fichier `connectDB.js` et appeler la fonction `connectDB` :

```javascript
  const connectDB = require('./db/connectDB');

  connectDB();
```

*sources* :

- https://mongoosejs.com/docs/connections.html

## Routing

Pour le routage, nous allons utiliser le module **express**.

Exemple de code avec Node.js et Express pour une **API****REST**ful pour la gestion des utilisateurs :

- Récupérer tous les utilisateurs (GET) :

```javascript
app.get('/users', (req, res) => {
  // Logique pour récupérer tous les utilisateurs depuis la base de données
  // Renvoyer la liste des utilisateurs en tant que réponse
});
```

- Récupérer un utilisateur par son ID (GET) :

```javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Logique pour récupérer l'utilisateur avec l'ID spécifié depuis la base de données
  // Renvoyer l'utilisateur en tant que réponse
});
```

- Créer un nouvel utilisateur (POST) :

```javascript
app.post('/users', (req, res) => {
  const userData = req.body; // Données de l'utilisateur envoyées dans le corps de la requête
  // Logique pour créer un nouvel utilisateur dans la base de données
  // Renvoyer l'utilisateur créé en tant que réponse
});
```

- Mettre à jour un utilisateur existant (PUT) :

```javascript
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body; // Données mises à jour de l'utilisateur envoyées dans le corps de la requête
  // Logique pour mettre à jour l'utilisateur avec l'ID spécifié dans la base de données
  // Renvoyer l'utilisateur mis à jour en tant que réponse
});
```

*sources* :

- https://www.knowledgehut.com/blog/programming/rest-api

## Middleware & Controllers pour authentifier les utilisateurs

Pour authentifier les utilisateurs, nous allons utilisons un middleware et un controller. Le middleware est un étape intermédiaire entre la requête et la réponse. Il peut effectuer des opérations sur la requête et la réponse et appeler la fonction `next` pour passer la main au middleware suivant.

![1688047641638](image/api/1688047641638.png)

### Middleware

Pour mettre en place une authentification, on peut utiliser le module **jsonwebtoken**. C'est un module qui permet de générer des jetons d'authentification. Un jeton d'authentification est un jeton qui contient des informations sur l'utilisateur et qui est signé avec une clé secrète. Lorsqu'un utilisateur se connecte, un jeton d'authentification est généré et renvoyé à l'utilisateur. Lorsque l'utilisateur envoie une requête, le jeton d'authentification est vérifié et l'utilisateur est autorisé à accéder à la ressource demandée.

Exemple de code côté Middleware :

```javascript
  import jwt from 'jsonwebtoken';

  // Créé un middleware pour vérifier le token d'authentification
  module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
  };
```

### Controllers

Une fois les étapes précédentes effectuées, nous pouvons créer les contrôleurs. Les contrôleurs sont des fonctions qui reçoivent les objets `request` et `response` en tant que paramètres et qui peuvent effectuer des opérations sur ces objets. Les contrôleurs peuvent également appeler la fonction `next` pour passer la main au contrôleur suivant.

Exemple de code côté Controllers utilisé dans une api :

```javascript
  const User = require('../models/user'); // Importation du modèle User
  import bcrypt from 'bcrypt'; // Importation du module bcrypt
  import jwt from 'jsonwebtoken'; // Importation du module jsonwebtoken


  exports.signup = (req, res, next) => {
    const { username, password } = req.body;

    // Vérification des champs requis
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    // Hashage du mot de passe avec bcrypt
    bcrypt.hash(password, 10)
      .then((hash) => {
        // Création d'un nouvel utilisateur avec le mot de passe hashé
        const user = new User({
          username: username,
          password: hash
        });
        // Enregistrement de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès' }))
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username }) // On utilise la méthode findOne() de mongoose pour trouver l'utilisateur dans la base de données qui correspond à l'adresse e-mail entrée par l'utilisateur
    .then(user => {
      // Si on ne trouve pas l'utilisateur, on renvoie une erreur 401 Unauthorized
      if (user == null) {
        return res.status(401).json({ error: 'Paire identifiant / mot de passe incorrect !'});
        // On utilise un message flou pour ne pas donner d'informations sur l'état du serveur au cas où un attaquant tenterait d'exploiter une faille de sécurité
      } else {
        bcrypt.compare(req.body.password, user.password) // On utilise bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .then(valid => {
          // Si les mots de passe ne correspondent pas, on renvoie une erreur 401 Unauthorized
          if (!valid) {
            res.status(401).json({ error: 'Paire identifiant / mot de passe incorrect !'});
          } else {
            // Sinon, on renvoie un statut 200 et un objet JSON avec un userID et un token
            res.status(200).json({
              userId: user._id,
              token : jwt.sign(
                { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
              )
            })
          }
        })
        .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
  };
```

`bcrypt` est un module qui permet de hasher les mots de passe. Il est important de ne pas stocker les mots de passe en clair dans la base de données. Le mot de passe est hashé avec une clé secrète de la forme `./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$.` Le hashage est une opération irréversible. Il est donc impossible de retrouver le mot de passe à partir du hash. Lorsque l'utilisateur se connecte, le mot de passe entré est hashé et comparé au hash enregistré dans la base de données. Si les deux hash correspondent, l'utilisateur est authentifié.

*sources* :

- https://www.npmjs.com/package/bcrypt

## Models

Les modèles sont des schémas qui définissent la structure des données qui seront stockées dans la base de données. Les modèles sont créés avec le module **mongoose**. Les modèles sont utilisés pour créer des objets qui seront stockés dans la base de données.

Exemple de models user utilisé dans une api :

```javascript
  import mongoose from 'mongoose'; // Importation du module mongoose

  const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Le nom d'utilisateur doit être unique
    password: { type: String, required: true }
  });

  module.exports = mongoose.model('User', userSchema); // Exportation du modèle pour pouvoir l'utiliser dans les autres fichiers du projet
```

*sources* :

- https://mongoosejs.com/docs/models.html

## Liens utiles :

- https://dev.to/ericlecodeur/nodejs-express-partie-1-introduction-5dg7
- https://www.linkedin.com/pulse/les-5-r%C3%A8gles-%C3%A0-suivre-pour-impl%C3%A9menter-restful-api-hamadi-chaabani/?originalSubdomain=fr
- https://restfulapi.net/
