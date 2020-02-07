'use strict'

const Mail = use('Mail');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request }) {
    const email = request.input('email');

    const user = await User.findByOrFail('email', email);

    await Mail.send('emails.forgotpassword', { name: user.name }, (message) => {
      message
        .to(user.email)
        .from('ngrisoste2@gmail.com')
        .subject('Blog password retrieval.')
    })
  }
}

module.exports = ForgotPasswordController
