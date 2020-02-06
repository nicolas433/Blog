const { test, trait } = use('Test/Suite')('Session');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient')

test("It should return JWT token when session created",
async ({ assert, client }) => {
  const user = await User.create({
    name: "Nicolas",
    email: "ngrisoste@gmail.com",
    password: "12346722"
  });

  const response = await client
    .post('/sessions')
    .send({
      email: "ngrisoste@gmail.com",
      password: "12346722"
    })
    .end();
  response.assertStatus(200);
  assert.exists(response.body.token);
});
