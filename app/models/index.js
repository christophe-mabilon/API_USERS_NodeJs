import mongoose from 'mongoose';
mongoose.Promise = globalThis.Promise;

const db = {};

db.mongoose = mongoose;

import user from './user.model.js';
import role from './role.model.js';

db.user = user
db.role = role;

db.ROLES = ["provider", "client", "admin","new_user"];

export default db;