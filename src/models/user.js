// npm install --save neo4j-driver
// node example.js
import {nanoid} from "nanoid";

const neo4j = require("neo4j-driver");
require('dotenv').config()
const {
    url,
    db_username,
    db_password,
    database,

} = process.env

const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));

const session = driver.session({database});

const findAll = async () => {
    const result = await  session.run(`MATCH (u:User) return u`)
    return result.records.map(i=>i.get('u').properties)
}

const findById = async (id) => {
    const result = await  session.run(`MATCH (u:User {_id: '${id}'}) return u limit 1`)
    return result.records[0].properties
}
const create = async (user) => {
    const unique_id = nanoid(8)
    await  session.run(`CREATE (u:User {_id: '${unique_id}', name: '${user.name}', email: '${user.email}', password: '${user.password}'}) return u `)
    return await findById(unique_id)
}
const findByIdUpdate = async (id, user) => {
    const result = await  session.run(`MATCH (u:User {_id: '${id}') SET name = '${user.name}', email = '${user.email}', password = '${user.password}'} return u `)
    return result.records[0].properties
}
const findByIdAndDelete = async (id) => {
    await  session.run(`MATCH (u:User {_id: '${id}')  DELETE u `)
    return await findAll()
}

export default {
    findAll,
    findById,
    create,
    findByIdUpdate,
    findByIdAndDelete
}
