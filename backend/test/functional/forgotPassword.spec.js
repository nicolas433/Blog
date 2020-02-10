const { test, trait } = use('Test/Suite')('Session');

const { subHours, format } = require('date-fns');

const Mail = use('Mail');
const Hash = use('Hash');
//const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');


trait('Test/ApiClient');
trait('DatabaseTransactions');

test('It should send an email with reset password instructions',
  async ({ assert, client }) => {
    Mail.fake();
    const email = 'ngrisoste@gmail.com';

    const user = await Factory
      .model('App/Models/User')
      .create({ email });

    await client
      .post('/forgot')
      .send({ email })
      .end();

    const token = await user.tokens().first();

    const recentEmail = Mail.pullRecent();

    assert.equal(recentEmail.message.to[0].address, email);

    assert.include(token.toJSON(), {
      type: 'forgotpassword'
    });

    Mail.restore();
  }
);


test('It should be able to reset password',
  async ({ assert, client }) => {
    const email = 'ngrisoste@gmail.com';

    const user = await Factory.model('App/Models/User').create({ email });
    const userToken = await Factory.model('App/Models/Token').make();

    await user.tokens().save(userToken);


    const { token } = await Factory
      .model('App/Models/Token')
      .create({ type: 'forgotpassword' });

    const response = await client.post('/reset')
      .send({
        token: userToken.token,
        password: '123456',
        password_confirmation: '123456',
        created_at: userToken.created_at
      })
      .end();

    response.assertStatus(204);

    await user.reload();
    const checkPassword = await Hash.verify('123456', user.password);

    assert.isTrue(checkPassword);

  }
);

test('It cannot reset password after 2h of forgot password request',
  async ({ assert, client }) => {
    const dateWithSub = format(subHours(new Date(), 5), 'yyyy-MM-dd HH:ii:ss');

    const email = 'ngrisoste@gmail.com';

    const user = await Factory.model('App/Models/User').create({ email });
    const userToken = await Factory.model('App/Models/Token').make();

    await user.tokens().save(userToken);
    const { token } = await Factory
      .model('App/Models/Token')
      .create({ type: 'forgotpassword' });

    userToken.created_at = dateWithSub;
    await userToken.save();
    /*
    await Database
      .table('tokens')
      .where('token', userToken)
      .update('created_at', dateWithSub);

    await userToken.reload();
    */
    //console.log(userToken.created_at);
    const response = await client.post('/reset')
      .send({
        token: userToken.token,
        password: '123456',
        password_confirmation: '123456',
        created_at: userToken.created_at
      })
      .end();

    response.assertStatus(400);
  }
);
