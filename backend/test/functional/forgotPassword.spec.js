const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Session');

const Mail = use('Mail');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');


trait('Test/ApiClient');
trait('DatabaseTransactions');

beforeEach(() => {
  Mail.fake();
})

afterEach(() => {
  Mail.restore();;
})

async function generateForgotPasswordToken(email, client) {
  const user = await Factory
    .model('App/Models/User')
    .create({ email });

  await client
    .post('/forgot')
    .send({ email })
    .end();

  const token = await user.tokens().first();

  return token;
}


test('It should send an email with reset password instructions',
  async ({ assert, client }) => {
    const email = 'ngrisoste@gmail.com';
    const token = await generateForgotPasswordToken(email, client);

    const recentEmail = Mail.pullRecent();

    assert.equal(recentEmail.message.to[0].address, email);

    assert.include(token.toJSON(), {
      type: 'forgotpassword'
    });
  });


  test('It should be able to reset password',
  async ({ assert, client }) => {
    const email = 'ngrisoste@gmail.com';
    const token = await generateForgotPasswordToken(email, client);

    await client.post('/reset')
      .send({
        token,
        password: '123456',
        password_confirmation: '123456'
      })
      .end();

      const user = await User.findBy('email', email);
      const checkPassword = await Hash.verify('123456', user.password);

      assert.isTrue(checkPassword);

  }
)
