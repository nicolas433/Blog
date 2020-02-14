const { test, trait } = use('Test/Suite')('Session');

const { subHours, format } = require('date-fns');

const Mail = use('Mail');
const Hash = use('Hash');
// const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('It should make a post', async ({ assert, client }) => {});
