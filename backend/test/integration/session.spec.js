const { test } = use('Test/Suite')('Session');

/**@type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

test("autenticou a sessão, irmão", async () => {
  const user = await User.create({

  })
});
