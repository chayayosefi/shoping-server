const exp = require('express')

require('./db')

const app = exp();

const port = process.env.PORT || 1000;

app.use(exp.json())
app.use(require('cors')())
app.use('/admin', require('./routes/admin'))
app.use('/user', require('./routes/user'))
app.use('/main', require('./routes/main'))
app.use('/actions', require('./routes/actions'))

app.listen(port, () => console.log(`The server is running on port ${port}`));