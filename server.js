import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRouter from "./app/routes/auth.routes.js";
import userRouter from "./app/routes/user.routes.js";
import userTvRouter from "./app/routes/userTv.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import tvRouter from "./app/routes/tv.routes.js";
dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",

    info: {
      title: "ESGI B3 AL Express API with Swagger",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      version: "1.0.0",
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app/routes/*.js"],
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Users",
      description: "API endpoints for managing users",
    },
    {
      name: "Roles",
      description: "API endpoints for managing roles",
    },
    {
      name: "TV",
      description: "API endpoints for managing TV shows",
    },
  ],
  definitions: {
    User: {
      type: "object",
      properties: {
        username: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        roles: {
          type: "array",
          items: {
            type: "string",
          },
        },
        tv: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
    Role: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
    TV: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
        },
        name: {
          type: "string",
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/User",
                  },
                },
                example: [
                  {
                    username: "user1",
                    email: "user1@example.com",
                    roles: ["role1"],
                    tv: ["tv_id1", "tv_id2"],
                  },
                  {
                    username: "user2",
                    email: "user2@example.com",
                    roles: ["role2"],
                    tv: ["tv_id2", "tv_id3"],
                  },
                ],
              },
            },
          },
        },
      },
      // Add other routes for users here...
    },
    "/api/roles": {
      get: {
        tags: ["Roles"],
        summary: "Get all roles",
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Role",
                  },
                },
                example: [
                  {
                    name: "role1",
                  },
                  {
                    name: "role2",
                  },
                ],
              },
            },
          },
        },
      },
      // Add other routes for roles here...
    },
    "/api/tv": {
      get: {
        tags: ["TV"],
        summary: "Get all TV shows",
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/TV",
                  },
                },
                example: [
                  {
                    id: 1,
                    name: "TV Show 1",
                    // Add other properties here...
                  },
                  {
                    id: 2,
                    name: "TV Show 2",
                    // Add other properties here...
                  },
                ],
              },
            },
          },
        },
      },
      // Add other routes for TV shows here...
    },
  },
};
const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions); // swagger configuration
const TV = db.tv;
const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/", userRouter);
app.use("/api/usersTv", userTvRouter);
app.use("/api/tv", tvRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // swagger route
const Role = db.role;

db.mongoose
  .connect(
    `mongodb://${process.env.HOST}:${process.env.PORTDB}/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connexion réussie à MongoDB.");
    initial().then(() => {
      console.log("Initialisation des roles");
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion", err);
    process.exit();
  });

// set port, listen for requests
const PORT = process.env.PORTWEB || process.env.PORT;
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
      const requiredRoles = [
        "provider",
        "client",
        "admin",
        "super-admin",
        "new_user",
      ];
      const newRoles = requiredRoles.map((role) => new Role({ name: role }));
      await Promise.all(newRoles.map((role) => role.save()));
      console.log("Les rôles ont été ajoutés à la collection !");
    } catch (err) {
      console.error("Une erreur est survenue lors de l'ajout des rôles :", err);
    }
  } else {
    const roleNames = roles.map((role) => role.name);
    const requiredRoles = [
      "provider",
      "client",
      "admin",
      "super-admin",
      "new_user",
    ];
    const missingRoles = requiredRoles.filter(
      (role) => !roleNames.includes(role)
    );
    if (missingRoles.length > 0) {
      console.error(
        `La liste des rôles ne contient pas les rôles suivants : ${missingRoles.join(
          ", "
        )}`
      );
      const newRoles = missingRoles.map((role) => new Role({ name: role }));
      await Promise.all(newRoles.map((role) => role.save()));
      console.log("Les rôles manquants ont été ajoutés à la collection !");
    } else {
      console.log("La liste des rôles est correcte !");
    }
  }
}

async function logTVCount() {
  try {
    const count = await TV.countDocuments();
    console.log(`Nombre d'ID dans la collection "tv" : ${count}`);
  } catch (err) {
    console.error("Erreur lors du comptage des documents :", err);
  }
}

logTVCount();
