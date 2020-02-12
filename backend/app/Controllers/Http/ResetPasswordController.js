'use strict'

const { isBefore, subHours } = require('date-fns');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

class ResetPasswordController {
  async store({ request, response }) {
    const { token, password } = request.only([
      'token',
      'password'
    ]);

    const userToken = await Token.findByOrFail('token', token);

    const {created_at} = userToken;

    if (isBefore(created_at, subHours(new Date(), 2))) {
      return response.status(400).json({ error: 'Invalid date range, please send a new forgot password request.' });
    }
    const user = await userToken.user().fetch();
    user.password = password;
    await user.save();
  }
}

module.exports = ResetPasswordController
