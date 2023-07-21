import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRouter from "./app/routes/auth.routes.js";
import userRouter from "./app/routes/user.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'ESGI B3 AL Express API with Swagger',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      contact: {
        name: "ESGI",
        url: "",
        email: "ESGI@ESGI.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./app/routes/*.js"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter the token for authentication"
    },
  },
};

const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions); // swagger configuration

const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // swagger route
const Role = db.role;

db.mongoose
        .connect(`mongodb://${process.env.HOST}:${process.env.PORTDB}/${process.env.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Connexion réussie à MongoDB.");
            initial().then(() => {
                console.log("Initialisation des roles");
            });
        })
        .catch(err => {
            console.error("Erreur de connexion", err);
            process.exit();
        });



// set port, listen for requests
const PORT =  process.env.PORTWEB || process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Le serveur fonctionne sur le port : ${PORT}.`);
});

/**
 * Verification des roles éxistant si il manque des roles il vont automatiquement etre ajouté en base dans la table role
 * @returns {Promise<void>}
 */
async function initial() {
    const [roles] = await Promise.all([Role.find({})]);
    if (roles.length === 0) {
        try {
            const requiredRoles = ["provider", "client", "admin","super-admin", "new_user"];
            const newRoles = requiredRoles.map((role) => new Role({ name: role }));
            await Promise.all(newRoles.map((role) => role.save()));
            console.log("Les rôles ont été ajoutés à la collection !");
        } catch (err) {
            console.error("Une erreur est survenue lors de l'ajout des rôles :", err);
        }
    } else {
        const roleNames = roles.map((role) => role.name);
        const requiredRoles = ["provider", "client", "admin","super-admin", "new_user"];
        const missingRoles = requiredRoles.filter((role) => !roleNames.includes(role));
        if (missingRoles.length > 0) {
            console.error(`La liste des rôles ne contient pas les rôles suivants : ${missingRoles.join(", ")}`);
            const newRoles = missingRoles.map((role) => new Role({ name: role }));
            await Promise.all(newRoles.map((role) => role.save()));
            console.log("Les rôles manquants ont été ajoutés à la collection !");
        } else {
            console.log("La liste des rôles est correcte !");
        }
    }
}
